const Blog = require('../models/Blog');
const sanitizeHtml = require('sanitize-html');

// ====================== CREATE BLOG ======================
exports.createBlog = async (req, res) => {
  try {
    const images = req.files.map(f => f.filename);
    let content = req.body.content;

    // Ensure content is an array
    if (typeof content === 'string') {
      content = JSON.parse(content);
    }

    if (!Array.isArray(content) || content.length === 0) {
      return res.status(400).json({ message: 'Content must be a non-empty array of paragraphs' });
    }

    // ✅ Sanitize blog title and content paragraphs
    const sanitizedTitle = sanitizeHtml(req.body.title, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const sanitizedContent = content.map(paragraph =>
      sanitizeHtml(paragraph, {
        allowedTags: [],
        allowedAttributes: {},
      })
    );

    const blog = new Blog({
      employer: req.user.userId,
      title: sanitizedTitle,
      content: sanitizedContent,
      images,
    });

    await blog.save();

    res.status(201).json({ message: 'Blog created', blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// ====================== GET ALL BLOGS ======================
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('employer', 'name').sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// ====================== LIKE BLOG ======================
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.likes.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    blog.likes.push(req.user.userId);
    await blog.save();
    res.status(200).json({ message: 'Blog liked', likes: blog.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to like blog' });
  }
};

// ====================== COMMENT ON BLOG ======================
exports.commentBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // ✅ Sanitize comment text
    const sanitizedText = sanitizeHtml(req.body.text, {
      allowedTags: [],
      allowedAttributes: {},
    });

    blog.comments.push({
      commenter: req.user.userId,
      text: sanitizedText,
    });

    await blog.save();
    res.status(200).json({ message: 'Comment added', comments: blog.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to comment' });
  }
};

// ====================== GET BLOG BY ID ======================
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId)
      .populate('employer', 'name')
      .populate('comments.commenter', 'name');

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};
  
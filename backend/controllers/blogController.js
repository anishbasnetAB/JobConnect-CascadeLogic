const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const images = req.files.map(f => f.filename);

    // Ensure content is an array (in case frontend sends it as string accidentally)
    let content = req.body.content;
    if (typeof content === 'string') {
      content = JSON.parse(content);  // Handle stringified array
    }

    if (!Array.isArray(content) || content.length === 0) {
      return res.status(400).json({ message: 'Content must be a non-empty array of paragraphs' });
    }

    const blog = new Blog({
      employer: req.user.userId,
      title: req.body.title,
      content,
      images
    });

    await blog.save();

    res.status(201).json({ message: 'Blog created', blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('employer', 'name').sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

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

exports.commentBlog = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.comments.push({
      commenter: req.user.userId,
      text
    });

    await blog.save();
    res.status(200).json({ message: 'Comment added', comments: blog.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to comment' });
  }
};

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
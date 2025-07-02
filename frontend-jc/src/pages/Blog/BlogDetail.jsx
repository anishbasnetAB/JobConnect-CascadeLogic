import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';
import profileIcon from '../../assets/pp.png';  // ✅ Import your profile icon

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState('');

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${blogId}`);
      setBlog(res.data);
    } catch (err) {
      console.error('Failed to fetch blog:', err);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/blogs/${blogId}/like`);
      fetchBlog();
    } catch (err) {
      console.error('Failed to like blog:', err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`/blogs/${blogId}/comment`, { text: commentText });
      setCommentText('');
      fetchBlog();
    } catch (err) {
      console.error('Failed to comment:', err);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  if (!blog) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-1">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-4">By {blog.employer?.name || 'Unknown'}</p>

        <div className="space-y-3 text-justify text-gray-700">
          {blog.content.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {blog.images && blog.images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {blog.images.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000/uploads/${img}`}
                alt={`Blog image ${idx + 1}`}
                className="w-full h-64 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-block bg-gray-200 text-sm text-gray-700 px-2 py-1 rounded">
            {blog.likes.length} Likes
          </span>
          <button
            onClick={handleLike}
            className="border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
          >
            Like
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <div className="space-y-3">
            {blog.comments.map((c) => (
              <div key={c._id} className="flex items-start gap-2 border-b border-gray-200 pb-2">
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-800 font-semibold">{c.commenter?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-700 text-justify">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment"
              className="w-full border rounded p-2 text-sm"
              rows={3}
            />
            <button
              onClick={handleComment}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
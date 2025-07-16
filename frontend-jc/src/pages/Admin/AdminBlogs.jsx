import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(res.data)) {
        setBlogs(res.data);
      } else {
        setBlogs([]);
        console.error('Expected array but got:', res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load blogs');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(blogs.filter((b) => b._id !== id));
      alert('Blog deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">All Blogs</h2>


      {error && <p className="text-red-500 mb-4">{error}</p>}

     <div className="flex justify-center">
  <div className="w-full max-w-2xl overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-t">
                <td className="p-3">{blog.title || 'Untitled'}</td>

                <td className="p-3">
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;
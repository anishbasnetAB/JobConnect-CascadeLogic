import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div 
              key={blog._id} 
              className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col"
            >
              {/* Display image if available */}
              {blog.images && blog.images.length > 0 && (
                <img
                  src={`http://localhost:5000/uploads/${blog.images[0]}`}
                  alt="Blog"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-1">{blog.title}</h2>
                <p className="text-xs text-gray-500 mb-2">By {blog.employer?.name || 'Unknown'}</p>

                <div className="text-sm text-gray-700 text-justify space-y-2 flex-grow">
                  {blog.content && blog.content.length > 0 ? (
                    <>
                      <p>{getSentence(blog.content.join(' '), 1)}</p>
                      <p>{getSentence(blog.content.join(' '), 2)}</p>
                    </>
                  ) : (
                    <p>No description available.</p>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                  className="mt-3 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 self-start"
                >
                  View Blog
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper to get nth sentence
function getSentence(text, n) {
  const sentences = text.split('.').map(s => s.trim()).filter(Boolean);
  return sentences[n - 1] ? sentences[n - 1] + '.' : '';
}

export default BlogList;

// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [employers, setEmployers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);

  const fetchData = async () => {
    try {
      const [employerRes, blogRes, jobRes] = await Promise.all([
        axios.get('/admin/employers'),
        axios.get('/admin/blogs'),
        axios.get('/admin/jobs'),
      ]);
      setEmployers(employerRes.data);
      setBlogs(blogRes.data);
      setJobs(jobRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await axios.delete(`/admin/${type}/${id}`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.userType === 'admin') fetchData();
  }, [user]);

  if (user?.userType !== 'admin') return <p className="text-center text-red-600">Access Denied</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Employers */}
      <section>
        <h2 className="text-xl font-semibold mb-2">All Employers</h2>
        <div className="space-y-2">
          {employers.map((emp) => (
            <div key={emp._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <p className="font-medium">{emp.name}</p>
                <p className="text-sm text-gray-600">{emp.email}</p>
              </div>
              <button
                onClick={() => deleteItem('employer', emp._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Blogs */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">All Blogs</h2>
        <div className="space-y-2">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <p className="font-medium">{blog.title}</p>
                <p className="text-sm text-gray-600">{blog.content?.slice(0, 50)}...</p>
              </div>
              <button
                onClick={() => deleteItem('blog', blog._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Jobs */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">All Jobs</h2>
        <div className="space-y-2">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-gray-600">{job.description?.slice(0, 50)}...</p>
              </div>
              <button
                onClick={() => deleteItem('job', job._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
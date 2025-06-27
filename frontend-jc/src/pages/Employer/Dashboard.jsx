import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/employer/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Jobs', value: stats.jobs.total },
          { label: 'Active Jobs', value: stats.jobs.active },
          { label: 'Total Applicants', value: stats.applicants.total },
          { label: 'Total Blogs', value: stats.blogs.total }
        ].map((item, index) => (
          <div key={index} className="bg-white shadow rounded p-4 text-center">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Applicants per Job</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={stats.applicants.perJob}>
                <XAxis dataKey="jobTitle" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Jobs by Country</h2>
          <div className="space-y-1">
            {Object.entries(stats.jobs.byCountry).map(([country, count]) => (
              <p key={country} className="text-sm text-gray-700">
                {country}: {count}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Blog Summary</h2>
          <p className="text-sm text-gray-700">Total Likes: {stats.blogs.likes}</p>
          <p className="text-sm text-gray-700">Total Comments: {stats.blogs.comments}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
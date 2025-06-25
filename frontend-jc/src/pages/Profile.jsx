import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.age || '');
      setCountry(user.country || '');
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/auth/profile');
      const updated = res.data;
      setName(updated.name || '');
      setAge(updated.age || '');
      setCountry(updated.country || '');
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name, age, country };
      const res = await axios.put('/auth/profile', data);
      alert(res.data.message);
      await fetchProfile(); // Refresh after update
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your age"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your country"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:5000"; // use this to prefix image path if needed

  const fetchEmployers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/employers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployers(res.data || []);
    } catch (error) {
      console.error("Error fetching employers:", error);
    }
  };

  const deleteEmployer = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/employer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployers((prev) => prev.filter((emp) => emp._id !== id));
      alert("Employer deleted successfully!");
    } catch (err) {
      console.error("Error deleting employer:", err.response?.data || err.message);
      alert("Failed to delete employer.");
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Employers</h2>

      {employers.length === 0 ? (
        <p>No employers available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white shadow-md rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Image</th>
                <th className="text-left px-4 py-2 border-b">Name</th>
                <th className="text-left px-4 py-2 border-b">Email</th>
                <th className="text-left px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {employers.map((employer) => (
                <tr key={employer._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {employer.companyCard ? (
                      <img
  src={
    employer.companyCard?.startsWith("http")
      ? employer.companyCard
      : `http://localhost:5000/${
          employer.companyCard?.startsWith("uploads")
            ? employer.companyCard
            : `uploads/${employer.companyCard}`
        }`
  }
  alt="company card"
  className="w-20 h-20 object-cover border rounded"
/>
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{employer.name || "No name"}</td>
                  <td className="px-4 py-2">{employer.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteEmployer(employer._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEmployers;
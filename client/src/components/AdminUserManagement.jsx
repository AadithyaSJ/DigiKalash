import React, { useState, useEffect } from "react";
import API from "../api";
import { FiCheckCircle, FiXCircle, FiSearch, FiTrash2, FiFileText } from "react-icons/fi";

export default function AdminUserManagement() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersRes = await API.get("/users/all-users/");
        setAllUsers(usersRes.data);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  async function handleVerifyUser(username) {
    if (!window.confirm("Are you sure you want to verify this user?")) return;
    try {
      await API.patch(`/users/${username}/verify/`, { is_verified: true });
      setAllUsers((prev) =>
        prev.map((u) => (u.username === username ? { ...u, is_verified: true } : u))
      );
    } catch (err) {
      alert("Failed to verify user.");
    }
  }

  async function handleDeleteUser(username) {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await API.delete(`/users/${username}/delete/`);
      setAllUsers((prev) => prev.filter((u) => u.username !== username));
    } catch (err) {
      alert("Failed to delete user.");
    }
  }

  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-10 text-gray-500">Loading users...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-bold">{error}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 text-sm">Manage user roles, verifications, and access.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-bold border-b border-gray-100">User</th>
              <th className="p-4 font-bold border-b border-gray-100">Role</th>
              <th className="p-4 font-bold border-b border-gray-100 text-center">Verified</th>
              <th className="p-4 font-bold border-b border-gray-100">Contact</th>
              <th className="p-4 font-bold border-b border-gray-100">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{u.username}</p>
                        <p className="text-gray-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm capitalize">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'ARTISAN' ? 'bg-orange-100 text-orange-700' :
                          u.role === 'RESEARCHER' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {u.is_verified ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <FiXCircle className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <p>{u.phone_number || "-"}</p>
                    {(u.artisan_verification_document || u.researcher_credentials) && (
                      <a
                        href={u.artisan_verification_document || u.researcher_credentials}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-600 hover:underline text-xs mt-1"
                      >
                        <FiFileText /> View Doc
                      </a>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {!u.is_verified && (
                        <button
                          onClick={() => handleVerifyUser(u.username)}
                          className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded transition"
                          title="Verify User"
                        >
                          <FiCheckCircle />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u.username)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded transition"
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 bg-gray-50/30">
                  <div className="flex flex-col items-center justify-center">
                    <FiSearch className="text-3xl mb-2 opacity-20" />
                    <p>No users found matching "{search}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

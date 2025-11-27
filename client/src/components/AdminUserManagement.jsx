import React, { useState, useEffect } from "react";
import API from "../api";
import { CheckCircleIcon, XCircleIcon, SearchIcon } from "@heroicons/react/solid";

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
        console.error(err);
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
      console.error(err);
    }
  }

  async function handleDeleteUser(username) {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;
    try {
      await API.delete(`/users/${username}/delete/`);
      setAllUsers((prev) => prev.filter((u) => u.username !== username));
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  }

  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Users</h2>
        <div className="relative w-72">
          <input
            type="search"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 shadow max-h-[480px]">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {[
                "Username",
                "Email",
                "Role",
                "Verified",
                "Phone",
                "Document",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="py-3 px-6 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length ? (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6 border-b whitespace-nowrap">{u.username}</td>
                  <td className="py-3 px-6 border-b whitespace-nowrap">{u.email}</td>
                  <td className="py-3 px-6 border-b whitespace-nowrap capitalize">{u.role}</td>
                  <td className="py-3 px-6 border-b text-center whitespace-nowrap">
                    {u.is_verified ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-6 border-b whitespace-nowrap">
                    {u.phone_number || "-"}
                  </td>
                  <td className="py-3 px-6 border-b whitespace-nowrap">
                    {(u.artisan_verification_document || u.researcher_credentials) ? (
                      <a
                        href={u.artisan_verification_document || u.researcher_credentials}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View Doc
                      </a>
                    ) : (
                      "No Doc"
                    )}
                  </td>
                  <td className="py-3 px-6 border-b whitespace-nowrap flex space-x-2">
                    {!u.is_verified && (
                      <button
                        onClick={() => handleVerifyUser(u.username)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(u.username)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 font-semibold"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import API from '../api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'TOURIST',
    phone_number: '',
    bio: '',
    artisan_shop_name: '',
    researcher_institution: '',
  });

  const [files, setFiles] = useState({
    profile_image: null,
    artisan_verification_document: null,
    researcher_credentials: null,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });

      await API.post('/users/register/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Registration successful! Please login.');
    } catch (err) {
      setError('Registration failed. ' + (err.response?.data?.detail || ''));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-5">Register</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
        <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />

        <label className="block">
          Profile Image:
          <input name="profile_image" type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
        </label>

        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
          <option value="TOURIST">Tourist</option>
          <option value="RESEARCHER">Researcher</option>
          <option value="ARTISAN">Artisan</option>
        </select>

        {formData.role === 'ARTISAN' && (
          <>
            <input name="artisan_shop_name" placeholder="Artisan Shop Name" value={formData.artisan_shop_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
            <label className="block">
              Artisan Verification Document:
              <input name="artisan_verification_document" type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} className="mt-1" />
            </label>
          </>
        )}

        {formData.role === 'RESEARCHER' && (
          <>
            <input name="researcher_institution" placeholder="Researcher Institution" value={formData.researcher_institution} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
            <label className="block">
              Researcher Credentials:
              <input name="researcher_credentials" type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} className="mt-1" />
            </label>
          </>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}

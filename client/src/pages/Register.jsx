import React, { useState } from 'react';
import API from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiFileText, FiUploadCloud, FiBriefcase, FiArrowRight } from 'react-icons/fi';

export default function Register() {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
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
      navigate('/login');
    } catch (err) {
      setError('Registration failed. ' + (err.response?.data?.detail || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-display font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join our community of heritage enthusiasts</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Basic Info */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiUser /></div>
                  <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="input-field pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiMail /></div>
                  <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input-field pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiLock /></div>
                  <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="input-field pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiPhone /></div>
                  <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} className="input-field pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-gray-400"><FiFileText /></div>
                <textarea name="bio" rows="3" placeholder="Tell us a bit about yourself..." value={formData.bio} onChange={handleChange} className="input-field pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">{files.profile_image ? files.profile_image.name : "SVG, PNG, JPG or GIF (MAX. 2MB)"}</p>
                    </div>
                    <input name="profile_image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Account Type</h3>
              <div className="grid grid-cols-3 gap-4">
                {['TOURIST', 'RESEARCHER', 'ARTISAN'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${formData.role === role
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:border-indigo-200'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Fields */}
            <AnimatePresence mode='wait'>
              {formData.role === 'ARTISAN' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="col-span-1 md:col-span-2 space-y-4 bg-purple-50 p-6 rounded-xl border border-purple-100"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><FiBriefcase /></div>
                    <input name="artisan_shop_name" placeholder="Artisan Shop Name" value={formData.artisan_shop_name} onChange={handleChange} className="w-full pl-10 p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Document</label>
                    <input name="artisan_verification_document" type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
                  </div>
                </motion.div>
              )}

              {formData.role === 'RESEARCHER' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="col-span-1 md:col-span-2 space-y-4 bg-blue-50 p-6 rounded-xl border border-blue-100"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><FiBriefcase /></div>
                    <input name="researcher_institution" placeholder="Institution Name" value={formData.researcher_institution} onChange={handleChange} className="w-full pl-10 p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credentials (ID/Certificate)</label>
                    <input name="researcher_credentials" type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-md text-white font-bold text-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
          >
            {loading ? "Creating Account..." : <>Create Account <FiArrowRight /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

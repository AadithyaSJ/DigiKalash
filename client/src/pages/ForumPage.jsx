import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { FiMessageSquare, FiImage, FiVideo, FiMapPin, FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", site_id: "", image: null, video: null });
  const [heritageSites, setHeritageSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'mine', etc.

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, sitesRes] = await Promise.all([
          API.get("/forum/posts/"),
          API.get("/forum/sites/"),
        ]);
        setPosts(postsRes.data);
        setHeritageSites(sitesRes.data);
      } catch (err) {
        console.error("Failed fetching posts/sites:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.content) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      if (form.site_id) formData.append("site_id", form.site_id);
      if (form.image) formData.append("image", form.image);
      if (form.video) formData.append("video", form.video);

      const res = await API.post("/forum/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts(p => [res.data, ...p]);
      setForm({ title: "", content: "", site_id: "", image: null, video: null });
    } catch (err) {
      console.error("Post creation failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar Left: Navigation */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Forum</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-colors font-medium flex items-center gap-3 ${activeTab === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiMessageSquare /> All Discussions
                </button>
                <button
                  onClick={() => setActiveTab('sites')}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-colors font-medium flex items-center gap-3 ${activeTab === 'sites' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiMapPin /> Site Reviews
                </button>
                {/* Add more nav items */}
              </nav>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-center">
              <h4 className="font-bold text-lg mb-2">Join the Conversation</h4>
              <p className="text-indigo-100 text-sm mb-4">Share your heritage experiences and connect with others.</p>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-6">

          {/* Create Post Widget */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
              <form onSubmit={handleSubmit} className="flex-grow">
                <input
                  type="text"
                  placeholder="Give your topic a title..."
                  className="w-full font-bold text-lg border-none focus:ring-0 placeholder-gray-400 p-0 mb-2"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
                <textarea
                  className="w-full resize-none border-none focus:ring-0 placeholder-gray-500 p-0 text-gray-600 min-h-[80px]"
                  placeholder="Share your thoughts, questions, or experiences..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                />

                {/* Media Previews would go here */}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                  <div className="flex gap-2">
                    <label className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full cursor-pointer transition-colors">
                      <FiImage />
                      <input type="file" accept="image/*" className="hidden" onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))} />
                    </label>
                    <label className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full cursor-pointer transition-colors">
                      <FiVideo />
                      <input type="file" accept="video/*" className="hidden" onChange={e => setForm(f => ({ ...f, video: e.target.files[0] }))} />
                    </label>
                    <select
                      className="text-sm bg-gray-100 rounded-lg px-2 py-1 border-none focus:ring-0 text-gray-600 ml-2"
                      value={form.site_id}
                      onChange={e => setForm(f => ({ ...f, site_id: e.target.value }))}
                    >
                      <option value="">Tag Site (Optional)</option>
                      {heritageSites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={uploading || !form.title || !form.content}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold disabled:opacity-50 hover:bg-indigo-700 transition"
                  >
                    {uploading ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Feed */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse shadow-sm" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No posts yet.</div>
          ) : (
            posts.map(post => <ForumPost key={post.id} post={post} />)
          )}

        </div>

        {/* Sidebar Right: Trending / Info */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {/* Placeholder trending topics */}
                {['#HeritageWalk', '#TempleArchitecture', '#SustainableTourism'].map(tag => (
                  <div key={tag} className="text-gray-600 font-medium hover:text-indigo-600 cursor-pointer">{tag}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ForumPost({ post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {post.author_username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-none">{post.author_username}</h4>
              <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          {post.site && (
            <Link to={`/sites/${post.site.id}`} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium hover:bg-gray-200">
              📍 {post.site.name}
            </Link>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-700 whitespace-pre-line mb-4 leading-relaxed">{post.content}</p>

        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
            <img src={post.image} alt="Post content" className="w-full object-cover max-h-[500px]" />
          </div>
        )}

        {post.video && (
          <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
            <video controls className="w-full max-h-[500px]">
              <source src={post.video} />
            </video>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex gap-6">
            {/* <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-medium transition">
                 <FiHeart /> <span>{post.upvotes}</span>
              </button> */}
            <ForumPostActions post={post} />
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition"
            >
              <FiMessageSquare /> <span>Comments</span>
            </button>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <FiMoreHorizontal />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <ForumComments postId={post.id} />
        </div>
      )}
    </article>
  );
}

// Keep existing ForumPostActions and ForumComments but styled better
function ForumPostActions({ post }) {
  const [score, setScore] = React.useState(post.upvotes - post.downvotes);
  const [voteType, setVoteType] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    API.get(`/forum/posts/${post.id}/myvote/`)
      .then((res) => {
        const vt = res.data?.vote_type;
        setVoteType(vt ? vt.toUpperCase() : null);
      })
      .catch(() => setVoteType(null))
      .finally(() => setLoading(false));
  }, [post.id]);

  async function handleVote(type) {
    if (loading) return;
    const vote = type.toUpperCase();
    try {
      await API.post("/forum/votes/", { post: post.id, vote_type: vote });
      if (voteType === vote) {
        setVoteType(null);
        setScore((s) => (vote === "UPVOTE" ? s - 1 : s + 1));
      } else if (voteType === null) {
        setVoteType(vote);
        setScore((s) => (vote === "UPVOTE" ? s + 1 : s - 1));
      } else {
        setVoteType(vote);
        setScore((s) => (vote === "UPVOTE" ? s + 2 : s - 2));
      }
    } catch (err) {
      console.error("Vote failed:", err);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => handleVote("UPVOTE")} className={`p-2 rounded-full hover:bg-gray-200 transition ${voteType === "UPVOTE" ? "text-indigo-600" : "text-gray-500"}`}>
        <FiHeart className={voteType === "UPVOTE" ? "fill-current" : ""} />
      </button>
      <span className="font-bold text-gray-700 min-w-[20px] text-center">{score}</span>
      {/* Downvote often hidden in simple UI, but keeping if needed or simplifying to just Heart */}
    </div>
  );
}

function ForumComments({ postId }) {
  const [comments, setComments] = React.useState([]);
  const [form, setForm] = React.useState({ content: "" });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    API.get(`/forum/posts/${postId}/comments/`)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]));
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.content.trim()) return;
    setLoading(true);
    try {
      const payload = { ...form, post: postId };
      const res = await API.post(`/forum/posts/${postId}/comments/`, payload);
      setComments((c) => [...c, res.data]);
      setForm({ content: "" });
    } catch (err) {
      console.error("Comment submission failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
            {comment.author_username?.[0]?.toUpperCase()}
          </div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex-grow">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-gray-900">{comment.author_username}</span>
              <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 text-sm">{comment.content}</p>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-3 mt-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full py-2 pl-4 pr-12 rounded-full border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            value={form.content}
            onChange={(e) => setForm({ content: e.target.value })}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

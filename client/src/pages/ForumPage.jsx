import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", site_id: "", image: null, video: null });
  const [heritageSites, setHeritageSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, sitesRes] = await Promise.all([
          API.get("/forum/posts/"),
          API.get("/forum/sites/"),
        ]);
        setPosts(postsRes.data);
        console.log(postsRes.data);        
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
    <div className="max-w-7xl mx-auto p-8 flex gap-8 bg-gray-50">
      <aside className="w-72 flex-shrink-0 space-y-6">
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg text-indigo-700 mb-4">Share with Heritage Community</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Title"
              maxLength={120}
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="What's on your mind? (markdown supported)"
              maxLength={1000}
              required
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
            <select
              className="w-full border rounded px-3 py-2"
              value={form.site_id}
              onChange={e => setForm(f => ({ ...f, site_id: e.target.value }))}
            >
              <option value="">Tag a Heritage Site (optional)</option>
              {heritageSites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.city}, {site.state})
                </option>
              ))}
            </select>
            <label className="block">
              <span className="text-gray-700">Image (optional):</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))}
                className="mt-1 block w-full"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Video (optional):</span>
              <input
                type="file"
                accept="video/*"
                onChange={e => setForm(f => ({ ...f, video: e.target.files[0] }))}
                className="mt-1 block w-full"
              />
            </label>
            <button
              type="submit"
              disabled={uploading}
              className="self-end px-6 py-2 bg-indigo-600 text-white rounded shadow disabled:opacity-50"
            >
              {uploading ? "Posting..." : "Post"}
            </button>
          </form>
        </section>
      </aside>

      <main className="flex-grow max-w-3xl">
        {loading ? (
          <div className="text-center text-gray-500 py-24">Loading posts…</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 py-24">No posts yet. Be the first to share!</div>
        ) : (
          posts.map(post => <ForumPost key={post.id} post={post} />)
        )}
      </main>

      <aside className="w-72 flex-shrink-0 space-y-6">
        {/* You can add widgets here */}
      </aside>
    </div>
  );
}

function ForumPost({ post }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  console.log(post.image);
  

  return (
    <>
      <article className="bg-white rounded-xl shadow p-6 mb-8">
        <header className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <span className="font-bold text-indigo-700">{post.author_username}</span>
          <span>•</span>
          <time title={new Date(post.created_at).toLocaleString()}>
            {new Date(post.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </time>
        </header>
        <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
        <p className="mb-4 whitespace-pre-line">{post.content}</p>

        {post.site && (
          <Link to={`/sites/${post.site.id}`} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 mb-4">
            <span className="material-icons" style={{fontSize: '16px'}}>location_on</span>
            {post.site.name} ({post.site.city}, {post.site.state})
          </Link>
        )}

        {post.image && (
          <div className="mb-4 relative group" onClick={() => setShowImageModal(true)}>
            <img 
              src={post.image} 
              alt="Post image" 
              className="w-full max-h-60 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowImageModal(true)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-opacity-10 cursor-pointer hover:bg-black/20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <span className="material-icons text-white opacity-0 group-hover:opacity-100 text-4xl">zoom_in</span>
            </div>
          </div>
        )}

        {post.video && (
          <div className="mb-4 relative group" onClick={() => setShowVideoModal(true)}>
            <video 
              className="w-full max-h-60 rounded-lg cursor-pointer"
              onClick={() => setShowVideoModal(true)}
              poster="" // You can add a thumbnail if available
            >
              <source src={post.video} />
              Sorry, your browser doesn't support embedded videos.
            </video>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 cursor-pointer transition-all duration-200 rounded-lg flex items-center justify-center">
              <span className="material-icons text-white opacity-0 group-hover:opacity-100 text-6xl">play_circle_filled</span>
            </div>
          </div>
        )}

        <ForumPostActions post={post} />
        <ForumComments postId={post.id} />
      </article>

      {/* Image Modal */}
      {showImageModal && (
        <MediaModal onClose={() => setShowImageModal(false)}>
          <img 
            src={post.image} 
            alt="Post image full view" 
            className="max-w-full max-h-full object-contain"
          />
        </MediaModal>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <MediaModal onClose={() => setShowVideoModal(false)}>
          <video 
            controls 
            autoPlay
            className="max-w-full max-h-full"
          >
            <source src={post.video} />
            Sorry, your browser doesn't support embedded videos.
          </video>
        </MediaModal>
      )}
    </>
  );
}

// Reusable Modal Component for Media
function MediaModal({ children, onClose }) {
  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent background scroll
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-auto"
      onClick={onClose}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="relative max-w-screen-lg max-h-screen-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ overflow: 'auto', maxHeight: '90vh', maxWidth: '90vw' }}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 z-50 cursor-pointer"
          aria-label="Close"
        >
          <span className="material-icons text-4xl">close</span>
        </button>
        <div className="flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}


// Keep your existing ForumPostActions and ForumComments components unchanged
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

  const upIcon = voteType === "UPVOTE" ? "thumb_up" : "thumb_up_off_alt";
  const downIcon = voteType === "DOWNVOTE" ? "thumb_down" : "thumb_down_off_alt";

  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        disabled={loading}
        onClick={() => handleVote("UPVOTE")}
        className={`p-2 rounded-full focus:outline-none ${
          voteType === "UPVOTE" ? "text-indigo-600" : "text-gray-400 hover:text-indigo-600"
        }`}
        aria-label="Like"
        title="Like"
      >
        <span className="material-icons">{upIcon}</span>
      </button>
      <span className="font-semibold text-gray-700">{score}</span>
      <button
        disabled={loading}
        onClick={() => handleVote("DOWNVOTE")}
        className={`p-2 rounded-full focus:outline-none ${
          voteType === "DOWNVOTE" ? "text-red-600" : "text-gray-400 hover:text-red-600"
        }`}
        aria-label="Dislike"
        title="Dislike"
      >
        <span className="material-icons">{downIcon}</span>
      </button>
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
    <div className="ml-6 mt-4 border-l border-gray-300 pl-4 max-h-80 overflow-y-auto">
      <h4 className="text-gray-700 font-semibold mb-2">Comments</h4>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 rounded p-2 mb-4 shadow-sm">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-bold">{comment.author_username}</span>
            <span>{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-800">{comment.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-grow border rounded px-3 py-1"
          value={form.content}
          onChange={(e) => setForm({ content: e.target.value })}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

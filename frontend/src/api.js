const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const getPosts = async () => { const r = await fetch(`${API}/posts`); if (!r.ok) throw new Error("Failed to load"); return r.json(); };
export const createPost = async (p) => {
  const r = await fetch(`${API}/posts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
  if (!r.ok) throw new Error((await r.json()).error || "Failed to create"); return r.json();
};
export const deletePost = async (id) => { const r = await fetch(`${API}/posts/${id}`, { method: "DELETE" }); if (!r.ok) throw new Error("Failed to delete"); return r.json(); };

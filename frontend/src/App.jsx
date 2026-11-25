import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, createPost, deletePost } from "./api.js";

export default function App() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", author: "", content: "" });
  const { data: posts = [], isLoading, error } = useQuery({ queryKey: ["posts"], queryFn: getPosts });
  const add = useMutation({ mutationFn: createPost, onSuccess: () => { qc.invalidateQueries({ queryKey: ["posts"] }); setForm({ title: "", author: "", content: "" }); } });
  const del = useMutation({ mutationFn: deletePost, onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }) });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container">
      <h1>📝 MERN Blog</h1>
      <form onSubmit={(e) => { e.preventDefault(); add.mutate(form); }}>
        <h2>Create Blog</h2>
        <input placeholder="Title" value={form.title} onChange={set("title")} required />
        <input placeholder="Author" value={form.author} onChange={set("author")} />
        <textarea placeholder="Content" rows="4" value={form.content} onChange={set("content")} required />
        <button disabled={add.isPending}>{add.isPending ? "Publishing..." : "Publish"}</button>
        {add.isError && <p className="err">{add.error.message}</p>}
      </form>
      <h2>Latest Blogs ({posts.length})</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="err">{error.message}</p>}
      {posts.map((p) => (
        <article key={p._id}>
          <h3>{p.title}</h3>
          <small>by {p.author} • {new Date(p.createdAt).toLocaleString()}</small>
          <p>{p.content}</p>
          <button className="del" onClick={() => del.mutate(p._id)}>Delete</button>
        </article>
      ))}
    </div>
  );
}

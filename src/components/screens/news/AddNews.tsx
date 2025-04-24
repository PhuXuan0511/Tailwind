import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { useFirestore } from "~/lib/firebase"; // Use Firestore from your firebase.ts
import { useNavigate } from "react-router-dom";

const AddNews = () => {
  const firestore = useFirestore();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newsCollection = collection(firestore, "news");
      await addDoc(newsCollection, {
        title,
        content,
        createdAt: new Date(),
      });

      alert("News added successfully!");
      navigate("/admin-manage-news"); // Redirect back to Manage News
    } catch (error) {
      console.error("Error adding news:", error);
      alert("Failed to add news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Add News</h1>

      <form
        onSubmit={handleAddNews}
        className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter news title"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-lg font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter news content"
            rows={5}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Adding News..." : "Add News"}
        </button>
      </form>
    </div>
  );
};

export default AddNews;
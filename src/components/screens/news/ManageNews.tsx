import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useFirestore } from "~/lib/firebase"; // Use Firestore from your firebase.ts
import { useNavigate } from "react-router-dom";
import BackButton from "../../shared/buttons/BackButton";
import AddButton from "../../shared/buttons/AddButton";

type News = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

const ManageNews = () => {
  const firestore = useFirestore(); // Use the helper function to access Firestore
  const navigate = useNavigate(); // For navigation
  const [newsList, setNewsList] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch news from Firestore
  useEffect(() => {
    const newsCollection = collection(firestore, "news");
    const unsubscribe = onSnapshot(newsCollection, (snapshot) => {
      const newsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        };
      }) as News[];
      setNewsList(newsData);
      setFilteredNews(newsData);
    });

    return () => unsubscribe();
  }, [firestore]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    setFilteredNews(
      newsList.filter(
        (news) =>
          news.title.toLowerCase().includes(term) ||
          news.content.toLowerCase().includes(term) ||
          new Date(news.createdAt).toLocaleDateString().includes(term)
      )
    );
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;

    try {
      const newsDoc = doc(firestore, "news", newsId);
      await deleteDoc(newsDoc);
      alert("News deleted successfully!");
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Failed to delete news. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <BackButton className="mb-4" />

        <h1 className="text-3xl font-bold mb-6">Manage News</h1>

        {/* Add News Button and Search */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by title, date, or content..."
            className="w-full max-w-md p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            <AddButton onClick={() => navigate("/admin-add-news")}/>
        </div>

        {/* News List */}
        <div className="max-w-5xl mx-auto">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="relative bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
            >
              {/* News Content */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-2 text-blue-400">
                  {news.title}
                </h2>
                {/* Display content with proper line breaks */}
                <p className="text-gray-300 mb-4 whitespace-pre-line">
                  {news.content}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(news.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Delete Button */}
                {/* 
                <button
                onClick={() => handleDeleteNews(news.id)}
                className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-lg text-sm transition"
                >
                Delete
                </button>
                */}
              <button
                onClick={() => handleDeleteNews(news.id)}
                className="absolute bottom-2 right-2 ml-4 p-1 rounded text-red-500 hover:text-red-600 focus:outline-none"
                aria-label="Delete news"
              >
                <span className="text-xs font-bold">&#10005;</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageNews;
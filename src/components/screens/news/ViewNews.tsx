import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useFirestore } from "~/lib/firebase"; // Use Firestore from your firebase.ts
import { useNavigate } from "react-router-dom";

type News = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

const ViewNews = () => {
  const firestore = useFirestore(); // Use the helper function to access Firestore
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<News[]>([]);

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
    });

    return () => unsubscribe();
  }, [firestore]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
        >
          Back
      </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">What's up?</h1>

      <div className="max-w-5xl mx-auto">
        {newsList.map((news) => (
          <div
            key={news.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewNews;
import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "~/components/contexts/UserContext";
import { Head } from "~/components/shared/Head";
import { useFirestore } from "~/lib/firebase";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";
import { Layout } from "~/components/shared/Layout";
import clsx from "clsx";

type Tool = {
  id: string;
  title: string;
  description: string;
  url: string;
};

enum InputEnum {
  Title = "title",
  Description = "description",
  Url = "url",
}

function Index() {
  const { state } = useAuthState();
  const [firstTools, setFirstTools] = useState<Tool[]>([]);
  const [secondTools, setSecondTools] = useState<Tool[]>([]);
  const firestore = useFirestore();
  const [inputData, setInputData] = useState<Partial<Tool>>({
    title: "",
    description: "",
    url: "",
  });

  useEffect(() => {
    async function fetchData() {
      const fetchCollection = async (collectionName: string) => {
        const toolsCollection = collection(firestore, collectionName);
        const toolsQuery = query(toolsCollection);
        const querySnapshot = await getDocs(toolsQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tool[];
      };

      const [firstData, secondData] = await Promise.all([
        fetchCollection("First"),
        fetchCollection("Second"),
      ]);

      setFirstTools(firstData);
      setSecondTools(secondData);
    }

    fetchData();
  }, [firestore]);

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    collectionName: string
  ) => {
    e.preventDefault();
    if (!inputData.title || !inputData.description || !inputData.url) {
      toast.error("All fields are required!", { theme: "dark" });
      return;
    }

    try {
      const toolsCollection = collection(firestore, collectionName);
      const newTool: Partial<Tool> = {
        title: inputData.title,
        description: inputData.description,
        url: inputData.url,
      };

      await addDoc(toolsCollection, newTool);

      // Success Toast
      toast.success("✅ Tool Added Successfully!", { theme: "dark", transition: Bounce });

      // Reset input fields
      setInputData({ title: "", description: "", url: "" });

      // Refetch Data
      const fetchCollection = async () => {
        const toolsQuery = query(toolsCollection);
        const querySnapshot = await getDocs(toolsQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tool[];
      };

      if (collectionName === "First") {
        setFirstTools(await fetchCollection());
      } else {
        setSecondTools(await fetchCollection());
      }
    } catch (error) {
      toast.error("❌ Error adding tool!", { theme: "dark" });
    }
  };

  const renderTable = (tools: Tool[], title: string) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-700 rounded-lg">
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-800 transition">
                <td className="px-6 py-3 border border-gray-700">{tool.title}</td>
                <td className="px-6 py-3 border border-gray-700">{tool.description}</td>
                <td className="px-6 py-3 border border-gray-700">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    {tool.url}
                    <PencilSquareIcon className="size-6 text-slate-500" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <Head title="TOP PAGE" />
      <Layout>
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <ToastContainer />
          <div className="flex gap-4 mb-6">
            {/* Form for Adding Tools */}
            <form className="flex gap-4 w-full" onSubmit={(e) => handleFormSubmit(e, "First")}>
              <input
                type="text"
                onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
                value={inputData.title}
                placeholder="Title"
                className="w-1/3 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
                value={inputData.description}
                placeholder="Description"
                className="w-1/3 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
                value={inputData.url}
                placeholder="URL"
                className="w-1/3 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold"
              >
                Add Tool
              </button>
            </form>
          </div>

          {/* First Tools Section */}
          {renderTable(firstTools, "First Tools")}

          {/* Second Tools Section */}
          {renderTable(secondTools, "Second Tools")}
        </div>
      </Layout>
    </>
  );
}

export default Index;

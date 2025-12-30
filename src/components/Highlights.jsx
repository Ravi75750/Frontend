import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Highlights() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/highlights`)
      .then((res) => {
        setVideos(res.data);
      })
      .catch((err) => {
        console.error("Error fetching highlights:", err);
        setVideos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <div className="p-10 min-h-screen bg-[#09141a] text-white flex justify-center items-center">
        <p className="text-xl">Loading Highlights...</p>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-[#09141a] text-white">
      <h1 className="text-3xl font-bold mb-10">🎥 Tournament Highlights</h1>


      {videos.length === 0 ? (
        // Case 1: No videos found
        <div className="text-center mt-20 p-8  rounded-lg max-w-lg mx-auto ">
          <p className="text-2xl text-yellow-400 font-semibold mb-6">
            There is not any video yet!!!!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Back to Homepage
          </button>
        </div>
      ) : (

        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((v) => (
            <div key={v._id} className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={v.thumbnail || "/default-thumb.jpg"}
                alt={v.title}
                className="rounded-md w-full h-[200px] object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{v.title}</h3>
                <a
                  href={v.videoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 mt-2 inline-block"
                >
                  ▶ Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

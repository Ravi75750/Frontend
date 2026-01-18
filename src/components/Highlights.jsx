import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Highlights() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL || "/api"}/highlights`)
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
          {videos.map((v) => {
            // Extract video ID for embed if possible (though we have full URL, we need to be careful with embed)
            // If we stored just URL, we need to extract ID again or use an embeddable URL.
            // Let's assume standard YouTube links.
            let videoId = null;
            try {
              const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
              const match = v.videoURL.match(regex);
              if (match && match[1]) videoId = match[1];
            } catch (e) {
              console.error("Invalid URL", v.videoURL);
            }

            return (
              <div key={v._id} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                {/* Video Container - Aspect Ratio 16:9 */}
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  {videoId ? (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={v.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen>
                    </iframe>
                  ) : (
                    /* Fallback if not a valid YouTube ID found */
                    <img
                      src={v.thumbnail || "/default-thumb.jpg"}
                      alt={v.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                  {v.date && <p className="text-gray-400 text-sm mb-2">{new Date(v.date).toLocaleDateString()}</p>}

                  {!videoId && (
                    <a
                      href={v.videoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 mt-auto inline-block"
                    >
                      ▶ Watch Video
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";

export default function NoticeBoard() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL || "/api"}/announcements`
                );
                setAnnouncements(res.data);
            } catch (err) {
                console.error("Notice Board Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="text-white">Loading notices...</div>;
    if (!announcements.length) return null;

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-yellow-500 mb-6 shadow-lg">
            <h2 className="text-yellow-400 text-xl font-bold mb-3 flex items-center gap-2">
                📢 Notice Board
            </h2>
            <ul className="space-y-3">
                {announcements.map((msg) => (
                    <li
                        key={msg._id}
                        className="bg-gray-700 p-3 rounded border-l-4 border-blue-500 text-gray-200"
                    >
                        {msg.message}
                        <span className="block text-xs text-gray-400 mt-1">
                            {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

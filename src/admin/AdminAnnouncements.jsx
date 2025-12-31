import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../api/config";

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${API_URL}/announcements`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load announcements");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            await axios.post(
                `${API_URL}/announcements`,
                { message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Announcement added");
            setMessage("");
            fetchAnnouncements();
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to add announcement");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/announcements/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Deleted successfully");
            setAnnouncements((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6 text-yellow-500">Manage Announcements</h1>

            {/* ADD FORM */}
            <form onSubmit={handleCreate} className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">New Announcement Message</label>
                    <textarea
                        className="w-full bg-gray-900 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 outline-none"
                        rows="3"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Server maintenance at 10 PM..."
                        required
                    />
                </div>
                <button
                    disabled={loading}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded transition-colors"
                >
                    {loading ? "Posting..." : "Post Announcement"}
                </button>
            </form>

            {/* LIST */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Active Announcements</h2>
                {announcements.length === 0 && <p className="text-gray-500 italic">No active announcements.</p>}

                {announcements.map((ann) => (
                    <div key={ann._id} className="bg-gray-800 p-4 rounded flex justify-between items-start border-l-4 border-blue-500">
                        <div>
                            <p className="text-gray-200">{ann.message}</p>
                            <span className="text-xs text-gray-500 mt-1 block">
                                {new Date(ann.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDelete(ann._id)}
                            className="text-red-400 hover:text-red-300 ml-4"
                            title="Delete"
                        >
                            🗑
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

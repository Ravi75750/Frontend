import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminSettings() {
    const [currentQr, setCurrentQr] = useState(null);
    const [newQrFile, setNewQrFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "/api"}/admin/system-settings`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
            });
            if (data.paymentQrCode) {
                setCurrentQr(data.paymentQrCode);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load settings");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!newQrFile) return toast.error("Please select an image");

        const formData = new FormData();
        formData.append("image", newQrFile);

        setLoading(true);
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL || "/api"}/admin/system-settings`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success("QR Code Updated!");
            setCurrentQr(data.url);
            setNewQrFile(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update QR Code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                System Settings
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Payment QR Code</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Current QR Display */}
                    <div className="space-y-2">
                        <p className="text-slate-400 text-sm">Current Active QR Code:</p>
                        {currentQr ? (
                            <div className="p-4 bg-white rounded-lg inline-block">
                                <img src={currentQr} alt="Payment QR" className="w-48 h-48 object-contain" />
                            </div>
                        ) : (
                            <div className="w-48 h-48 bg-slate-800 rounded-lg flex items-center justify-center border border-dashed border-slate-600">
                                <span className="text-slate-500">No QR Set</span>
                            </div>
                        )}
                    </div>

                    {/* Upload Form */}
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium">Upload New QR Code</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewQrFile(e.target.files[0])}
                                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                  cursor-pointer bg-slate-800 rounded-lg border border-slate-700 p-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newQrFile}
                            className={`px-6 py-2 rounded-lg font-semibold text-white transition-all
                ${loading || !newQrFile
                                    ? "bg-slate-700 cursor-not-allowed text-slate-400"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                                }`}
                        >
                            {loading ? "Uploading..." : "Update QR Code"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

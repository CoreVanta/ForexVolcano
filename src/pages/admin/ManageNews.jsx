import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import Button from '../../components/ui/Button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        impact: 'Medium',
        content: '',
        image: '',
        affectedCurrencies: '' // Comma separated string for input
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'news'), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            const newsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNews(newsData);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await deleteDoc(doc(db, 'news', id));
                fetchNews(); // Refresh list
            } catch (error) {
                console.error("Error deleting news:", error);
                alert("Failed to delete news item.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Parse currencies
            const currencies = formData.affectedCurrencies.split(',').map(c => c.trim().toUpperCase()).filter(c => c);

            await addDoc(collection(db, 'news'), {
                title: formData.title,
                impact: formData.impact,
                content: formData.content,
                image: formData.image,
                affectedCurrencies: currencies,
                timestamp: serverTimestamp() // Use server timestamp
            });

            setIsAdding(false);
            setFormData({ title: '', impact: 'Medium', content: '', image: '', affectedCurrencies: '' });
            fetchNews();
        } catch (error) {
            console.error("Error adding news:", error);
            alert("Failed to add news item.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manage News</h1>
                <Button onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : 'Post New Alert'}
                </Button>
            </div>

            {/* Add News Form */}
            {isAdding && (
                <div className="bg-surface p-6 rounded-xl border border-gray-800 mb-8 animate-fade-in">
                    <h2 className="text-xl font-bold text-white mb-4">New Market Update</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., NFP Beats Expectations"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Impact Level</label>
                                <select
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={formData.impact}
                                    onChange={e => setFormData({ ...formData, impact: e.target.value })}
                                >
                                    <option value="Low">Low (Yellow)</option>
                                    <option value="Medium">Medium (Orange)</option>
                                    <option value="High">High (Red)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Content/Summary</label>
                            <div className="bg-white rounded-lg overflow-hidden text-black">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    className="h-64 mb-12" // mb-12 to make space for toolbar/dropdowns
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Affected Currencies (comma separated)</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={formData.affectedCurrencies}
                                    onChange={e => setFormData({ ...formData, affectedCurrencies: e.target.value })}
                                    placeholder="USD, EUR, JPY"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" variant="primary">Publish News</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* News List */}
            <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Impact</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-400">Loading data...</td>
                                </tr>
                            ) : news.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-400">No news posted yet.</td>
                                </tr>
                            ) : (
                                news.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                                            {item.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                                                    item.impact === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-green-500/20 text-green-400'}`}>
                                                {item.impact}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageNews;

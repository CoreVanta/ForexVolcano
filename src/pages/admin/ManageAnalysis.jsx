import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, getDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '../../components/ui/Button';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background'
];

const ManageAnalysis = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        pair: 'EUR/USD',
        direction: 'Neutral',
        content: '',
        image: '',
        analysisType: 'Technical Analysis'
    });

    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        fetchPosts();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProfileData(docSnap.data());
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'analysis'), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(data);
        } catch (error) {
            console.error("Error fetching analysis:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this analysis?')) {
            try {
                await deleteDoc(doc(db, 'analysis', id));
                fetchPosts();
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Failed to delete post.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Merge form data with global profile data
        const submissionData = {
            ...formData,
            ...profileData, // Inject global analyst profile
            timestamp: serverTimestamp()
        };

        try {
            if (editId) {
                await updateDoc(doc(db, 'analysis', editId), submissionData);
            } else {
                await addDoc(collection(db, 'analysis'), submissionData);
            }

            setIsAdding(false);
            setEditId(null);
            setFormData({
                title: '',
                pair: 'EUR/USD',
                direction: 'Neutral',
                content: '',
                image: '',
                analysisType: 'Technical Analysis'
            });
            fetchPosts();
        } catch (error) {
            console.error("Error saving post:", error);
            alert("Failed to save analysis.");
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            pair: item.pair,
            direction: item.direction,
            content: item.content,
            image: item.image,
            analysisType: item.analysisType || 'Technical Analysis'
        });
        setEditId(item.id);
        setIsAdding(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manage Analysis</h1>
                <Button onClick={() => {
                    setIsAdding(!isAdding);
                    if (isAdding) {
                        setEditId(null);
                        setFormData({
                            title: '',
                            pair: 'EUR/USD',
                            direction: 'Neutral',
                            content: '',
                            image: '',
                            analysisType: 'Technical Analysis'
                        });
                    }
                }}>
                    {isAdding ? 'Cancel' : 'New Analysis'}
                </Button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="bg-surface p-6 rounded-xl border border-gray-800 mb-8 animate-fade-in">
                    <h2 className="text-xl font-bold text-white mb-4">{editId ? 'Edit Analysis' : 'Post Technical Breakdown'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Pair / Asset</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none uppercase"
                                    value={formData.pair}
                                    onChange={e => setFormData({ ...formData, pair: e.target.value })}
                                    placeholder="e.g. GBP/JPY"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Direction</label>
                                <select
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={formData.direction}
                                    onChange={e => setFormData({ ...formData, direction: e.target.value })}
                                >
                                    <option value="Neutral">Neutral (Gray)</option>
                                    <option value="Bullish">Bullish (Green)</option>
                                    <option value="Bearish">Bearish (Red)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Analysis Type</label>
                                <select
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={formData.analysisType}
                                    onChange={e => setFormData({ ...formData, analysisType: e.target.value })}
                                >
                                    <option value="Technical Analysis">Technical Analysis</option>
                                    <option value="Fundamental Analysis">Fundamental Analysis</option>
                                    <option value="Sentiment Analysis">Sentiment Analysis</option>
                                </select>
                            </div>
                        </div>



                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (Chart)</label>
                                <input
                                    type="url"
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Double Top formation on 4H"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Analysis Content</label>
                            <div className="bg-white rounded-lg overflow-hidden text-black">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    modules={modules}
                                    formats={formats}
                                    className="h-96 mb-12"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" variant="primary">{editId ? 'Update Analysis' : 'Post Analysis'}</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pair</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Direction</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">Loading data...</td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No analysis posted yet.</td>
                                </tr>
                            ) : (
                                posts.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">
                                            {item.pair}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.direction === 'Bullish' ? 'bg-green-500/20 text-green-400' :
                                                    item.direction === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-gray-700 text-gray-300'}`}>
                                                {item.direction}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white max-w-xs truncate">
                                            {item.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-primary hover:text-primary/80 transition-colors mr-4"
                                            >
                                                Edit
                                            </button>
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

export default ManageAnalysis;

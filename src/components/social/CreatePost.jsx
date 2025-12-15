import React, { useState } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Button from '../ui/Button';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Helper: Compress Image to Base64 (Reusing logic from Dashboard)
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Larger for posts
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64 = await compressImage(file);
            setImage(base64);
        } catch (error) {
            console.error("Compression error:", error);
            alert("Failed to process image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        setLoading(true);
        try {
            const postData = {
                uid: auth.currentUser.uid,
                content: content.trim(),
                image: image,
                privacy: privacy,
                likes: [],
                commentsCount: 0,
                shares: 0,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'posts'), postData);

            setContent('');
            setImage(null);
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface rounded-xl border border-gray-800 p-4 mb-6 animate-fade-in">
            <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                    {auth.currentUser?.photoURL ? (
                        <img src={auth.currentUser.photoURL} alt="User" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">You</div>
                    )}
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind, trader?"
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary min-h-[100px] resize-none"
                    />

                    {image && (
                        <div className="mt-2 relative inline-block">
                            <img src={image} alt="Preview" className="h-32 rounded-lg border border-gray-700" />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2 text-primary">
                            <label className="cursor-pointer hover:bg-gray-800 p-2 rounded-full transition-colors flex items-center gap-2">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">Photo</span>
                            </label>

                            <div className="flex items-center gap-2">
                                <select
                                    value={privacy}
                                    onChange={(e) => setPrivacy(e.target.value)}
                                    className="bg-gray-800 text-gray-300 text-sm border border-gray-700 rounded-md py-1 px-2 focus:outline-none"
                                >
                                    <option value="public">Public</option>
                                    <option value="friends">Friends Only</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>

                        <Button onClick={handleSubmit} disabled={loading || (!content.trim() && !image)}>
                            {loading ? 'Posting...' : 'Post'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Button from '../components/ui/Button';

const AnalysisDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysisPost = async () => {
            try {
                const docRef = doc(db, 'analysis', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                    // Check if it matches a mock ID for demo purposes if needed, otherwise redirect
                    navigate('/analysis');
                }
            } catch (error) {
                console.error("Error fetching analysis detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysisPost();
    }, [id, navigate]);

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
    }

    if (!post) return null;

    const formattedDate = post.timestamp?.seconds
        ? new Date(post.timestamp.seconds * 1000).toLocaleDateString()
        : (post.timestamp || new Date().toLocaleDateString());

    const directionColor = post.direction === 'Bullish' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary';

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/analysis')} className="mb-6 text-gray-400 hover:text-white">
                    ← Back to Analysis
                </Button>

                <article className="bg-surface rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    {(post.image || post.chart_image_url) && (
                        <div className="w-full h-64 sm:h-96 relative">
                            <img
                                src={post.image || post.chart_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                        </div>
                    )}

                    <div className="p-8 sm:p-12">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="text-gray-400 text-sm">{formattedDate}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-accent text-sm">By {post.author || 'Admin'}</span>
                        </div>

                        <div className="flex gap-3 mb-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-surface border border-gray-700 text-white`}>
                                {post.pair}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${directionColor}`}>
                                {post.direction}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div
                            className="prose prose-invert prose-lg max-w-none text-gray-300"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
};

export default AnalysisDetail;

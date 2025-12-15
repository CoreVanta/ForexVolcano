import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, onSnapshot, query, orderBy, getDoc } from 'firebase/firestore';

const PostCard = ({ post }) => {
    const [user, setUser] = useState(null);
    const [liked, setLiked] = useState(post.likes?.includes(auth.currentUser?.uid));
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Fetch Post Author
    useEffect(() => {
        const fetchUser = async () => {
            if (post.uid) {
                const docSnap = await getDoc(doc(db, 'users', post.uid));
                if (docSnap.exists()) {
                    setUser(docSnap.data());
                }
            }
        };
        fetchUser();
    }, [post.uid]);

    // Fetch Comments Realtime
    useEffect(() => {
        if (showComments) {
            const q = query(collection(db, 'posts', post.id, 'comments'), orderBy('createdAt', 'asc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            return () => unsubscribe();
        }
    }, [showComments, post.id]);

    const handleLike = async () => {
        if (!auth.currentUser) return;

        const isLiked = liked;
        setLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        const postRef = doc(db, 'posts', post.id);
        if (isLiked) {
            await updateDoc(postRef, { likes: arrayRemove(auth.currentUser.uid) });
        } else {
            await updateDoc(postRef, { likes: arrayUnion(auth.currentUser.uid) });
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            await addDoc(collection(db, 'posts', post.id, 'comments'), {
                uid: auth.currentUser.uid,
                username: auth.currentUser.displayName || 'User', // Simplified, ideally fetch from profile
                content: newComment.trim(),
                createdAt: new Date() // Client-side timestamp for immediate display, serverTimestamp() better for consistent ordering
            });
            // Also increment comment count on post
            await updateDoc(doc(db, 'posts', post.id), {
                commentsCount: (post.commentsCount || 0) + 1
            });
            setNewComment('');
        } catch (error) {
            console.error("Error commenting:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const timeAgo = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const seconds = Math.floor((new Date() - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    };

    const authorName = user?.username || "Unknown User";
    const authorAvatar = user?.avatar_url || `https://ui-avatars.com/api/?name=${authorName}`;

    return (
        <div className="bg-surface rounded-xl border border-gray-800 mb-6 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 flex items-center gap-3">
                <Link to={`/profile/${authorName}`} className="block h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                    <img src={authorAvatar} alt={authorName} className="h-full w-full object-cover" />
                </Link>
                <div>
                    <Link to={`/profile/${authorName}`} className="text-white font-bold hover:underline text-sm block">
                        {authorName}
                    </Link>
                    <span className="text-xs text-gray-500">{timeAgo(post.createdAt)} • {post.privacy === 'public' ? 'Public' : post.privacy === 'friends' ? 'Friends' : 'Private'}</span>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
                <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>
            </div>
            {post.image && (
                <div className="w-full h-auto mt-2">
                    <img src={post.image} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
                </div>
            )}

            {/* Footer Actions */}
            <div className="px-4 py-3 border-t border-gray-800 flex justify-between items-center mt-2">
                <div className="flex gap-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {likesCount > 0 && <span>{likesCount}</span>}
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{comments.length || post.commentsCount || 0}</span>
                    </button>

                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="bg-gray-900/30 p-4 border-t border-gray-800">
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex gap-2 items-start">
                                <div className="h-6 w-6 rounded-full bg-gray-700 flex-shrink-0">
                                    {/* Determine avatar for commenter? For now just use placeholder */}
                                    {/* In prod, store authorAvatar in comment or fetch user */}
                                </div>
                                <div className="bg-gray-800 rounded-lg p-2 text-sm flex-1">
                                    <span className="font-bold text-white mr-2">Unknown</span> {/* Should fix later */}
                                    <span className="text-gray-300">{comment.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleComment} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                        />
                        <button
                            type="submit"
                            disabled={submittingComment || !newComment.trim()}
                            className="text-primary font-medium text-sm disabled:opacity-50"
                        >
                            Post
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostCard;

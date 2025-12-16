import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, where, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, limit } from 'firebase/firestore';
import CreatePost from '../components/social/CreatePost';
import PostCard from '../components/social/PostCard';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const Social = () => {
    const [activeTab, setActiveTab] = useState('feed');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userFriends, setUserFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState({ sent: [], received: [] });
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    // Fetch User Friends & Requests
    useEffect(() => {
        if (!auth.currentUser) return;

        const unsubUser = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setUserFriends(data.friends || []);
                setFriendRequests(data.friendRequests || { sent: [], received: [] });
            }
        });

        return () => unsubUser();
    }, []);

    // Fetch Suggested Friends
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!auth.currentUser) return;
            try {
                // Fetch a batch of users (simplified logic: just fetch 10 and filter)
                // In production, use composite queries or separate 'recommended' collection
                const q = query(collection(db, 'users'), limit(20));
                const snap = await getDocs(q);

                const suggestions = snap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter(u =>
                        u.id !== auth.currentUser.uid && // Not me
                        !userFriends.includes(u.id) && // Not friend
                        !friendRequests.sent?.includes(u.id) && // Not pending sent
                        !friendRequests.received?.includes(u.id) // Not pending received
                    )
                    .slice(0, 5); // Limit to top 5

                setSuggestedUsers(suggestions);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        if (userFriends) fetchSuggestions();
    }, [userFriends, friendRequests]);

    // Fetch Posts
    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter Posts based on Privacy
            const filteredPosts = fetchedPosts.filter(post => {
                // 1. My own posts -> Show
                if (post.uid === auth.currentUser?.uid) return true;

                // 2. Public posts -> Show (As requested: ensure general posts are visible)
                if (post.privacy === 'public') return true;

                // 3. Friends Only -> Show if I am in their friends list (OR we are friends)
                if (post.privacy === 'friends') {
                    return userFriends.includes(post.uid);
                }

                // 4. Private -> Hide (unless owner, covered in #1)
                return false;
            });

            setPosts(filteredPosts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userFriends]);

    // Friend Action Handlers
    const handleAcceptRequest = async (requesterId) => {
        try {
            const myRef = doc(db, 'users', auth.currentUser.uid);
            const theirRef = doc(db, 'users', requesterId);

            await updateDoc(myRef, {
                friends: arrayUnion(requesterId),
                'friendRequests.received': arrayRemove(requesterId)
            });
            await updateDoc(theirRef, {
                friends: arrayUnion(auth.currentUser.uid),
                'friendRequests.sent': arrayRemove(auth.currentUser.uid)
            });
            alert("Friend request accepted!");
        } catch (error) {
            console.error("Error accepting friend:", error);
        }
    };

    const handleRejectRequest = async (requesterId) => {
        try {
            const myRef = doc(db, 'users', auth.currentUser.uid);
            const theirRef = doc(db, 'users', requesterId);

            await updateDoc(myRef, {
                'friendRequests.received': arrayRemove(requesterId)
            });
            await updateDoc(theirRef, {
                'friendRequests.sent': arrayRemove(auth.currentUser.uid)
            });
        } catch (error) {
            console.error("Error rejecting friend:", error);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-20 pb-10">
            <SEO title="Traders Community" description="Connect with other traders, share ideas, and grow your network on ForexVolcano." />
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Traders Community</h1>
                    <div className="flex space-x-1 bg-surface p-1 rounded-lg border border-gray-800">
                        <button
                            onClick={() => setActiveTab('feed')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Feed
                        </button>
                        <button
                            onClick={() => setActiveTab('friends')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'friends' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Friends <span className="ml-1 bg-gray-800 text-xs px-2 py-0.5 rounded-full">{userFriends.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Requests <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{friendRequests.received?.length || 0}</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Sidebar (Profile & Suggestions) */}
                    <div className="hidden lg:flex flex-col gap-6 col-span-1">
                        {/* Profile Card */}
                        <div className="bg-surface rounded-xl border border-gray-800 p-6 sticky top-24">
                            <div className="flex flex-col items-center">
                                <Link to={`/profile/${auth.currentUser?.displayName}`} className="h-20 w-20 rounded-full bg-gray-700 overflow-hidden mb-4">
                                    <img src={auth.currentUser?.photoURL || 'https://ui-avatars.com/api/?name=User'} alt="Me" className="w-full h-full object-cover" />
                                </Link>
                                <h3 className="text-lg font-bold text-white">{auth.currentUser?.displayName || 'Trader'}</h3>
                                <div className="w-full border-t border-gray-800 my-4"></div>
                                <div className="w-full flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Posts</span>
                                    <span className="text-white font-bold">{posts.filter(p => p.uid === auth.currentUser?.uid).length}</span>
                                </div>
                                <div className="w-full flex justify-between text-sm">
                                    <span className="text-gray-400">Friends</span>
                                    <span className="text-white font-bold">{userFriends.length}</span>
                                </div>
                            </div>

                            {/* Suggested Users (Moved Inside Sidebar) */}
                            <div className="mt-8 pt-8 border-t border-gray-800">
                                <h3 className="text-white font-bold mb-4">Suggested People</h3>
                                <div className="space-y-4">
                                    {suggestedUsers.length > 0 ? (
                                        suggestedUsers.map(user => (
                                            <div key={user.id} className="flex items-center justify-between">
                                                <Link to={`/profile/${user.username}`} className="flex items-center gap-3 group">
                                                    <div className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden">
                                                        <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`} alt={user.username} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="max-w-[100px]">
                                                        <p className="text-sm font-bold text-white truncate group-hover:underline">{user.username}</p>
                                                    </div>
                                                </Link>
                                                <Link to={`/profile/${user.username}`} className="text-primary text-xs hover:underline">
                                                    View
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500">No suggestions available right now.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content (Feed) - Taking remaining space */}
                    <div className="col-span-1 lg:col-span-3">
                        {activeTab === 'feed' && (
                            <>
                                <CreatePost />
                                {loading ? (
                                    <div className="text-center py-10 text-gray-400">Loading community feed...</div>
                                ) : posts.length > 0 ? (
                                    posts.map(post => <PostCard key={post.id} post={post} />)
                                ) : (
                                    <div className="text-center py-10 bg-surface rounded-xl border border-gray-800">
                                        <p className="text-gray-400">No posts yet. Be the first to share something!</p>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'friends' && (
                            <div className="bg-surface rounded-xl border border-gray-800 p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Your Friends</h3>
                                {userFriends.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {userFriends.map(friendId => (
                                            <FriendItem key={friendId} userId={friendId} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No friends yet. Add people from the suggestions!</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div className="bg-surface rounded-xl border border-gray-800 p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Friend Requests</h3>
                                {friendRequests.received?.length > 0 ? (
                                    <div className="space-y-4">
                                        {friendRequests.received.map(reqId => (
                                            <RequestItem
                                                key={reqId}
                                                userId={reqId}
                                                onAccept={() => handleAcceptRequest(reqId)}
                                                onReject={() => handleRejectRequest(reqId)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No pending requests.</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

// Sub-component for displaying a friend
const FriendItem = ({ userId }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        getDoc(doc(db, 'users', userId)).then(snap => {
            if (snap.exists()) setUser(snap.data());
        });
    }, [userId]);

    if (!user) return <div className="h-16 bg-gray-800 rounded-lg animate-pulse" />;

    return (
        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${user.username}`} className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden">
                    <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`} alt={user.username} className="w-full h-full object-cover" />
                </Link>
                <div>
                    <Link to={`/profile/${user.username}`} className="font-bold text-white hover:underline">{user.username}</Link>
                    <p className="text-xs text-gray-500">Trader</p>
                </div>
            </div>
            <Link to={`/profile/${user.username}`} className="text-xs text-primary border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors">
                View Profile
            </Link>
        </div>
    );
};

// Sub-component for request
const RequestItem = ({ userId, onAccept, onReject }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        getDoc(doc(db, 'users', userId)).then(snap => {
            if (snap.exists()) setUser(snap.data());
        });
    }, [userId]);

    if (!user) return <div className="h-16 bg-gray-800 rounded-lg animate-pulse" />;

    return (
        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden">
                    <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`} alt={user.username} className="w-full h-full object-cover" />
                </div>
                <div>
                    <span className="font-bold text-white">{user.username}</span>
                    <p className="text-xs text-gray-500">Wants to be your friend</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onAccept} className="bg-primary hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold">Accept</button>
                <button onClick={onReject} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold">Reject</button>
            </div>
        </div>
    );
};

export default Social;

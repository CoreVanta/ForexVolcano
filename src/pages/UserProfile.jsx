import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, onSnapshot } from 'firebase/firestore';
import Button from '../components/ui/Button';

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUserData, setCurrentUserData] = useState(null);

    // Fetch Public Profile by Username
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const q = query(collection(db, 'users'), where('username', '==', username));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setProfile({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    // Fetch Current User Data (to check friend status)
    useEffect(() => {
        if (!auth.currentUser) return;
        const unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
            if (doc.exists()) setCurrentUserData(doc.data());
        });
        return () => unsub();
    }, []);

    // Helper: Check Relationship
    const isMe = auth.currentUser?.uid === profile?.id;
    const isFriend = currentUserData?.friends?.includes(profile?.id);
    const isPendingSent = currentUserData?.friendRequests?.sent?.includes(profile?.id);
    const isPendingReceived = currentUserData?.friendRequests?.received?.includes(profile?.id);

    // Actions
    const sendFriendRequest = async () => {
        if (!auth.currentUser || !profile) return;
        try {
            // Add to my sent
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                'friendRequests.sent': arrayUnion(profile.id)
            });
            // Add to their received
            await updateDoc(doc(db, 'users', profile.id), {
                'friendRequests.received': arrayUnion(auth.currentUser.uid)
            });
            alert("Friend request sent!");
        } catch (error) {
            console.error(error);
        }
    };

    const removeFriend = async () => {
        if (!confirm("Are you sure you want to remove this friend?")) return;
        try {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                friends: arrayRemove(profile.id)
            });
            await updateDoc(doc(db, 'users', profile.id), {
                friends: arrayRemove(auth.currentUser.uid)
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-center p-20 text-white">Loading Profile...</div>;
    if (!profile) return <div className="text-center p-20 text-white">User not found</div>;

    // Check Privacy (e.g. if we add a privacy field later, we can use it here)
    // For now, always visible or simplified
    const isProfilePrivate = false; // Placeholder for profile.privacy === 'private'

    if (isProfilePrivate && !isFriend && !isMe) {
        return (
            <div className="min-h-screen bg-background pt-20 px-4">
                <div className="max-w-3xl mx-auto bg-surface rounded-xl border border-gray-800 p-8 text-center">
                    <div className="h-32 w-32 rounded-full bg-gray-700 mx-auto mb-4 overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Lock" alt="Private" className="w-full h-full object-cover opacity-50" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">{profile.username}</h1>
                    <p className="text-gray-400 mb-6">This account is private.</p>
                    {!isPendingSent && <Button onClick={sendFriendRequest}>Add Friend</Button>}
                    {isPendingSent && <Button disabled>Request Pending</Button>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-20 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto bg-surface rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                {/* Header / Banner */}
                <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative"></div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-end md:items-end gap-6">
                        <div className="h-32 w-32 rounded-full border-4 border-surface bg-gray-800 overflow-hidden">
                            <img
                                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`}
                                alt={profile.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 mb-2 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                            <p className="text-gray-400 text-sm">Member since {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).getFullYear() : '2024'}</p>
                        </div>
                        <div className="mb-4">
                            {isMe ? (
                                <span className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">It's You</span>
                            ) : isFriend ? (
                                <div className="flex gap-2">
                                    <span className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg text-sm font-bold">Friends</span>
                                    <button onClick={removeFriend} className="text-red-400 hover:text-red-300 text-xs underline">Unfriend</button>
                                </div>
                            ) : isPendingSent ? (
                                <Button disabled className="opacity-70">Request Sent</Button>
                            ) : isPendingReceived ? (
                                <span className="text-yellow-400 text-sm">Check your requests!</span>
                            ) : (
                                <Button onClick={sendFriendRequest}>Add Friend</Button>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-6">
                        <h2 className="text-lg font-bold text-white mb-3">About</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{profile.bio || "No bio yet."}</p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-center">
                            <div className="text-2xl font-bold text-primary">{profile.friends?.length || 0}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">Friends</div>
                        </div>
                        {/* Can add more stats here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

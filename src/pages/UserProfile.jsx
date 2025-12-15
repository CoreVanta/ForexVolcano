import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const q = query(collection(db, 'users'), where('username', '==', username));
                const snap = await getDocs(q);

                if (!snap.empty) {
                    const userData = snap.docs[0].data();
                    setProfile(userData);
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-white text-lg">Loading Profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">?</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">User Not Found</h1>
                <p className="text-gray-400">The user "{username}" does not exist or has changed their name.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <div className="bg-surface rounded-2xl border border-gray-800 p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Background Decorative Gradient */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 to-secondary/10" />

                    <div className="relative">
                        <div className="w-40 h-40 mx-auto rounded-full p-1 bg-gradient-to-br from-primary to-secondary mb-6">
                            <img
                                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`}
                                alt={profile.username}
                                className="w-full h-full rounded-full object-cover bg-black border-4 border-black"
                            />
                        </div>

                        <h1 className="text-4xl font-extrabold text-white mb-2">{profile.username}</h1>
                        <p className="text-primary font-medium tracking-wide text-sm uppercase mb-8">Volcano Member</p>

                        <div className="max-w-xl mx-auto">
                            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                                {profile.bio || "This user hasn't written a bio yet."}
                            </p>
                        </div>

                        {/* Stats or Badges could go here later */}
                        <div className="mt-10 pt-10 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <span className="block text-gray-500 text-xs uppercase mb-1">Joined</span>
                                <span className="text-white font-mono">
                                    {profile.createdAt?.seconds
                                        ? new Date(profile.createdAt.seconds * 1000).getFullYear()
                                        : 'Unknown'}
                                </span>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <span className="block text-gray-500 text-xs uppercase mb-1">Role</span>
                                <span className="text-white font-mono capitalize">{profile.role || 'Trader'}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

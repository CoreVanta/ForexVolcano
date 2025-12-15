import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Button from '../../components/ui/Button';

const AdminProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        analystName: '',
        analystImage: '',
        analystBio: '',
        twitter: '',
        linkedin: '',
        telegram: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const docRef = doc(db, 'settings', 'profile');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'profile'), formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Analyst Profile Settings</h1>

            <div className="bg-surface p-8 rounded-xl border border-gray-800">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">Personal Details</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Analyst Name</label>
                            <input
                                type="text"
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                value={formData.analystName}
                                onChange={e => setFormData({ ...formData, analystName: e.target.value })}
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Profile Image URL</label>
                            <input
                                type="url"
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                value={formData.analystImage}
                                onChange={e => setFormData({ ...formData, analystImage: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                            <textarea
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none h-32 resize-none"
                                value={formData.analystBio}
                                onChange={e => setFormData({ ...formData, analystBio: e.target.value })}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                        <div className="md:col-span-3">
                            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">Social Connections</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Twitter (X) URL</label>
                            <input
                                type="url"
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                value={formData.twitter}
                                onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn URL</label>
                            <input
                                type="url"
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                value={formData.linkedin}
                                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Telegram URL</label>
                            <input
                                type="url"
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                value={formData.telegram}
                                onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                                placeholder="https://t.me/..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-800">
                        <Button type="submit" variant="primary" contentClassName="px-8">
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;

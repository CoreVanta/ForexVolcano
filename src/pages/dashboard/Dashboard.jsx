import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, collection, getDocs, setDoc, query, orderBy, where } from 'firebase/firestore';
import Button from '../../components/ui/Button';

// --- Sub-Component: Settings Tab ---
const DashboardSettings = ({ userProfile, setUserProfile }) => {
    // Initialize state, but also sync with useEffect when userProfile loads
    const [preferences, setPreferences] = useState(userProfile?.preferences || {
        newsImpacts: ['High', 'Medium', 'Low'],
        analysisCurrencies: ['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'US30'],
        analysisTypes: ['Technical', 'Fundamental']
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (userProfile?.preferences) {
            setPreferences(userProfile.preferences);
        }
    }, [userProfile]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                preferences
            }, { merge: true });
            setUserProfile({ ...userProfile, preferences });
            alert("Preferences saved!");
        } catch (error) {
            console.error("Error saving preferences:", error);
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const toggleArrayItem = (key, value) => {
        setPreferences(prev => {
            const list = prev[key] || [];
            if (list.includes(value)) {
                return { ...prev, [key]: list.filter(item => item !== value) };
            } else {
                return { ...prev, [key]: [...list, value] };
            }
        });
    };

    return (
        <div className="bg-surface p-6 rounded-xl border border-gray-800 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Dashboard Customization</h2>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium text-white mb-3">News Notifications</h3>
                    <p className="text-sm text-gray-400 mb-4">Select which news impacts you want to see.</p>
                    <div className="flex gap-4">
                        {['High', 'Medium', 'Low'].map(impact => (
                            <label key={impact} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.newsImpacts?.includes(impact)}
                                    onChange={() => toggleArrayItem('newsImpacts', impact)}
                                    className="form-checkbox text-primary rounded bg-gray-900 border-gray-700"
                                />
                                <span className="text-gray-300">{impact} Impact</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-medium text-white mb-3">Analysis Filters</h3>
                    <p className="text-sm text-gray-400 mb-4">Choose your favorite pairs to track.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD', 'ETHUSD', 'US30', 'NAS100'].map(pair => (
                            <label key={pair} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.analysisCurrencies?.includes(pair)}
                                    onChange={() => toggleArrayItem('analysisCurrencies', pair)}
                                    className="form-checkbox text-primary rounded bg-gray-900 border-gray-700"
                                />
                                <span className="text-gray-300">{pair}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Preferences'}</Button>
            </div>
        </div>
    );
};

// --- Sub-Component: Profile Tab ---
const DashboardProfile = ({ userProfile, setUserProfile }) => {
    const [username, setUsername] = useState(userProfile?.username || '');
    const [bio, setBio] = useState(userProfile?.bio || '');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Sync state when profile loads
    useEffect(() => {
        if (userProfile) {
            setUsername(userProfile.username || '');
            setBio(userProfile.bio || '');
        }
    }, [userProfile]);

    // Helper: Compress Image to Base64
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 300;
                    const MAX_HEIGHT = 300;
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation: warn if very large, though we compress anyway
        if (file.size > 5 * 1024 * 1024) {
            console.log("Large file detected, compression will be applied.");
        }

        setUploading(true);
        try {
            // Client-side compression
            const base64Image = await compressImage(file);

            // Check size of base64 string (approx limit for Firestore field is 1MB)
            if (base64Image.length > 500000) {
                console.warn("Image might be too large for smooth database performance");
            }

            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                avatar_url: base64Image
            }, { merge: true });

            setUserProfile({ ...userProfile, avatar_url: base64Image });
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            // Check username uniqueness if changed
            if (username !== userProfile?.username) {
                // If username is empty
                if (!username.trim()) {
                    alert("Username cannot be empty");
                    setSaving(false);
                    return;
                }

                const q = query(collection(db, 'users'), where('username', '==', username));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    alert("Username is already taken. Please choose another.");
                    setSaving(false);
                    return;
                }
            }

            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                username,
                bio
            }, { merge: true });

            setUserProfile({ ...userProfile, username, bio });
            alert("Profile updated!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-surface p-6 rounded-xl border border-gray-800 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 relative group">
                        <img
                            src={userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${userProfile?.username || 'User'}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-xs text-white">Change</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    {uploading && <span className="text-xs text-primary">Compressing & Saving...</span>}
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username (Public)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="e.g. CryptoKing"
                        />
                        <p className="text-xs text-gray-500 mt-1">Unique handle for your public profile.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none h-24 resize-none"
                            placeholder="Tell us about your trading journey..."
                        />
                    </div>

                    <div>
                        <Button onClick={handleSaveProfile} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                    {userProfile?.username && (
                        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800 flex items-center justify-between">
                            <span className="text-sm text-gray-400">Your Public Profile:</span>
                            <Link to={`/profile/${userProfile.username}`} className="text-primary hover:underline text-sm font-medium">
                                View Public Page &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---

const Dashboard = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Progress State
    const [myCourses, setMyCourses] = useState([]);

    // Stats
    const [stats, setStats] = useState({ totalProgress: 0, completed: 0, avgQuiz: 0 });

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    // 1. Fetch Profile
                    const docRef = doc(db, 'users', auth.currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    }

                    // 2. Fetch Course Progress
                    const progressSnap = await getDocs(collection(db, 'users', auth.currentUser.uid, 'course_progress'));
                    const progressMap = {};
                    progressSnap.docs.forEach(d => {
                        progressMap[d.id] = d.data();
                    });

                    if (Object.keys(progressMap).length > 0) {
                        // 3. Fetch Details for these courses (Ideally only fetch IDs needed)
                        // For simplicity, we fetch all courses and filter, or fetch individually. 
                        // To show "My Courses", we need course metadata.
                        const coursesSnap = await getDocs(collection(db, 'courses'));
                        const coursesData = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                        const myCoursesData = coursesData.filter(c => progressMap[c.id]).map(c => {
                            const userProgress = progressMap[c.id];

                            // Calculate % (Need total lessons count... simple approximation or fetch lessons count)
                            // For now we don't have total lessons stored on course doc properly unless we count subcollection.
                            // Let's assume '12' or '20' or add a field 'totalLessons' to course in ManageCourses.
                            // Wait, ManageCourses doesn't verify totalLessons count efficiently yet.
                            // Let's assume we can't get perfect % without fetch. 
                            // We'll just show "Lessons Completed: X" for now.

                            const completedCount = userProgress.completedLessonIds?.length || 0;

                            return {
                                ...c,
                                completedCount,
                                lastAccessed: userProgress.lastAccessed
                            };
                        });

                        setMyCourses(myCoursesData);

                        // Calculate Stats
                        const totalCompleted = myCoursesData.reduce((acc, c) => acc + c.completedCount, 0);
                        setStats({ totalProgress: totalCompleted, completed: myCoursesData.length, avgQuiz: 0 }); // AvgQuiz placeholder
                    }

                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, []);

    const displayName = userProfile?.username || auth.currentUser?.displayName || 'Trader';

    console.log("Dashboard Render", { loading, userProfile, activeTab });

    return (
        <div className="min-h-screen bg-background text-white animate-fade-in">
            {/* Top Welcome Section */}
            <div className="bg-surface border-b border-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
                            <img
                                src={userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${displayName}`}
                                alt="Profile"
                                className="h-full w-full rounded-full bg-background object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Welcome back, <span className="text-primary">{displayName}</span>
                            </h1>
                            <p className="mt-1 text-gray-400">
                                Ready to dominate the markets today?
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Tabs */}
                <div className="flex space-x-6 mb-8 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        My Learning
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        Settings & Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        Profile
                    </button>
                </div>

                {activeTab === 'overview' ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-12">
                            <div className="bg-surface overflow-hidden shadow rounded-lg border border-gray-800">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-400 truncate">Lessons Completed</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalProgress}</dd>
                                </div>
                            </div>
                            <div className="bg-surface overflow-hidden shadow rounded-lg border border-gray-800">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-400 truncate">Active Courses</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-primary">{stats.completed}</dd>
                                </div>
                            </div>
                            <div className="bg-surface overflow-hidden shadow rounded-lg border border-gray-800">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-400 truncate">Quiz Score Avg</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-secondary">N/A</dd>
                                </div>
                            </div>
                        </div>

                        {/* Course List */}
                        <h2 className="text-2xl font-bold text-white mb-6">Your Courses</h2>
                        {myCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {myCourses.map((course) => (
                                    <div key={course.id} className="bg-surface rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors group">
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/academy/${course.path || 'General'}/${course.id}`}>
                                                    <Button variant="primary" size="sm">Continue Learning</Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>

                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm text-gray-400 mb-1">
                                                    <span>Lessons Completed</span>
                                                    <span>{course.completedCount}</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full bg-secondary"
                                                        style={{ width: `${Math.min((course.completedCount / 10) * 100, 100)}%` }} // Placeholder % calc
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-surface rounded-xl border border-gray-800">
                                <p className="text-gray-400 mb-4">You haven't started any courses yet.</p>
                                <Link to="/academy"><Button>Explore Academy</Button></Link>
                            </div>
                        )}
                    </>
                ) : activeTab === 'settings' ? (
                    <DashboardSettings userProfile={userProfile} setUserProfile={setUserProfile} />
                ) : (
                    <DashboardProfile userProfile={userProfile} setUserProfile={setUserProfile} />
                )}

            </div>
        </div>
    );
};

export default Dashboard;

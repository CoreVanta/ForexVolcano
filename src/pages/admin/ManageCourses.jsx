import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
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

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [editCourseId, setEditCourseId] = useState(null);

    // Course Form State
    const [courseForm, setCourseForm] = useState({ title: '', description: '', image: '', level: 'Beginner' });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'courses'), orderBy('order', 'asc')); // Assuming 'order' field or just default
            // If 'order' doesn't exist yet, it might throw or return empty depending on index. safe fallback:
            // const q = collection(db, 'courses'); 
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
            // Fallback if index missing
            const snapshot = await getDocs(collection(db, 'courses'));
            setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            if (editCourseId) {
                await updateDoc(doc(db, 'courses', editCourseId), {
                    ...courseForm,
                    // Keep existing order and createdAt
                });
            } else {
                await addDoc(collection(db, 'courses'), {
                    ...courseForm,
                    order: courses.length + 1,
                    createdAt: serverTimestamp()
                });
            }
            setIsAddingCourse(false);
            setEditCourseId(null);
            setCourseForm({ title: '', description: '', image: '', level: 'Beginner' });
            fetchCourses();
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course");
        }
    };

    const handleEditCourse = (course) => {
        setCourseForm({
            title: course.title,
            description: course.description,
            image: course.image,
            level: course.level || 'Beginner'
        });
        setEditCourseId(course.id);
        setIsAddingCourse(true);
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Delete this course? All lessons inside it might become orphaned.')) {
            try {
                await deleteDoc(doc(db, 'courses', id));
                fetchCourses();
                if (selectedCourse?.id === id) setSelectedCourse(null);
            } catch (error) {
                console.error("Error deleting course:", error);
                alert("Delete failed");
            }
        }
    };

    if (selectedCourse) {
        return (
            <ManageLessons
                course={selectedCourse}
                onBack={() => setSelectedCourse(null)}
            />
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
                <Button onClick={() => {
                    setIsAddingCourse(!isAddingCourse);
                    if (isAddingCourse) { setEditCourseId(null); setCourseForm({ title: '', description: '', image: '', level: 'Beginner' }); }
                }}>
                    {isAddingCourse ? 'Cancel' : 'New Course'}
                </Button>
            </div>

            {isAddingCourse && (
                <div className="bg-surface p-6 rounded-xl border border-gray-800 mb-8 animate-fade-in">
                    <h2 className="text-xl font-bold text-white mb-4">{editCourseId ? 'Edit Course' : 'Create New Course'}</h2>
                    <form onSubmit={handleAddCourse} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Course Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={courseForm.title}
                                    onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Level</label>
                                <select
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={courseForm.level}
                                    onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <div className="bg-white rounded-lg overflow-hidden text-black">
                                <ReactQuill
                                    theme="snow"
                                    value={courseForm.description}
                                    onChange={(content) => setCourseForm({ ...courseForm, description: content })}
                                    modules={modules}
                                    formats={formats}
                                    className="h-48 mb-12"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image URL</label>
                            <input
                                type="url"
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                value={courseForm.image}
                                onChange={e => setCourseForm({ ...courseForm, image: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="primary">{editCourseId ? 'Update Course' : 'Create Course'}</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <div className="text-gray-400">Loading courses...</div> : courses.map(course => (
                    <div key={course.id} className="bg-surface rounded-xl border border-gray-800 overflow-hidden group hover:border-gray-600 transition-all">
                        <div className="h-40 bg-gray-900 relative">
                            {course.image && <img src={course.image} alt={course.title} className="w-full h-full object-cover" />}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); handleEditCourse(course); }} className="bg-primary/80 p-1 rounded text-white hover:bg-primary">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }} className="bg-red-500/80 p-1 rounded text-white hover:bg-red-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                            <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedCourse(course)}>
                                Manage Lessons
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Sub-Component: Manage Lessons ---

const ManageLessons = ({ course, onBack }) => {
    const [lessons, setLessons] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editLessonId, setEditLessonId] = useState(null);
    const [lessonForm, setLessonForm] = useState({ title: '', videoUrl: '', content: '', duration: '10 min' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLessons();
    }, [course]);

    const fetchLessons = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'courses', course.id, 'lessons'), orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            setLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching lessons:", error);
            const snapshot = await getDocs(collection(db, 'courses', course.id, 'lessons'));
            setLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            if (editLessonId) {
                await updateDoc(doc(db, 'courses', course.id, 'lessons', editLessonId), {
                    ...lessonForm,
                });
            } else {
                await addDoc(collection(db, 'courses', course.id, 'lessons'), {
                    ...lessonForm,
                    order: lessons.length + 1,
                    createdAt: serverTimestamp()
                });
            }
            setIsAdding(false);
            setEditLessonId(null);
            setLessonForm({ title: '', videoUrl: '', content: '', duration: '10 min' });
            fetchLessons();
        } catch (error) {
            console.error("Error saving lesson:", error);
            alert("Failed to save lesson");
        }
    };

    const handleEditLesson = (lesson) => {
        setLessonForm({
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            content: lesson.content,
            duration: lesson.duration
        });
        setEditLessonId(lesson.id);
        setIsAdding(true);
    };

    const handleDeleteLesson = async (lessonId) => {
        if (window.confirm('Delete this lesson?')) {
            try {
                await deleteDoc(doc(db, 'courses', course.id, 'lessons', lessonId));
                fetchLessons();
            } catch (error) {
                console.error("Error deleting lesson:", error);
            }
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back
                </button>
                <h1 className="text-2xl font-bold text-white">
                    <span className="text-gray-500 font-normal">Edit Course:</span> {course.title}
                </h1>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Lessons ({lessons.length})</h2>
                <Button onClick={() => {
                    setIsAdding(!isAdding);
                    if (isAdding) { setEditLessonId(null); setLessonForm({ title: '', videoUrl: '', content: '', duration: '10 min' }); }
                }} variant="secondary">
                    {isAdding ? 'Cancel' : 'Add Lesson'}
                </Button>
            </div>

            {isAdding && (
                <div className="bg-surface p-6 rounded-xl border border-gray-800 mb-8 animate-fade-in">
                    <form onSubmit={handleAddLesson} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Lesson Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={lessonForm.title}
                                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    value={lessonForm.duration}
                                    onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                    placeholder="e.g. 15 min"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Video Embed URL (YouTube/Vimeo)</label>
                            <input
                                type="url"
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                                value={lessonForm.videoUrl}
                                onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                placeholder="https://www.youtube.com/embed/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Lesson Content / Notes</label>
                            <div className="bg-white rounded-lg overflow-hidden text-black">
                                <ReactQuill
                                    theme="snow"
                                    value={lessonForm.content}
                                    onChange={(content) => setLessonForm({ ...lessonForm, content })}
                                    modules={modules}
                                    formats={formats}
                                    className="h-72 mb-12"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="primary">{editLessonId ? 'Update Lesson' : 'Save Lesson'}</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-3">
                {loading ? <div className="text-gray-400">Loading lessons...</div> : lessons.map((lesson, index) => (
                    <div key={lesson.id} className="bg-surface p-4 rounded-lg border border-gray-800 flex justify-between items-center group hover:border-gray-600">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-400 font-bold text-sm">
                                {index + 1}
                            </span>
                            <div>
                                <h3 className="font-medium text-white">{lesson.title}</h3>
                                <div className="text-xs text-gray-500">{lesson.duration}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditLesson(lesson)} className="text-primary hover:text-primary/80 text-sm">Edit</button>
                            <button onClick={() => handleDeleteLesson(lesson.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                        </div>
                    </div>
                ))}
                {lessons.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
                        No lessons yet. Start teaching!
                    </div>
                )}
            </div>

        </div>
    );
};

export default ManageCourses;

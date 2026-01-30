'use client';
import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { PlusCircle, User, MessageSquare, Calendar, Edit, Trash2, Save, X, Eye } from 'lucide-react';

const Postpage = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [editingPost, setEditingPost] = useState(null);
    const [viewingPost, setViewingPost] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);

    // Fetch all posts
    const fetchPosts = async () => {
        try {
            const res = await api.get('/');
            setPosts(res.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            alert('Failed to fetch posts');
        }
    };

    // Fetch single post for view

    const fetchPostById = async (id) => {
        try {
            const res = await api.get(`/${id}`);
            setViewingPost(res.data);
        } catch (err) {
            console.error('Error fetching post:', err);
            alert('Failed to fetch post details');
        }
    };


    // Create post
    const createPost = async () => {
        if (!title.trim() || !content.trim() || !author.trim()) {
            alert('All fields are required!');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/', { title, content, author });
            setPosts([res.data, ...posts]);
            setTitle('');
            setContent('');
            setAuthor('');
            alert('Post created successfully!');
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update post
    const updatePost = async () => {
        if (!title.trim() || !content.trim() || !author.trim()) {
            alert('All fields are required!');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/${editingPost.id}`, { title, content, author });

            setPosts(posts.map(post =>
                post.id === editingPost.id
                    ? { ...post, title, content, author }
                    : post
            ));

            setEditingPost(null);
            setTitle('');
            setContent('');
            setAuthor('');
            alert('Post updated successfully!');
        } catch (err) {
            console.error('Error updating post:', err);
            alert('Failed to update post');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete post
    const deletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        setIsDeleting(id);
        try {
            await api.delete(`/${id}`);
            setPosts(posts.filter(post => post.id !== id));

            // Close modal if viewing the deleted post
            if (viewingPost?.id === id) {
                setViewingPost(null);
            }

            alert('Post deleted successfully!');
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Failed to delete post');
        } finally {
            setIsDeleting(null);
        }
    };

    // Start editing a post
    const startEdit = (post) => {
        setEditingPost(post);
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author);
        setViewingPost(null);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingPost(null);
        setTitle('');
        setContent('');
        setAuthor('');
    };

    // View post details
    const viewPost = (post) => {
        setViewingPost(post);
        setEditingPost(null);
    };

    // Close view modal
    const closeView = () => {
        setViewingPost(null);
    };

    // Handle form submission (create or update)
    const handleSubmit = () => {
        if (editingPost) {
            updatePost();
        } else {
            createPost();
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Filter posts based on active tab
    const filteredPosts = activeTab === 'recent'
        ? posts.slice(0, 5)
        : posts;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Blog Community
                        </h1>
                        <p className="text-gray-600 mt-2">Share your thoughts and ideas with the world</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-white rounded-full shadow-sm border">
                            <span className="font-medium text-gray-700">
                                {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Create/Edit Post Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2 ${editingPost ? 'bg-yellow-100' : 'bg-blue-100'} rounded-lg`}>
                                    {editingPost ? (
                                        <Edit className="w-6 h-6 text-yellow-600" />
                                    ) : (
                                        <PlusCircle className="w-6 h-6 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {editingPost ? 'Edit Post' : 'Create New Post'}
                                    </h2>
                                    {editingPost && (
                                        <p className="text-sm text-gray-500 mt-1">Editing: {editingPost.title}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="What's on your mind?"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        placeholder="Share your thoughts..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Author
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`flex-1 py-3.5 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center gap-2
                                            ${isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : editingPost
                                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:shadow-lg'
                                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
                                            } transform hover:-translate-y-0.5`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                {editingPost ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            <>
                                                {editingPost ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                                                {editingPost ? 'Update Post' : 'Create Post'}
                                            </>
                                        )}
                                    </button>

                                    {editingPost && (
                                        <button
                                            onClick={cancelEdit}
                                            className="px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-500 text-center">
                                    {editingPost
                                        ? 'Update your post to share the latest version with the community'
                                        : 'Share your unique perspective with our community'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Posts List */}
                    <div className="lg:col-span-2">
                        {/* Filter Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2 border border-gray-100">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${activeTab === 'all'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    All Posts
                                </button>
                                <button
                                    onClick={() => setActiveTab('recent')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${activeTab === 'recent'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Recent
                                </button>
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="space-y-6">
                            {filteredPosts.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No posts yet</h3>
                                    <p className="text-gray-500 mb-6">Be the first to share your thoughts!</p>
                                    <button
                                        onClick={() => document.querySelector('input')?.focus()}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        Create First Post
                                    </button>
                                </div>
                            ) : (
                                filteredPosts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 group"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1 cursor-pointer" onClick={() => viewPost(post)}>
                                                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                                                        {post.title}
                                                    </h2>
                                                    <div className="flex items-center gap-4 mt-3">
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {post.author}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-500">
                                                                Posted recently
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => startEdit(post)}
                                                        className="p-2 hover:bg-yellow-50 rounded-lg transition-colors duration-150"
                                                        title="Edit post"
                                                    >
                                                        <Edit className="w-4 h-4 text-yellow-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => viewPost(post)}
                                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                        title="View details"
                                                    >
                                                        <Eye className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => deletePost(post.id)}
                                                        disabled={isDeleting === post.id}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-150 disabled:opacity-50"
                                                        title="Delete post"
                                                    >
                                                        {isDeleting === post.id ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="cursor-pointer" onClick={() => viewPost(post)}>
                                                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                                                    {post.content}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>Click to view details</span>
                                                </div>
                                                <button
                                                    onClick={() => viewPost(post)}
                                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                >
                                                    View Details →
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>

                        {/* Pagination / Stats */}
                        {posts.length > 0 && (
                            <div className="mt-8 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {filteredPosts.length} of {posts.length} posts
                                </div>
                                {activeTab === 'recent' && posts.length > 5 && (
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    >
                                        View all posts
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* View Post Modal */}

            {viewingPost && (
                <div className="fixed inset-0 bg bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">{viewingPost.title}</h2>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700">
                                                {viewingPost.author}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">
                                                Posted recently
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={closeView}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {viewingPost.content}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        startEdit(viewingPost);
                                        closeView();
                                    }}
                                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-5 h-5" />
                                    Edit Post
                                </button>
                                <button
                                    onClick={() => deletePost(viewingPost.id)}
                                    disabled={isDeleting === viewingPost.id}
                                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {isDeleting === viewingPost.id ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5" />
                                            Delete Post
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200">
                <div className="text-center text-gray-500 text-sm">
                    <p>© 2024 Blog Community. All thoughts shared here belong to their respective authors.</p>
                    <p className="mt-1">Built with ❤️ for meaningful conversations</p>
                </div>
            </footer>


            <div className="relative">

                <div className="absolute left-263px top-2 block md:hidden">

                    <button
                        title="Reload"
                        type="button"
                        onClick={() => getRecords()}
                        className=" p-2  rounded-full bg-gray-200 hover:bg-gray-300 transition-transform duration-300 active:scale-95"
                    >
                        {/* <FiRefreshCcw className="transition-transform duration-500 hover:rotate-180 active:rotate-360" /> */}
                    </button>


                </div>

            </div>


        </div>
    );
};

export default Postpage;
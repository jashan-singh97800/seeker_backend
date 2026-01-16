import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation, useUploadResumeMutation } from '../app/api/profileApiSlice';
import { Upload, FileText, Download, Linkedin, Globe, User, Phone, Mail, Briefcase } from 'lucide-react';

const UserProfilePage = () => {
    const user = useAppSelector(selectCurrentUser);
    const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        bio: '',
        linkedin_url: '',
        portfolio_url: '',
        skills: '',
    });

    // Update form when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                bio: profile.bio || '',
                linkedin_url: profile.linkedin_url || '',
                portfolio_url: profile.portfolio_url || '',
                skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
            });
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            await updateProfile({
                ...formData,
                skills: skillsArray,
            }).unwrap();
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    const validateFile = (file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Only PDF files are allowed';
        }
        // Limit removed to support large uploads as per requirements
        return null;
    };

    const handleFileUpload = async (file: File) => {
        setUploadError('');
        const error = validateFile(file);
        if (error) {
            setUploadError(error);
            return;
        }

        try {
            await uploadResume(file).unwrap();
            setSuccessMessage('Resume uploaded successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setUploadError('Failed to upload resume. Please try again.');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDownloadResume = () => {
        if (profile?.resume_url) {
            window.open(`http://localhost:3008${profile.resume_url}`, '_blank');
        }
    };

    if (profileLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="px-4 py-12 max-w-4xl mx-auto">
            <header className="mb-12">
                <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                    My <span className="text-blue-600">Profile</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg font-medium">
                    Manage your professional information
                </p>
            </header>

            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Personal Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <User size={16} />
                                        <span>Full Name</span>
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all font-medium"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Phone size={16} />
                                        <span>Phone Number</span>
                                    </div>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all font-medium"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Mail size={16} />
                                        <span>Email</span>
                                    </div>
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-xl font-medium text-gray-500 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Briefcase size={16} />
                                        <span>Bio</span>
                                    </div>
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all font-medium"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Skills</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all font-medium"
                                    placeholder="React, Node.js, TypeScript (comma separated)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Linkedin size={16} />
                                        <span>LinkedIn URL</span>
                                    </div>
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedin_url}
                                    onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all font-medium"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Globe size={16} />
                                        <span>Portfolio URL</span>
                                    </div>
                                </label>
                                <input
                                    type="url"
                                    value={formData.portfolio_url}
                                    onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all font-medium"
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isUpdating ? 'Saving...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Resume Upload Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 mb-4">Resume</h2>

                        {profile?.resume_url ? (
                            <div className="mb-6">
                                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <FileText className="text-green-600" size={24} />
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-900">Resume Uploaded</div>
                                        <div className="text-xs text-gray-500">Click to download</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownloadResume}
                                    className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                                >
                                    <Download size={18} />
                                    <span>Download Resume</span>
                                </button>
                            </div>
                        ) : (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <p className="text-xs text-yellow-700 font-semibold">
                                    Upload your resume to apply for jobs
                                </p>
                            </div>
                        )}

                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${isDragging
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className={`mx-auto mb-3 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} size={36} />
                            <p className="text-sm font-bold text-gray-700 mb-1">
                                {isDragging ? 'Drop file here' : 'Upload Resume'}
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF only, max 5MB
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {uploadError && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-xs text-red-700 font-semibold">{uploadError}</p>
                            </div>
                        )}

                        {isUploading && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-xs text-blue-700 font-semibold">Uploading...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;

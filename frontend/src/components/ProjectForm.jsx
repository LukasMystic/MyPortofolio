import React, { useState } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Base URL for your own backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// --- Axios Instance for Cloudinary ---
// Create a separate, clean Axios instance specifically for Cloudinary uploads.
// This prevents any global interceptors (like auth tokens) from being sent to Cloudinary.
const cloudinaryAxios = axios.create();

/**
 * Handles the secure, direct-to-Cloudinary upload process.
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<string>} The secure URL of the uploaded image.
 */
const uploadToCloudinary = async (file) => {
  // 1. Request a signature from our backend.
  const { data: signData } = await axios.get(`${API_BASE_URL}/api/projects/sign-upload`);

  // 2. Prepare the form data for Cloudinary's API.
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signData.apikey);
  formData.append('timestamp', signData.timestamp);
  formData.append('signature', signData.signature);
  formData.append('folder', 'portfolio_uploads'); // Specifies a folder in your Cloudinary account

  // 3. Send the file and signature directly to Cloudinary's API endpoint.
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signData.cloudname}/image/upload`;
  const { data: cloudinaryData } = await cloudinaryAxios.post(cloudinaryUrl, formData);
  
  // 4. Return the secure URL provided by Cloudinary.
  return cloudinaryData.secure_url;
};

/**
 * Custom CKEditor adapter that uses our direct-to-Cloudinary upload logic.
 */
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  
  async upload() {
    try {
      const file = await this.loader.file;
      const imageUrl = await uploadToCloudinary(file);
      // CKEditor expects the response in this specific format
      return {
        default: imageUrl
      };
    } catch (error) {
      console.error('CKEditor upload failed:', error);
      // It's crucial to reject the promise on failure
      return Promise.reject(error);
    }
  }
  
  abort() {
    // Abort logic can be implemented here if needed
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new MyUploadAdapter(loader);
}

// --- Main Project Form Component ---
const ProjectForm = ({ onProjectAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(''); // State now holds the final URL
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const imageUrl = await uploadToCloudinary(file);
      setThumbnailUrl(imageUrl);
    } catch (err) {
      setError('Image upload failed. Please try again.');
      console.error('Thumbnail upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnailUrl) {
      setError('A thumbnail image must be uploaded first.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // The payload is now small and efficient, containing only the Cloudinary URL
      const payload = { title, description, thumbnailUrl };
      const { data } = await axios.post(`${API_BASE_URL}/api/projects`, payload);
      
      setSuccess('Project added successfully!');
      if (onProjectAdded) onProjectAdded(data);

      // Reset the form to its initial state
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
    } catch (err) {
      console.error("Error adding project:", err.response || err);
      const message = err.response?.data?.message || 'Please try again.';
      setError(`Failed to add project. ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 dark:bg-slate-900/70 dark:border-slate-800">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Add New Project</h3>
      {error && <div className="bg-rose-100 text-rose-800 p-3 rounded mb-4 dark:bg-rose-900/40 dark:text-rose-200">{error}</div>}
      {success && <div className="bg-emerald-100 text-emerald-800 p-3 rounded mb-4 dark:bg-emerald-900/40 dark:text-emerald-200">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2 dark:text-white">Project Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My Awesome Web App"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-lg dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:placeholder:text-slate-400"
            required
          />
        </div>
        
        <div>
          <label htmlFor="thumbnail" className="block text-lg font-medium text-gray-700 mb-2 dark:text-white">Project Thumbnail</label>
          <input 
            type="file"
            id="thumbnail"
            onChange={handleThumbnailChange}
            accept="image/*"
            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-300 dark:file:bg-slate-800/70 dark:file:text-slate-200"
            required 
            disabled={isUploading}
          />
          {isUploading && <p className="mt-2 text-sm text-blue-500 animate-pulse">Uploading image, please wait...</p>}
          {thumbnailUrl && !isUploading && (
            <div className="mt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Upload successful:</p>
              <img src={thumbnailUrl} alt="Thumbnail Preview" className="mt-2 rounded-lg max-h-48 border bg-gray-100 dark:border-slate-700 dark:bg-slate-800/60" />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2 dark:text-white">Full Description</label>
          <div className="editor-container">
            <CKEditor
              editor={ClassicEditor}
              data={description}
              config={{ extraPlugins: [MyCustomUploadAdapterPlugin] }}
              onChange={(event, editor) => setDescription(editor.getData())}
            />
          </div>
        </div>
        
        <div>
          <button type="submit" disabled={isSubmitting || isUploading} className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-lg font-semibold text-white shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
            {isUploading ? 'Waiting for upload...' : (isSubmitting ? 'Adding Project...' : 'Add Project')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;

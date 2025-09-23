import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// --- Standalone Image Editor Modal Component ---
const ImageEditorModal = ({ file, onConfirm, onCancel }) => {
  const [width, setWidth] = useState(800);
  const [quality, setQuality] = useState(0.8);
  const [previewURL, setPreviewURL] = useState('');
  const imageContainerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setInitialMouseX(e.clientX);
    setInitialWidth(imageContainerRef.current.offsetWidth);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const dx = e.clientX - initialMouseX;
    const newWidth = Math.max(300, Math.min(initialWidth + dx, 1200));
    setWidth(Math.round(newWidth));
  }, [isResizing, initialMouseX, initialWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewURL(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleApply = () => {
    const img = new Image();
    img.src = previewURL;
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round(width / aspectRatio);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          onConfirm(resizedFile);
        },
        file.type,
        quality
      );
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Resize & Compress Image</h3>
        {previewURL && (
          <div
            ref={imageContainerRef}
            className="relative flex justify-center mb-4 bg-gray-900 p-2 rounded-lg mx-auto"
            style={{ width: `${width}px` }}
          >
            <img src={previewURL} alt="Preview" className="max-h-64 object-contain w-full" />
            <div
              onMouseDown={handleMouseDown}
              className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize border-2 border-gray-800 hover:bg-blue-400"
              title="Drag to resize"
            />
          </div>
        )}
        <div className="my-4 space-y-4">
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-300">Width (px): <span className="text-blue-400 font-bold">{width}</span></label>
            <input type="range" min="300" max="1200" step="50" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-300">Quality (0.1–1): <span className="text-blue-400 font-bold">{quality}</span></label>
            <input type="range" step="0.1" min="0.1" max="1" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
          <button onClick={handleApply} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Apply & Upload</button>
        </div>
      </div>
    </div>
  );
};

const processImageWithModal = (file) => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const cleanup = () => { root.unmount(); document.body.removeChild(container); };
    
    root.render(
      <ImageEditorModal 
        file={file} 
        onConfirm={(processedFile) => { cleanup(); resolve(processedFile); }} 
        onCancel={() => { cleanup(); reject(new Error('Image processing cancelled by user.')); }} 
      />
    );
  });
};

class MyUploadAdapter {
  constructor(loader) { this.loader = loader; }
  async upload() {
    const originalFile = await this.loader.file;
    try {
      const processedFile = await processImageWithModal(originalFile);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = reader.result;
            const response = await axios.post('/api/projects/editor-upload', { image: base64 });
            resolve({ default: response.data.url });
          } catch (error) { reject('Upload to server failed.'); }
        };
        reader.onerror = () => reject('File reader error.');
        reader.readAsDataURL(processedFile);
      });
    } catch (err) {
      console.log(err.message);
      return Promise.reject(err);
    }
  }
  abort() { /* Abort logic if needed */ }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new MyUploadAdapter(loader);
}

const ProjectForm = ({ onProjectAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailImage(reader.result);
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnailImage) {
      setError('A thumbnail image is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = { title, description, thumbnailImage };
      const { data } = await axios.post('/api/projects', payload);
      
      setSuccess('Project added successfully!');
      
      // --- FIX: Check if the prop exists before calling it ---
      if (onProjectAdded) {
        onProjectAdded(data);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setThumbnailImage(null);
      setThumbnailPreview('');

    } catch (err) {
      setError('Failed to add project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Project</h3>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">Project Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg" required />
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-lg font-medium text-gray-700 mb-2">Project Thumbnail</label>
          <input type="file" id="thumbnail" onChange={handleThumbnailChange} accept="image/*" className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
          {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-4 rounded-lg max-h-48 border bg-gray-100" />}
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Full Description</label>
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
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400">
            {isSubmitting ? 'Adding Project...' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;


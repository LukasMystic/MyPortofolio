import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingSpinner from '../components/LoadingSpinner';

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

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;
      const dx = e.clientX - initialMouseX;
      const newWidth = Math.max(300, Math.min(initialWidth + dx, 1200));
      setWidth(Math.round(newWidth));
    },
    [isResizing, initialMouseX, initialWidth]
  );

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
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round(width / aspectRatio);
      const ctx = canvas.getContext('2d');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Resize & Compress Image</h3>
        {previewURL && (
          <div ref={imageContainerRef} className="relative mx-auto mb-4 bg-slate-800 p-2 rounded-lg" style={{ width: `${width}px` }}>
            <img src={previewURL} alt="Preview" className="max-h-64 w-full object-contain" />
            <div
              onMouseDown={handleMouseDown}
              className="absolute bottom-1 right-1 h-4 w-4 cursor-se-resize rounded-full border-2 border-slate-900 bg-blue-500 hover:bg-blue-400"
              title="Drag to resize"
            />
          </div>
        )}
        <div className="my-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Width (px): <span className="font-bold text-blue-400">{width}</span>
            </label>
            <input type="range" min="300" max="1200" step="50" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="h-2 w-full cursor-pointer rounded-lg bg-slate-600" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Quality (0.1–1): <span className="font-bold text-blue-400">{quality}</span>
            </label>
            <input type="range" step="0.1" min="0.1" max="1" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="h-2 w-full cursor-pointer rounded-lg bg-slate-600" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg bg-slate-600 px-4 py-2 transition-colors hover:bg-slate-500">
            Cancel
          </button>
          <button onClick={handleApply} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700">
            Apply & Upload
          </button>
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
    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <ImageEditorModal
        file={file}
        onConfirm={(processedFile) => {
          cleanup();
          resolve(processedFile);
        }}
        onCancel={() => {
          cleanup();
          reject(new Error('Image processing cancelled by user.'));
        }}
      />
    );
  });
};

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
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
          } catch (error) {
            reject('Upload to server failed.');
          }
        };
        reader.onerror = () => reject('File reader error.');
        reader.readAsDataURL(processedFile);
      });
    } catch (err) {
      console.log(err.message);
      return Promise.reject(err);
    }
  }
  abort() {}
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new MyUploadAdapter(loader);
}

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/projects/${id}`);
        setTitle(data.title);
        setDescription(data.description);
        setCurrentThumbnail(data.thumbnailUrl);
      } catch (err) {
        setError('Could not load project data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

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
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        title,
        description,
        ...(thumbnailImage && { thumbnailImage }),
      };
      await axios.put(`/api/projects/${id}`, payload);
      setSuccess('Project updated successfully! Redirecting...');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError('Failed to update project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <h2 className="mb-6 text-3xl font-extrabold text-slate-900 dark:text-slate-100">Edit Project</h2>
      {error && <div className="mb-4 rounded bg-rose-100 p-3 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">{error}</div>}
      {success && <div className="mb-4 rounded bg-emerald-100 p-3 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-lg font-medium text-slate-700 dark:text-slate-300">
            Project Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-lg dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
            required
          />
        </div>
        <div>
          <label htmlFor="thumbnail" className="mb-2 block text-lg font-medium text-slate-700 dark:text-slate-300">
            Change Thumbnail (Optional)
          </label>
          <input
            type="file"
            id="thumbnail"
            onChange={handleThumbnailChange}
            accept="image/*"
            className="w-full text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-300 dark:file:bg-slate-800/70 dark:file:text-slate-200"
          />
          <div className="mt-4">
            <p className="mb-2 text-sm text-slate-500">Current Thumbnail:</p>
            <img src={thumbnailPreview || currentThumbnail} alt="Thumbnail" className="max-h-48 rounded-lg border bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60" />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-lg font-medium text-slate-700 dark:text-slate-300">Full Description</label>
          <div className="editor-container">
            <CKEditor editor={ClassicEditor} data={description} config={{ extraPlugins: [MyCustomUploadAdapterPlugin] }} onChange={(event, editor) => setDescription(editor.getData())} />
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-lg font-semibold text-white shadow hover:shadow-lg disabled:opacity-60"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;

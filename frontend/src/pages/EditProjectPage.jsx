import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const ImageEditorModal = ({ file, onConfirm, onCancel }) => {
  const [width, setWidth] = useState(800);
  const [quality, setQuality] = useState(1);
  const [previewURL, setPreviewURL] = useState('');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const imageContainerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setInitialMouseX(e.clientX);
    setInitialWidth(width); // Use actual width state, not container width
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;
      const dx = e.clientX - initialMouseX;
      const sensitivity = 2; // Make dragging more sensitive
      const newWidth = Math.max(200, Math.min(initialWidth + (dx * sensitivity), 2000));
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

    // Create a temporary image to read its dimensions
    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      // Set the initial width to the image's actual width,
      // but keep it within our allowed 200-2000px range.
      const initialImageWidth = Math.max(200, Math.min(img.width, 2000));
      setWidth(initialImageWidth);
    };

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleApply = () => {
    // Check if no processing is needed (same dimensions and max quality)
    if (width === originalDimensions.width && quality === 1) {
      // Use original file without any processing
      onConfirm(file);
      return;
    }

    const img = new Image();
    img.src = previewURL;
    img.onload = () => {
      try {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        const targetHeight = Math.round(width / aspectRatio);
        
        // Validate dimensions
        if (targetHeight < 50 || targetHeight > 4000) {
          throw new Error('Invalid image dimensions after resize');
        }
        
        // Create high-DPI canvas for better quality
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = targetHeight;
        
        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Clear canvas with white background for JPEG
        if (file.type === 'image/jpeg' || (file.type === 'image/png' && quality < 1)) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw image with high quality
        ctx.drawImage(img, 0, 0, width, targetHeight);
        
        // Determine output format and quality
        let outputType = file.type;
        let outputQuality = quality;
        
        // For PNG files, if quality is less than 1, convert to JPEG
        if (file.type === 'image/png' && quality < 1) {
          outputType = 'image/jpeg';
        }
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('Failed to create blob from canvas');
              throw new Error('Failed to process image');
            }
            
            const resizedFile = new File([blob], file.name, {
              type: outputType,
              lastModified: Date.now(),
            });
            onConfirm(resizedFile);
          },
          outputType,
          outputType === 'image/jpeg' ? outputQuality : undefined
        );
      } catch (error) {
        console.error('Error processing image:', error);
        onCancel();
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load image for processing');
      onCancel();
    };
  };

  const getEstimatedSize = () => {
    if (!originalDimensions.width) return 'Calculating...';
    
    const aspectRatio = originalDimensions.width / originalDimensions.height;
    const targetHeight = Math.round(width / aspectRatio);
    const compressionRatio = quality;
    const pixelCount = width * targetHeight;
    
    // Rough estimation (actual size will vary based on image content)
    let estimatedBytes;
    if (file.type === 'image/jpeg' || (file.type === 'image/png' && quality < 1)) {
      // JPEG estimation: ~3 bytes per pixel at quality 1, scaled by quality
      estimatedBytes = pixelCount * 3 * compressionRatio;
    } else {
      // PNG estimation: ~4 bytes per pixel (varies greatly with content)
      estimatedBytes = pixelCount * 4;
    }
    
    if (estimatedBytes < 1024) return `~${Math.round(estimatedBytes)}B`;
    if (estimatedBytes < 1024 * 1024) return `~${Math.round(estimatedBytes / 1024)}KB`;
    return `~${(estimatedBytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Resize & Compress Image</h3>
        
        {originalDimensions.width > 0 && (
          <div className="mb-4 text-sm text-slate-400">
            Original: {originalDimensions.width} × {originalDimensions.height}px
          </div>
        )}
        
        {previewURL && (
          <div className="relative mx-auto mb-4 bg-slate-800 p-2 rounded-lg overflow-hidden" style={{ maxWidth: '100%', width: 'fit-content' }}>
            <div 
              ref={imageContainerRef}
              className="relative"
              style={{ width: `${Math.min(width, 400)}px` }} // Preview max 400px for UI
            >
              <img 
                src={previewURL} 
                alt="Preview" 
                className="w-full object-contain block" 
                style={{ maxHeight: '300px' }}
              /> 
              <div
                onMouseDown={handleMouseDown}
                className="absolute -bottom-1 -right-1 h-6 w-6 cursor-se-resize rounded-full border-2 border-slate-900 bg-blue-500 hover:bg-blue-400 shadow-lg flex items-center justify-center"
                title="Drag to resize"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"/>
                </svg>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-1 text-center">
              Preview (actual: {width} × {originalDimensions.width > 0 ? Math.round(width / (originalDimensions.width / originalDimensions.height)) : '...'}px)
            </div>
          </div>
        )}
        
        <div className="my-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Width (px): <span className="font-bold text-blue-400">{width}</span>
              {originalDimensions.width > 0 && (
                <span className="text-xs text-slate-400 ml-2">
                  Height: {Math.round(width / (originalDimensions.width / originalDimensions.height))}px
                </span>
              )}
            </label>
            <input 
              type="range" 
              min="200" 
              max="2000" 
              step="25" 
              value={width} 
              onChange={(e) => setWidth(Number(e.target.value))} 
              className="h-2 w-full cursor-pointer rounded-lg bg-slate-600" 
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>200px</span>
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
              <span>2000px</span>
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Quality: <span className="font-bold text-blue-400">{quality}</span>
              <span className="text-xs text-slate-400 ml-2">({getEstimatedSize()})</span>
            </label>
            <input 
              type="range" 
              step="0.05" 
              min="0.1" 
              max="1" 
              value={quality} 
              onChange={(e) => setQuality(Number(e.target.value))} 
              className="h-2 w-full cursor-pointer rounded-lg bg-slate-600" 
            />
            {file.type === 'image/png' && quality < 1 && (
              <p className="text-xs text-yellow-400 mt-1">
                PNG will be converted to JPEG for compression
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="rounded-lg bg-slate-600 px-4 py-2 transition-colors hover:bg-slate-500"
          >
            Cancel
          </button>
          <button 
            onClick={handleApply} 
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {width === originalDimensions.width && quality === 1 ? 'Use Original' : 'Apply & Upload'}
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
      try {
        root.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      } catch (err) {
        console.warn('Cleanup error:', err);
      }
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
    try {
      const originalFile = await this.loader.file;
      
      // Validate file type
      if (!originalFile.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      
      // Validate file size (e.g., max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (originalFile.size > maxSize) {
        throw new Error('File size too large. Maximum 10MB allowed.');
      }
      
      // Show resize modal and get processed file
      const processedFile = await processImageWithModal(originalFile);
      
      // Upload to backend
      const formData = new FormData();
      formData.append('image', processedFile);
      
      const response = await axios.post(`${API_BASE_URL}/api/projects/editor-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });
      
      if (!response.data || !response.data.url) {
        throw new Error('Invalid response from server');
      }
      
      return {
        default: response.data.url
      };
      
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('cancelled')) {
        throw new Error('Upload cancelled');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout. Please try again.');
      } else if (error.response?.status === 413) {
        throw new Error('File too large for server');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw error;
    }
  }

  abort() {
    // Cleanup if needed
    console.log('Upload aborted');
  }
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
        setError('');
        
        const { data } = await axios.get(`${API_BASE_URL}/api/projects/${id}`, {
          timeout: 10000, // 10 seconds timeout
        });
        
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCurrentThumbnail(data.thumbnailUrl || '');
      } catch (err) {
        const errorMessage = err.response?.status === 404 
          ? 'Project not found.' 
          : 'Could not load project data.';
        setError(errorMessage);
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProject();
    } else {
      setError('Invalid project ID');
      setLoading(false);
    }
  }, [id]);

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    
    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB for thumbnails
    if (file.size > maxSize) {
      setError('Thumbnail file size should be less than 5MB.');
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailImage(reader.result);
        setThumbnailPreview(reader.result);
        setError(''); // Clear any previous errors
      };
      reader.onerror = () => {
        setError('Failed to read the selected file.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error processing thumbnail image.');
      console.error('Error reading file:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    
    if (!description.trim()) {
      setError('Project description is required.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const payload = {
        title: title.trim(),
        description,
        ...(thumbnailImage && { thumbnailImage }),
      };
      
      await axios.put(`${API_BASE_URL}/api/projects/${id}`, payload, {
        timeout: 30000, // 30 seconds timeout
      });
      
      setSuccess('Project updated successfully! Redirecting...');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      let errorMessage = 'Failed to update project.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.response?.status === 413) {
        errorMessage = 'Data too large. Please reduce image sizes.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      console.error('Error updating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Edit Project</h2>
        <button
          onClick={() => navigate('/admin')}
          className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          ← Back to Admin
        </button>
      </div>
      
      {error && (
        <div className="mb-4 rounded-lg bg-rose-100 p-4 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 rounded-lg bg-emerald-100 p-4 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
          <strong>Success:</strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-lg font-medium text-slate-700 dark:text-slate-300">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
            required
            maxLength={200}
          />
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {title.length}/200 characters
          </p>
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
            className="w-full text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-300 dark:file:bg-slate-800/70 dark:file:text-slate-200 dark:hover:file:bg-slate-700"
          />
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Maximum file size: 5MB. Supported formats: JPG, PNG, WebP
          </p>
          
          {(thumbnailPreview || currentThumbnail) && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                {thumbnailPreview ? 'New' : 'Current'} Thumbnail:
              </p>
              <img 
                src={thumbnailPreview || currentThumbnail} 
                alt="Thumbnail preview" 
                className="max-h-48 max-w-xs rounded-lg border bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 object-cover" 
                onError={(e) => {
                  e.target.src = '/placeholder-image.png'; // Add a placeholder image
                  console.error('Failed to load thumbnail image');
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-lg font-medium text-slate-700 dark:text-slate-300">
            Full Description *
          </label>
          <div className="editor-container border rounded-lg overflow-hidden dark:border-slate-700">
            <CKEditor
              editor={ClassicEditor}
              data={description}
              config={{
                extraPlugins: [MyCustomUploadAdapterPlugin],
                toolbar: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  '|',
                  'outdent',
                  'indent',
                  '|',
                  'imageUpload',
                  'blockQuote',
                  'insertTable',
                  'mediaEmbed',
                  '|',
                  'undo',
                  'redo'
                ],
                image: {
                  toolbar: [
                    'imageStyle:inline',
                    'imageStyle:block',
                    'imageStyle:side',
                    '|',
                    'toggleImageCaption',
                    'imageTextAlternative'
                  ],
                  // Prevent CKEditor from resizing images
                  resizeOptions: [
                    {
                      name: 'resizeImage:original',
                      value: null,
                      label: 'Original'
                    }
                  ]
                },
                table: {
                  contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                    'tableCellProperties',
                    'tableProperties'
                  ]
                },
                mediaEmbed: {
                  previewsInData: true
                }
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data);
              }}
              onError={(error, { willEditorRestart }) => {
                console.error('CKEditor error:', error);
                if (!willEditorRestart) {
                  setError('Editor error occurred. Please refresh the page.');
                }
              }}
            />
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            You can paste images directly into the editor or use the image upload button.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-lg font-semibold text-white shadow transition-all hover:shadow-lg hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin')}
            disabled={isSubmitting}
            className="px-6 py-3 text-lg font-semibold text-slate-600 border border-slate-300 rounded-full hover:bg-slate-50 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
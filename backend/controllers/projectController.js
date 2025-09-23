import mongoose from 'mongoose';
import Project from '../models/projectModel.js';
import cloudinary from '../config/cloudinary.js';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

/**
 * @desc    Upload image for CKEditor
 * @route   POST /api/projects/editor-upload
 * @access  Public (or Private, if you add auth middleware)
 */
export const uploadEditorImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert buffer to base64
    const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'portfolio_editor_images',
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    res.status(200).json({ 
      url: result.secure_url,
      public_id: result.public_id 
    });

  } catch (error) {
    console.error('Error uploading editor image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

/**
 * @desc    Get a signature for direct Cloudinary uploads
 * @route   GET /api/projects/sign-upload
 * @access  Public (or Private, if you add auth middleware)
 */
export const getSignUpload = (req, res) => {
  const timestamp = Math.round((new Date).getTime()/1000);
  
  try {
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'portfolio_uploads' // Optional: pre-define a folder for all uploads
    }, process.env.CLOUDINARY_API_SECRET);

    res.status(200).json({ 
      signature, 
      timestamp,
      cloudname: process.env.CLOUDINARY_CLOUD_NAME,
      apikey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Error signing upload:', error);
    res.status(500).json({ message: 'Could not sign upload request.' });
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (requires auth)
 */
export const createProject = async (req, res) => {
  // Now expects `thumbnailUrl` from the frontend, not a file
  const { title, description, thumbnailUrl } = req.body;

  if (!title || !description || !thumbnailUrl) {
    return res.status(400).json({ message: 'Title, description, and thumbnailUrl are required.' });
  }

  try {
    // Sanitize and create a short description
    const cleanDescription = DOMPurify.sanitize(description, { ALLOWED_TAGS: [] });
    const shortDescription = cleanDescription.substring(0, 150) + '...';

    const project = new Project({
      title,
      description,
      shortDescription,
      thumbnailUrl, // Use the URL directly from the request body
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(400).json({ message: 'Error creating project' });
  }
};

/**
 * @desc    Update an existing project
 * @route   PUT /api/projects/:id
 * @access  Private (requires auth)
 */
export const updateProject = async (req, res) => {
  const { title, description, thumbnailUrl } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update fields only if they are provided in the request
    project.title = title || project.title;
    project.description = description || project.description;
    project.thumbnailUrl = thumbnailUrl || project.thumbnailUrl;
    
    // Regenerate the short description if the main description changed
    if (description) {
      const cleanDescription = DOMPurify.sanitize(project.description, { ALLOWED_TAGS: [] });
      project.shortDescription = cleanDescription.substring(0, 150) + '...';
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(400).json({ message: 'Error updating project' });
  }
};

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get only featured projects
 * @route   GET /api/projects/featured
 * @access  Public
 */
export const getFeaturedProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(5);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Project not found' });
  }
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (requires auth)
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      // Optional: Delete the image from Cloudinary here before deleting the project document
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Toggle a project's featured status
 * @route   PUT /api/projects/:id/toggle-featured
 * @access  Private (requires auth)
 */
export const toggleFeaturedStatus = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if(project) {
            project.isFeatured = !project.isFeatured;
            await project.save();
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error toggling featured status' });
    }
}
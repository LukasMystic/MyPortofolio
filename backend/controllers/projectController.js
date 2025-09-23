import mongoose from 'mongoose';
import Project from '../models/projectModel.js';
import cloudinary from '../config/cloudinary.js';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

// Get all projects, sorted by creation date
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// New: Get only featured projects
export const getFeaturedProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(5);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// New: Toggle a project's featured status
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

// ... (existing functions for getProjectById, create, update, delete, uploadEditorImage)
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

export const createProject = async (req, res) => {
  const { title, description, thumbnailImage } = req.body;
  try {
    const uploadedThumbnail = await cloudinary.uploader.upload(thumbnailImage, {
      folder: 'portfolio_thumbnails',
      transformation: [{ width: 800, crop: 'limit' }],
    });
    const cleanDescription = DOMPurify.sanitize(description, { ALLOWED_TAGS: [] });
    const shortDescription = cleanDescription.substring(0, 150) + '...';

    const project = new Project({
      title,
      description,
      shortDescription,
      thumbnailUrl: uploadedThumbnail.secure_url,
    });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(400).json({ message: 'Error creating project' });
  }
};

export const updateProject = async (req, res) => {
  const { title, description, thumbnailImage } = req.body;
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (thumbnailImage) {
      const uploadedThumbnail = await cloudinary.uploader.upload(thumbnailImage, {
        folder: 'portfolio_thumbnails',
        transformation: [{ width: 800, crop: 'limit' }],
      });
      project.thumbnailUrl = uploadedThumbnail.secure_url;
    }

    project.title = title || project.title;
    project.description = description || project.description;
    
    const cleanDescription = DOMPurify.sanitize(project.description, { ALLOWED_TAGS: [] });
    project.shortDescription = cleanDescription.substring(0, 150) + '...';

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(400).json({ message: 'Error updating project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
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

export const uploadEditorImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: 'portfolio_projects',
    });
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error in uploadEditorImage:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};


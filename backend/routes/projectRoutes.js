import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadEditorImage,
  getFeaturedProjects,
  toggleFeaturedStatus
} from '../controllers/projectController.js';

const router = express.Router();

router.route('/').get(getProjects).post(createProject);
router.route('/featured').get(getFeaturedProjects); // New route for featured projects

router
  .route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/toggle-featured').put(toggleFeaturedStatus); // New route to feature a project
router.route('/editor-upload').post(uploadEditorImage);

export default router;


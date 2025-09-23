// projectRoutes.js

import express from 'express';
import multer from 'multer';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  toggleFeaturedStatus,
  getSignUpload,
  uploadEditorImage, // <-- Import the new function
} from '../controllers/projectController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// --- [NEW] Route to handle editor image uploads ---
router.route('/editor-upload').post(upload.single('image'), uploadEditorImage);

// --- [EXISTING] Route to get the signature ---
router.route('/sign-upload').get(getSignUpload);

router.route('/').get(getProjects).post(createProject);
router.route('/featured').get(getFeaturedProjects);

router
  .route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/toggle-featured').put(toggleFeaturedStatus);

export default router;
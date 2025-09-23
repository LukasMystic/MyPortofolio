import express from 'express';
import {
  getCvData, updateCvData, updateProfilePicture,
  addEducation, updateEducation, deleteEducation,
  addExperience, updateExperience, deleteExperience,
  addSkillCategory, addSkillToCategory, deleteSkillFromCategory,
  addCertification, updateCertification, deleteCertification,
} from '../controllers/cvController.js';

const router = express.Router();

// Main CV details
router.route('/').get(getCvData).put(updateCvData);
router.route('/profile-picture').put(updateProfilePicture); // Added route for profile picture

// Education routes
router.route('/education').post(addEducation);
router.route('/education/:id').put(updateEducation).delete(deleteEducation);

// Experience routes
router.route('/experiences').post(addExperience);
router.route('/experiences/:id').put(updateExperience).delete(deleteExperience);

// Skill routes
router.route('/skills/category').post(addSkillCategory); // Added route for new categories
router.route('/skills/:id').post(addSkillToCategory);
router.route('/skills/:categoryId/:itemIndex').delete(deleteSkillFromCategory);

// Certification routes
router.route('/certifications').post(addCertification);
router.route('/certifications/:id').put(updateCertification).delete(deleteCertification);

export default router;


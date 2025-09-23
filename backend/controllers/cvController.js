import CV from '../models/cvModel.js';
import cloudinary from '../config/cloudinary.js';

// --- General CV Data ---
export const getCvData = async (req, res) => {
  try {
    const cvData = await CV.findOne();
    if (!cvData) return res.status(404).json({ message: 'CV data not found.' });
    res.json(cvData);
  } catch (error) { res.status(500).json({ message: 'Server Error', error }); }
};

export const updateCvData = async (req, res) => {
    const { fullName, email, phone, linkedIn, github, aboutMe } = req.body;
    try {
        const cvData = await CV.findOneAndUpdate({}, 
            { fullName, email, phone, linkedIn, github, aboutMe }, 
            { new: true, upsert: true, runValidators: true }
        );
        res.json(cvData);
    } catch (error) { res.status(400).json({ message: 'Error updating CV data', error }); }
};

// --- Profile Picture ---
export const updateProfilePicture = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image, {
            folder: 'portfolio_profile',
            transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
        });
        const cv = await CV.findOneAndUpdate({}, { profilePictureUrl: result.secure_url }, { new: true, upsert: true });
        res.json(cv);
    } catch(error) {
        res.status(400).json({ message: 'Error updating profile picture', error });
    }
};

// --- Education CRUD (No Changes) ---
export const addEducation = async (req, res) => {
    try {
        const cv = await CV.findOne();
        cv.education.unshift(req.body);
        await cv.save();
        res.status(201).json(cv.education[0]);
    } catch (error) { res.status(400).json({ message: 'Error adding education', error }); }
};
export const updateEducation = async (req, res) => {
    try {
        const cv = await CV.findOne();
        const educationItem = cv.education.id(req.params.id);
        if (!educationItem) return res.status(404).json({ message: 'Education item not found' });
        educationItem.set(req.body);
        await cv.save();
        res.json(educationItem);
    } catch (error) { res.status(400).json({ message: 'Error updating education', error }); }
};
export const deleteEducation = async (req, res) => {
    try {
        const cv = await CV.findOne();
        cv.education.id(req.params.id).deleteOne();
        await cv.save();
        res.json({ message: 'Education item removed' });
    } catch (error) { res.status(400).json({ message: 'Error deleting education', error }); }
};

// --- Experience CRUD (No Changes) ---
export const addExperience = async (req, res) => {
    try {
        const cv = await CV.findOne();
        cv.experiences.unshift(req.body);
        await cv.save();
        res.status(201).json(cv.experiences[0]);
    } catch (error) { res.status(400).json({ message: 'Error adding experience', error }); }
};
export const updateExperience = async (req, res) => {
    try {
        const cv = await CV.findOne();
        const experience = cv.experiences.id(req.params.id);
        if (!experience) return res.status(404).json({ message: 'Experience not found' });
        experience.set(req.body);
        await cv.save();
        res.json(experience);
    } catch (error) { res.status(400).json({ message: 'Error updating experience', error }); }
};
export const deleteExperience = async (req, res) => {
    try {
        const cv = await CV.findOne();
        cv.experiences.id(req.params.id).deleteOne();
        await cv.save();
        res.json({ message: 'Experience removed' });
    } catch (error) { res.status(400).json({ message: 'Error deleting experience', error }); }
};

// --- Skill CRUD (Added addSkillCategory) ---
export const addSkillCategory = async (req, res) => {
    try {
        const cv = await CV.findOne();
        // Check if category already exists
        const existingCategory = cv.skills.find(cat => cat.category.toLowerCase() === req.body.category.toLowerCase());
        if (existingCategory) {
            return res.status(400).json({ message: 'Skill category already exists' });
        }
        cv.skills.push({ category: req.body.category, items: [] });
        await cv.save();
        res.status(201).json(cv.skills[cv.skills.length - 1]);
    } catch (error) { res.status(400).json({ message: 'Error adding skill category', error }); }
};
export const addSkillToCategory = async (req, res) => {
    try {
        const cv = await CV.findOne();
        const category = cv.skills.id(req.params.id);
        if (!category) return res.status(404).json({ message: 'Skill category not found' });
        category.items.push(req.body.item);
        await cv.save();
        res.status(201).json(category);
    } catch (error) { res.status(400).json({ message: 'Error adding skill', error }); }
};
export const deleteSkillFromCategory = async (req, res) => {
    const { categoryId, itemIndex } = req.params;
    try {
        const cv = await CV.findOne();
        const category = cv.skills.id(categoryId);
        if (category && category.items[itemIndex]) {
            category.items.splice(itemIndex, 1);
            await cv.save();
            res.json({ message: 'Skill removed' });
        } else { res.status(404).json({ message: 'Skill not found' }); }
    } catch (error) { res.status(400).json({ message: 'Error deleting skill', error }); }
};

// --- Certification CRUD (No Changes) ---
export const addCertification = async (req, res) => {
    try {
        const cv = await CV.findOne();
        cv.certifications.unshift(req.body);
        await cv.save();
        res.status(201).json(cv.certifications[0]);
    } catch (error) { res.status(400).json({ message: 'Error adding certification', error }); }
};
export const updateCertification = async (req, res) => {
    try {
        const cv = await CV.findOne();
        const certification = cv.certifications.id(req.params.id);
        if (!certification) return res.status(404).json({ message: 'Certification not found' });
        certification.set(req.body);
        await cv.save();
        res.json(certification);
    } catch (error) { res.status(400).json({ message: 'Error updating certification', error }); }
};
export const deleteCertification = async (req, res) => {
    try {
        const cv = await CV.findOne();
        cv.certifications.id(req.params.id).deleteOne();
        await cv.save();
        res.json({ message: 'Certification removed' });
    } catch (error) { res.status(400).json({ message: 'Error deleting certification', error }); }
};


import mongoose from 'mongoose';

// A sub-schema for educational history
const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  dateRange: { type: String, required: true },
});

// A sub-schema for any kind of experience (work, volunteer, etc.)
const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  dateRange: { type: String, required: true },
  responsibilities: [{ type: String }],
  type: {
    type: String,
    required: true,
    enum: ['Work', 'Organization', 'Volunteer'],
  },
});

// A sub-schema for skills
const SkillSchema = new mongoose.Schema({
    category: { type: String, required: true },
    items: [{ type: String }]
});

// A sub-schema for certifications
const CertificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    url: { type: String }
});

// The main CV schema that brings everything together
const CvSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  linkedIn: { type: String },
  github: { type: String },
  aboutMe: { type: String, required: true },
  profilePictureUrl: { type: String, default: 'https://placehold.co/400x400/e2e8f0/CBD5E0?text=No+Image' }, // Added for profile picture
  education: [EducationSchema],
  experiences: [ExperienceSchema],
  skills: [SkillSchema],
  certifications: [CertificationSchema],
}, { timestamps: true });

const CV = mongoose.model('CV', CvSchema);

export default CV;


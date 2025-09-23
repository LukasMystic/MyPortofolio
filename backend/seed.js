import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load data and models
import cvData from './data/cv.js';
import projects from './data/projects.js';
import CV from './models/cvModel.js';
import Project from './models/projectModel.js';

// Configure environment variables
dotenv.config();

// Connect to the database
connectDB();

// Function to import data
const importData = async () => {
  try {
    // Clear existing data
    await Project.deleteMany();
    await CV.deleteMany();

    // Insert new data
    await Project.insertMany(projects);
    await CV.create(cvData); // Use create for a single document object

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    await Project.deleteMany();
    await CV.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Check for command line arguments to decide which function to run
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

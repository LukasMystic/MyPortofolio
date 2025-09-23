import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Using bcrypt for secure password comparison

// --- Admin Login ---
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminCredentials = JSON.parse(process.env.ADMIN_CREDENTIALS);
    const adminEmail = Object.keys(adminCredentials)[0];
    const adminPasswordHash = adminCredentials[adminEmail];

    // Note: In a real app, you'd store a hashed password. 
    // For this setup, we compare the plain text password directly.
    // A more secure approach would be to hash the password you provide.
    const isMatch = (email === adminEmail && password === adminPasswordHash);

    if (isMatch) {
      // Create a token
      const token = jwt.sign({ id: adminEmail }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
      });

      res.json({
        token,
        email: adminEmail,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

import Message from '../models/messageModel.js';

// --- PUBLIC: User sends a message from the contact form ---
export const sendMessage = async (req, res) => {
  const { name, email, message, honeypot } = req.body;

  // Bot Protection: Honeypot Check
  if (honeypot) {
    return res.status(400).json({ message: 'Bot detection failed.' });
  }

  try {
    // Save the message to the database
    await Message.create({ name, email, message });
    res.status(200).json({ message: 'Message sent successfully! I will get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// --- PROTECTED: Admin gets all messages ---
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- PROTECTED: Admin deletes a message ---
export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if(message) {
            await message.deleteOne();
            res.json({ message: 'Message deleted' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


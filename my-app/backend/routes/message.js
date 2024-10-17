import express from 'express'
import Message  from '../models/Message.js'

const router = express.Router();

// POST endpoint that saves message
router.post('/', async (req, res) => {
    const { roomId, author, content, date } = req.body;
    console.log({ roomId, author, content, date })
    const newMessage = new Message({
        roomId,
        author,
        content,
        date
    });
    console.log('newMessage: ' + newMessage);
    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "A problem occurred while saving this message"});
    }
});

// GET endpoint to retrieve all messages for a room
router.get('/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await Message.find({ roomId }).sort({ time: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "A problem occurred while retrieving messages" });
    }
});

// DELETE endpoint to remove all messages for a room
router.delete('/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
        const result = await Message.deleteMany({ roomId });
        res.status(200).json({ message: "All messages deleted successfully", deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting messages:', error);
        res.status(500).json({ error: "A problem occurred while deleting messages" });
    }
});

export default router;
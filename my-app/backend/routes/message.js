import express from 'express'
import Message  from '../models/Message.js'

const router = express.Router();

// POST endpoint that saves message
router.post('/', async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        await newMessage.save();
        console.log('newMessage: ' + newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "A problem occurred while saving this message"});
    }
});

// POST endpoint that marks messages as read
router.post('/read', async (req, res) => {
    const { roomId } = req.body;
    try {
        const messages = await Message.find({ roomId });
        console.log(messages);
        const updatedMessages = await Promise.all(messages.map(async (message) => {
            message.read = true;
            return message.save();
        }));
        res.status(200).send({ message: 'Messages updated successfully', count: updatedMessages.length });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'A problem occurred while marking messages as read' });
    }
});

// GET endpoint to retrieve all messages for a room
router.get('/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await Message.find({ roomId }).sort({ date: 1 });
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
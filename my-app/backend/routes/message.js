import express from 'express'
import { Message } from '../models/Message.js'

const router = express.Router();

// POST endpoint that saves messages
router.post('/message', async (req, res) => {
    const { roomId, author, content, time } = req.body;

    const newMessage = new Message({
        roomId,
        author,
        content,
        time
    });

    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "A problem occurred while saving this message"});
    }
});

export default router;
import express from 'express';
import User from '../models/User.js';

export const getMe = async (req, res) => {
    const id = req.session.userId;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const createUser = async ({ username, password, fullName, email }) => {
    const newUser = new User({
        username,
        password,
        fullName,
        email
    });
    return await newUser.save();
};
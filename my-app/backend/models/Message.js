import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    time: {
        type: String,
        required: true,
    }

});

const Message = mongoose.model("Message", messageSchema);
export default Message;
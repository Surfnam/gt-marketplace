import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },

    author: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    content: {
        type: String,
    },
    
    file: {
        name: {
            type : String,
        },
        url: {
            type : String,
        }
    },

    date: {
        type: Date,
        required: true,
    },

    read: {
        type: Boolean,
        required: true,
    }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
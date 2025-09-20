const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema( {
    role: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
})
const ConversationSchema = new mongoose.Schema({
    sessionId : String,
    messages : [MessageSchema]
})
Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;

// export {MessageSchema} 
const { ChatGroq } = require("@langchain/groq");
const { ConversationChain } = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");
// const { MongoDBChatMessageHistory } = require("langchain/stores/message/mongodb");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
module.exports.llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    // openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7
  });
// module.exports.makeChain = function(userId) {
//   const collection = mongoose.connection.collection("conversations");

//   const chatHistory = new MongoDBChatMessageHistory({
//     collection,
//     sessionId: userId
//   });

//   const memory = new BufferMemory({
//     chatHistory,
//     returnMessages: true,
//     memoryKey: "history"
//   });

 

//   return new ConversationChain({ llm, memory });
// }
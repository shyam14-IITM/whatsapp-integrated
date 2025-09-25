const { ChatGroq } = require("@langchain/groq");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
module.exports.llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7
  });


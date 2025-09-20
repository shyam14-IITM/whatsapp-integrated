const express = require("express");
const mongoose = require("mongoose");
const llm = require("./chain.js").llm;
const axios = require("axios");
const Conversation = require("./models/conversations.js");
const twilio = require("twilio");
const captionImage = require("./vision.js");
const MessagingResponse = twilio.twiml.MessagingResponse;
// import { Conversation } from './models/conversations.js';
const bodyParser = require("body-parser");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

async function downloadMedia(url) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    auth: {
      username: process.env.TWILIO_ACCOUNT_SID,
      password: process.env.TWILIO_AUTH_TOKEN,
    },
  });
  return response.data; // Buffer
}
 const personas = ['motivational_speaker', 'tech_tutor', 'rude', 'comedian'];
const setPersona = (mseg)=>{
    mseg = mseg.trim().toLowerCase()
    if (personas.includes(mseg)) return mseg;
    return null;
}

app.post("/webhook", async (req, res) => {
  const twiml = new MessagingResponse();
  userConvo = null;
  try {
   

    const from = req.body.From;
    const body = req.body.Body;
    const mediaType = req.body.MediaContentType0;
    const numMedia = parseInt(req.body.NumMedia || "0", 10);
    let reply = "";
    let userConvo = null;
    if (numMedia > 0 && mediaType.startsWith("image/")) {
      const mediaUrl = req.body.MediaUrl0;
      console.log("Media URL:", mediaUrl);
      reply = await captionImage(mediaUrl);
      console.log("Caption:", reply);
      // twiml.message(response);
      // res.writeHead(200, {'Content-Type': 'text/xml'});
      // res.end(twiml.toString());
      // return;
    }
    // const from = body = "dummy"
    
    else {
      const newUserMseg = {
        role: "user",
        content: body,
      };
      let prompt = {
        role: "system",
        content:
          `You are a helpful whatsapp chatbot and that gives replies of less than 100 words`,
      };
      if(!setPersona(body)){
          prompt.content =
          `You are a helpful whatsapp chatbot with persona : ${setPersona(body)} that gives replies of less than 100 words`;
        }

      userConvo = await Conversation.findOne({ sessionId: from });
      if (!userConvo) {
        
        userConvo = await Conversation.create({
          sessionId: from,
          messages: [prompt, newUserMseg],
        });
      } else {
        userConvo.messages.push(newUserMseg);
        await userConvo.save();
      }
      const last11turns = [];
      if (userConvo.messages.length <= 22) {
        last11turns.push(...userConvo.messages);
      } else last11turns.push(...userConvo.messages.slice(-22));
      
      console.log("last11", last11turns);
      const toLLM = last11turns.map((msg) => {
        return { role: msg.role, content: msg.content };
      });
      if (!setPersona(body)) toLLM.push(prompt);
      console.log("toLLM", toLLM);
      const response = await llm.invoke(toLLM);

      if (reply === "") reply = setPersona(body) ? `Persona set to ${setPersona(body)} ` : response.content;
    }

    console.log(reply);
    twiml.message(reply);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString()); //--------------------hh=-------
    const newAIRes = {
      role: "assistant",
      content: reply,
    };
    userConvo.messages.push(newAIRes);
    await userConvo.save();
    console.log("Done");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

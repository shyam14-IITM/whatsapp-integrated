const { ChatOpenAI } =  require("@langchain/openai")
require('dotenv').config();
const { v2  } = require("cloudinary");

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});




const visionLLM = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});
const captionImage = async (imageUrl)=>{
    const res = await visionLLM.invoke([
        {
            role: "user",
            content:[
                {type: "text", text: "Describe the image in less than 70 words"},
                {type: "image_url", image_url: {url: imageUrl}},
            ]
        }
    ]);
    return res.content;
}
module.exports = captionImage;

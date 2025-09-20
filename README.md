

https://github.com/user-attachments/assets/e045e48d-efd4-4964-adea-7e625b7f81a8

Project
- Express Backend
- Mongo - for storing messages
- twilio for whatsapp integration
- grop ai model from Langchain

- user sends message to the twilio provided no. (bot)
- twilio hits the the backend with the user message(first time)
-    mongo doc created for the user
-    for subsequent messages , the past 10-11 messages are fetched from the db to save the context
-    array of messages are passed to the aiModel through .invoke function
-    the reply through TwiML is sent back to the user on whatsapp

-    image caption feature
       - incomplete as of now
       - cloudinary and keys from twilio needed to access the secured image url
       - extract image url and provide it to AIModel using cloudinary


const OpenAI = require('openai');
const Story = require('../models/storys');
const axios = require('axios');
var randomString = require("randomstring");
require('dotenv').config()


//chatGPT
const openai = new OpenAI({
    apiKey: process.env.Open_AI_API,// defaults to process.env["OPENAI_API_KEY"]
 });
async function getStory(prompt) {
    try{ 
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
    
      console.log(completion.choices[0]);
      return completion.choices[0];
    }
    catch(err){
      res.status(500).json(err)
    }
}
//PAPAGO
async function getTranslate(text) {
  const client_id = process.env.Client_ID; 
  const client_secret = process.env.Client_Secret;

  const data = {
    text: text,
    source: 'ko',
    target: 'en'
  };

  const url = "https://openapi.naver.com/v1/papago/n2mt";

  const headers = {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret
  };
  try {
      const response = await axios.post(url, data, { headers });
      
      if (response.status === 200) {
        const send_data = response.data;
        const trans_data = send_data.message.result.translatedText;
        return trans_data;
      } else {
        console.error("Error Code:", response.status);
        return response.status
      }
    } catch (error) {
      console.error("Error:", error);
      return null
    }
}
//스토리 생성
module.exports.prompt = async (req, res) => {
    const {name, sex, age, personality, name2, subject} = req.body;
    try {
      console.log("response :",name, sex, age, personality, name2, subject);
      
      //PAPAGO K -> E

      //words = getTranslate(name)

      //gpt에게 prompt전송

      //content = await getStory("say hi");
      
      //모델 생성
      const newStory = new Story({
        id: randomString.generate(12),
        title: name,
        content: sex,
      })
      try{
        await newStory.save();
        console.log("Story Create success")
      res.status(200).json({ message: "성공적으로 이야기가 완성되었습니다." })
      }
      catch(err){
        console.log(err)
        return res.status(500).json({ message:'Create sever error'})
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'server error' });
    }
};

//이야기 list조회
module.exports.list = async (req, res) => {
    try{
      const storys = await Story.find();
      console.log(storys);
      return res.status(200).json({storys})
    }catch(err){
      res.status(500).json({ message: 'List Server Error' });
    }
}
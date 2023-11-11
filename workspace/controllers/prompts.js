const OpenAI = require('openai');
require('dotenv').config()

const openai = new OpenAI({
    apiKey: process.env.Open_AI_API,// defaults to process.env["OPENAI_API_KEY"]
 });
async function getStory(prom) {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prom }],
      model: 'gpt-3.5-turbo',
    });
  
    console.log(completion.choices[0]);
    return completion.choices[0]
}

module.exports.prompt = async (req, res) => {
    const {name, sex, age, personality, name2, subject} = req.body;

    try {
      console.log(name, sex, age, personality, name2, subject);
      res.status(200).json({ message: 'Success!' })
    } catch (err) {
      res.status(500).json({ error: 'server error' });
    }
};
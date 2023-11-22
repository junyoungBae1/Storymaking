const OpenAI = require('openai');

require('dotenv').config()

//chatGPT
const openai = new OpenAI({
    apiKey: process.env.Open_AI_API,// defaults to process.env["OPENAI_API_KEY"]
 });
async function getStory(name, sex, age, personality, name2, subject) {
    try{ 
        prompts = `Please write a story for Changsub. The main character's name is Changsub and he is a 6-year-old man. The main character's job is a firefighter. I make sure he's friendly and talkative. His friend is Junyoung. I want to make an animated storybook for this story, and I want to use images to make that book. Can you suggest a description of the title of the story, the image for each scene, the story for that scene, and the background music for each scene? I want the story to consist of a total of 16 pages, and each page should consist of at least 3 sentences. this is an English children's book for children, and please translate it easily for Korean children to understand.`
        console.log("이야기 만드는 중입니다...")
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompts }],
            model: 'gpt-3.5-turbo',
      });
      console.log(completion.choices[0]);
      return completion.choices[0];
    }catch(err){
      console.log("story 생성 문제 -gpt 3.5",err)
    }
}
async function getTranslate(story) {
    try{ 
        console.log("생성된 영어 story",story)
        prompts = `${story}\n this is an English children's book for children, and please translate it easily for Korean children to understand.`
        console.log("이야기 번역중입니다.")
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompts }],
            model: 'gpt-3.5-turbo',
      });
      console.log(completion.choices[0]);
      return completion.choices[0];
    }catch(err){
      console.log("이야기 번역 문제 -gpt 3.5")
    }
}
module.exports ={
    getStory,
    getTranslate
}
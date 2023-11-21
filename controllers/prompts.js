const Story = require('../models/storys');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
const stream = require('stream');
const Translate = require('../controllers/translate.js')
const GPT = require('../controllers/gpt.js')

//LEonardo api
const api_key = process.env.Leonardo_API;
const authorization = `Bearer ${api_key}`;
const headers = {
  "accept": "application/json",
  "content-type": "application/json",
  "authorization": authorization
}
// Leonardo 이미지 첫생성
async function generateAndFetchImage() {
  try{
    // Generate an image
    const payload = {
        "height": 512,
        "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", // model ID
        "prompt": "An oil painting of a cat",
        "width": 512
    }
    
    let res = await axios.post("https://cloud.leonardo.ai/api/rest/v1/generations", 
                              payload, 
                              { headers: headers });
    
    const generation_id = res.data.sdGenerationJob.generationId;
    console.log(generation_id)
    // Wait for a few seconds for images to be generated
    await new Promise(resolve => setTimeout(resolve, 20000));

    // Fetch the generated image
    res = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${generation_id}`, 
                          { headers: headers });

    //console.log(res.data);
    const generatedImages = res.data.generations_by_pk.generated_images;
    let imageURLs = [];
    for (let image of generatedImages) {
        imageURLs.push(image.url);
    }
    const imageUrl = imageURLs[0];
    const file = fs.createWriteStream("./image.jpg");
    https.get(imageUrl, function(response) {
      response.pipe(file);
    });
  }catch(err){
    console.log("image 첫생성 에러 ", err)
  }
}

//Leonardo 이미지 생성 using image fix 필요
async function getImage() {
  // Get a presigned URL for uploading an image
  try{
    let res = await axios.post("https://cloud.leonardo.ai/api/rest/v1/init-image", 
                              { "extension": "jpg" }, 
                              { headers: headers });
    const fields = res.data.uploadInitImage.fields;
    const url = res.data.uploadInitImage.url;
    const image_id = res.data.uploadInitImage.id;
    // Upload image via presigned URL
    files = ('file', fs.createReadStream('./image.jpg'));
    console.log(file)
    axios.post(url, data = fields, files=files)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    });
    console.log("3")
    // Generate with an image prompt
    const payload = {
      "height": 512,
      "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
      "prompt": "An Oil painting of a cat wearing a police uniform",
      "width": 512,
      "imagePrompts": [image_id]
    }
    res = await axios.post("https://cloud.leonardo.ai/api/rest/v1/generations", 
                            payload, 
                            {headers: headers});
    const generation_id = res.data.sdGenerationJob.generationId;
    // Get the generation of images
    await new Promise(resolve => setTimeout(resolve, 20000)); // wait for 20 seconds
      
    res = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${generation_id}`, 
                          { headers: headers });
    console.log("hey",res.data);
    // const generatedImages = res.data.generations_by_pk.generated_images;

    // for (let image of generatedImages) {
    //     console.log(image);
    // }
  }catch(err){
    console.log("image 생성 서버 에러")
    console.error("Response data:", err.response.data);
    console.error("Response status:", err.response.status);
    console.error("Response headers:", err.response.headers);
  }
}

//스토리 생성
module.exports.prompt = async (req, res) => {
    let {name, sex, age, personality, name2, subject} = req.body;
    try {
      console.log("response :",name, sex, age, personality, name2, subject);
      //이미지 생성
      //await generateAndFetchImage()
      //학습된 이미지로 이미지 생성
      //await getImage()
      //PAPAGO K -> E
      //name = await Translate.translateK2E(name)
      //gpt에게 prompt전송
      //let contents = await GPT.getStory(name, sex, age, personality, name2, subject);
      //PAPAGO E -> K
      //contents = await Translate.translateE2K(contents)
      //let story = await GPT.getTranslate(contents)
      
      try{
        //모델 생성
        const newStory = new Story({
          title: name,
          content: story,
        })
        await newStory.save();
        console.log("Story Create success")
        res.status(200).json({ message: "성공적으로 이야기가 완성되었습니다." })
      }
      catch(err){
        console.log(err)
        return res.status(500).json({ message:'prompt fuc Create sever error'})
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
      return res.status(200).json(storys)
    }catch(err){
      console.log(err)
      res.status(500).json({ message: 'List Server Error' });
    }
}

//이야기 특정가져오기
module.exports.story = async (req, res) => {
  try{
    const id = req.body.id
    const story = await Story.findById(id);
    if (!story) { // 해당 ID의 스토리가 없다면 404 에러를 반환합니다.
      return res.status(404).json({ message: 'Story not found' });
    }
    console.log(story);
    return res.status(200).json(story)
  }catch(err){
    console.log(err)
    res.status(500).json({ message: 'story upload DB Server Error' });
  }
}

const Story = require('../models/storys');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
const stream = require('stream');
const Translate = require('../controllers/translate.js')
const GPT = require('../controllers/gpt.js')
const admin = require('firebase-admin'); 
const path = require('path');

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
// sdk 초기화
admin.initializeApp({
  credential: admin.credential.cert(path.join(__dirname, 'Storymaking', 'fcm.json')),
  databaseURL: "https://myfbdb-aa8b7-default-rtdb.firebaseio.com"
});
//알림보내기
async function sendFCMPushNotification(androidFCMToken) {
  try {
    const message = {
      notification: {
        title: '동화 생성 완료',
        body: '동화를 생성하였습니다!'
      },
      token: androidFCMToken,
    };
    const response = await admin.messaging().send(message);
    console.log('Push notification sent to', androidFCMToken, response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const tokens = [];
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
      //이 값을 이제 뿌셔야댐
      try{
        //모델 생성
        let newStory = new Story({
          title: "지민이와 수빈이의 모험",
          representative_image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/fe978785-0d0a-45f5-84d4-daf9a830b0bc/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_j_0.jpg?w=512",
          contents: [
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/f645fd49-b41f-4471-9df2-78916bc4d573/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_S_0.jpg?w=512",
                detail: "한 날, 5살 남자 아이인 지민이와 5살 여자 아이인 수빈이는 흥미진진한 여행을 시작했습니다. 이들은 기대감과 호기심을 갖고 미지의 세계를 탐험하려 했습니다. 그들의 모험은 열린 마음과 깊은 우정으로 출발했습니다. "
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/39e1614d-37e3-4477-93c1-d6755058baef/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_1.jpg?w=512",
                detail: "먼저 만나게 된 동물은 우화와 같은 거대한 토끼였습니다. 토끼는 깊은 구멍에 빠졌던 것이었습니다. 아이들은 토끼를 다치지 않게 조심스레 끌어 올렸습니다. 그러자 토끼는 그들에게 감사의 미소를 보였습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/10c13fc6-c116-4d09-8e69-cbb103523768/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_2.jpg?w=512",
                detail: "다음으로 만난 동물은 대담한 작은 여우였습니다. 여우는 꼬리가 엉켜서 움직일 수 없었습니다. 아이들은 여우의 꼬리를 풀어 주었고, 여우는 그들에게 감사를 표현했습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/429357c6-8d56-487b-8024-df0f2f22a641/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_3.jpg?w=512",
                detail: "세 번째로 만나게 된 동물은 새로운 친구를 찾고 있던 작은 새였습니다. 아이들은 새가 무서워하는 것을 알고, 친구로서 새를 안심시켜 주었습니다. 새는 그들이 친구가 되어주었음에 감사하였습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/55aa8491-65fb-42cc-9853-4ec4337fb56e/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_1.jpg?w=512",
                detail: "다음은 귀여운 작은 다람쥐였습니다. 다람쥐는 모퉁이에 끼어서 움직이지 못하고 있었습니다. 아이들은 다람쥐를 도와서 꼬질꼬질한 공간에서 벗어나게 했습니다. 그러자 다람쥐는 아이들에게 감사하였습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/9140250a-cc5c-46ef-a579-2c8f2ad85dcf/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_2.jpg?w=512",
                detail: "마지막으로 만난 동물은 이상한 소음을 내던 뚱뚱한 고양이였습니다. 고양이는 목에 고여있던 털덩어리 때문에 편하게 말하지 못했습니다. 아이들은 고양이를 돕고 고양이는 감사의 표현을 보였습니다. "
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/f78b3437-2b06-4a1e-8487-db457892afc5/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_2.jpg?w=512",
                detail: "아이들은 당장의 위험에서 동물들을 구해주었고, 이로써 그들은 아이들의 친구가 되었습니다. 그들은 서로의 새로운 친구에게 감사하며 행복해했습니다. 그들은 자신의 여정을 계속하기로 결정했습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/f129a3a8-2ef9-4a77-8ac2-d1753cd82c0f/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_3.jpg?w=512",
                detail: "아이들과 동물들은 함께 모험을 계속했습니다. 그들은 새로운 경험들을 통해 많은 것들을 배웠고, 모든 불편함과 어려움을 극복했습니다. 그들의 우정은 더욱 깊어졌고, 그들의 모험은 더욱 흥미로워졌습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/601ae246-d470-4082-af94-f1af71dfb254/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_0.jpg?w=512",
                detail: "그들은 새로운 곳을 탐험하고, 알수없는 문제들을 함께 해결했습니다. 그들의 우정은 그들에게 힘을 주었고, 그들은 항상 서로를 도와주었습니다. 그들은 모든 장애물을 극복했고, 그들의 경험은 그들의 우정을 더욱 강하게 했습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/f78b3437-2b06-4a1e-8487-db457892afc5/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_1.jpg?w=512",
                detail: "아이들과 동물들은 함께 모험을 즐기며 서로에게 배웠습니다. 그들의 이야기는 사랑, 친구심, 용기, 그리고 희망에 관한것이었습니다. 그들의 모험은 그들에게 무엇이 중요한지 가르쳐 주었습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/70a1ea49-6d1d-452b-bfed-79c2b1becdc2/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_1.jpg?w=512",
                detail: "지민이와 수빈이는 동물 친구들을 만나고 함께 모험을 떠날 수 있어서 얼마나 행복한지 말할 수 없었습니다. 그들은 새로운 친구들을 만나고, 새로운 것들을 배우고, 새로운 장소를 발견했습니다. 이 모든것들이 그들의 순수하고 아름다운 우정을 키웠습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/3ef0fca1-c446-4f28-a7b3-a2d339d34816/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_0.jpg?w=512",
                detail: "아이들은 동물 친구들로부터 많은 것을 배웠습니다. 원래 동물들은 그들이 당장의 위험에서 구해주었기 때문에 그들에게 감사했습니다. 하지만 이제 그들은 얼마나 소중한 친구인지를 알게 되었고 그들의 모험을 더욱 흥미롭게 만들었습니다. "
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/3ef0fca1-c446-4f28-a7b3-a2d339d34816/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_3.jpg?w=512",
                detail: "아이들은 항상 서로를 이해하고 돕기 위해 최선을 다하였습니다. 그들의 친구적인 관계는 그들이 서로를 완벽하게 이해하고, 서로를 돕기 위해 힘을 합쳤음을 보여줍니다. 그들의 이야기는 진정한 친구란 어떤 것인지를 보여줍니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/351b8b90-fee0-4906-b4a4-70f5bcb867e4/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_0.jpg?w=512",
                detail: "그들이 만났던 어려움과 도전은 그들의 우정을 더욱 강하게 만들었습니다. 이들은 도전이 닥쳐올 때 항상 서로를 돕고, 함께 해결하였습니다. 그들의 유대감은 그들의 모험을 더욱 기억에 남는 것으로 만들었습니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/601ae246-d470-4082-af94-f1af71dfb254/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_2.jpg?w=512",
                detail: "그들의 모험은 그들이 서로를 더욱 잘 알게 되고, 서로에 대해 더욱 존경하게 만들었습니다. 그들은 서로를 돕기 위해 노력하였고, 그들의 이야기는 진정한 우정에 대한 아름다운 교훈을 줍니다."
              },
              {
                image: "https://cdn.leonardo.ai/users/e47e8679-3b88-47d4-8d21-549d83dc76a9/generations/70a1ea49-6d1d-452b-bfed-79c2b1becdc2/Leonardo_Vision_XL_Create_an_image_for_a_childrens_storybook_C_0.jpg?w=512",
                detail: "지민이와 수빈이, 그리고 그들의 동물 친구들의 이야기는 끝나지 않았습니다. 그들의 모험은 계속되었고, 그들은 각자의 역할을 충실히 수행하였습니다. 그들은 서로를 위해 언제나 있었고, 항상 함께 했습니다."
              },
              
          ]
      });

        await newStory.save();
        console.log("Story Create success")
        await delay(20000);
        sendFCMPushNotification(tokens.pop());
        res.status(200).json({  message: "성공적으로 이야기가 완성되었습니다.",
                                id : newStory._id,
                                title : newStory.title,
                                image : newStory.representative_image
                                })
      }
      catch(err){
        console.log(err)
        return res.status(500).json({ message:'DB Create sever error'})
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
      return res.status(200).json(storys.map(story => ({ id:story._id, title: story.title, image: story.representative_image })));
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

module.exports.fcm = async(req,res) =>{
  try{
    const { token } = req.body;
    if (!token){
      console.log('토큰 들어오지 않았습니다.',token)
      res.status(400).json({message: '토큰이 들어오지 않았습니다.'})
    }
    tokens.push(token);
    console.log("받은 토큰 :",token);
    res.status(200).json({ message: 'Token received and saved successfully' });
  }catch(err){
    console.log(err)
    res.status(500).json({message: 'token, sever error'})
  }
}



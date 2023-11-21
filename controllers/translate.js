const axios = require('axios');
require('dotenv').config()

//PAPAGO K -> E
async function translateK2E(text) {
    console.log("영어로 번역중..")
    const client_id = process.env.PAPAGO_Client_ID; 
    const client_secret = process.env.PAPAGO_Client_Secret;
  
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
          console.log("영어로 번역 완료")
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
//PAPAGO E -> K
async function translateE2K(text) {
    console.log("한글로 번역중..")
    const client_id = process.env.PAPAGO_Client_ID; 
    const client_secret = process.env.PAPAGO_Client_Secret;
  
    const data = {
      text: text,
      source: 'en',
      target: 'ko'
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
          console.log("한글로 번역 완료")
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

module.exports ={
    translateK2E,
    translateE2K
}
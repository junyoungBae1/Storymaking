const Story = require(.../models/storys);

//스토리 생성
module.exports.story = async (req, res, next) => {
    const { name, sex, age, personality, name2,subject } = req.body;

    try {
        
    
        return res.status(200).json({ message: 'Success!' });
     }  catch (err) {
        console.error(err);
        res.status(500).json({ message : 'update Server Error' });
     }
  };
const Period = require("../models/Period");

const addPeriod =async (req,res)=>{
    const {name,holidays}=req.body;
    try{
        let period=await Period.create({name: name, holidays: holidays}); 
        res.status(201).json(period);   //Created
    }catch(err){
        console.log(err)
        res.status(400).json({message:"Error creating the period"})
    }
}

const getAllPeriods=(req,res)=> {
    Period.find()
      .then((data)=>{
          res.status(200).json(data)
      })
      .catch((error)=>{
          res.status(500).json({message: "Error getting the periods"})
      });
};

module.exports={addPeriod,getAllPeriods};
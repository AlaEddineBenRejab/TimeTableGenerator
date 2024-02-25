const express= require('express');
const router=express.Router();

const {addPeriod,getAllPeriods} = require( '../controllers/periodController');


router.post('/addPeriod',addPeriod);
router.get( '/allPeriods', getAllPeriods);

module.exports=router;
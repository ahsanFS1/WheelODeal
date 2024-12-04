import express from 'express'
import {getPP,updatePP} from '../controllers/pubicPage.controller.js';


const router = express.Router();


router.get("/",getPP);

router.put('/update',updatePP);
  

export default router;
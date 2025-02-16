import express from "express";
import { addCourse } from "./controllers/courseController";
import { registerEmployee } from "./controllers/registrationController";

const router = express.Router();

router.post("/add/courseOffering",(req,res)=>{addCourse(req,res)} );
router.post("/add/register/:course_id",(req,res)=>{ registerEmployee(req,res)});

export default router;

import express from "express";
import { addCourse } from "./controllers/courseController";
import { registerEmployee } from "./controllers/registrationController";
import { allotCourse } from "./controllers/courseAllotmentController";
import { cancelCourseRegistration } from "./controllers/cancelRegController";
const router = express.Router();
console.log("hii")
router.post("/add/courseOffering",(req,res)=>{addCourse(req,res)} );
router.post("/add/register/:course_id",(req,res)=>{ registerEmployee(req,res)});
router.post("/allot/:course_id",(req,res)=>{allotCourse(req,res)} );
// Cancel course registration route
router.post("/CANCEL/:registration_id",(req,res)=>{cancelCourseRegistration(req,res)} );
export default router;

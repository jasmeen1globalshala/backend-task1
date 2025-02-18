import { Request, Response } from "express";
import fs from "fs-extra";
import {Course} from "../models/Course";
import { Registration } from "../models/Registration";
import { getCourses,getRegistrations,saveCourses,saveRegistrations} from '../utils'
const COURSES_FILE = "src/data/courses.json";
const REGISTRATIONS_FILE = "src/data/registrations.json";

// Read data
// const getCourses = async (): Promise<Course[]> => fs.readJson(COURSES_FILE).catch(() => []);
// const getRegistrations = async (): Promise<Registration[]> => fs.readJson(REGISTRATIONS_FILE).catch(() => []);

// Save data
// const saveCourses = async (courses: Course[]) => fs.writeJson(COURSES_FILE, courses);
// const saveRegistrations = async (registrations: Registration[]) => fs.writeJson(REGISTRATIONS_FILE, registrations);

// Register employee for a course
export const registerEmployee = async (req: Request, res: Response) => {
  const { employee_name, email  } = req.body;
const {course_id}=req.params;
console.log("course id is",course_id)
  if (!employee_name || !email || !course_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const courses = await getCourses();
  const registrations = await getRegistrations();
  const course = courses.find((c) => c.id === course_id);

  if (!course) {
    return res.status(400).json({ message: "Course not found" });
  }

  if (course.registered_employees.length >= course.max_employees) {
    return res.status(400).json({ message: "COURSE_FULL_ERROR" });
  }

  const registration_id =`${employee_name}-${course_id}`;
  const isDuplicate = registrations.some((reg) => reg.id === registration_id);

  if (isDuplicate) {
      return res.status(400).json({ message: "REGISTRATION_ID_ALREADY_EXISTS" });
  }
  if (course.status === "CANCELLED") {
    return res.status(400).json({ message: "COURSE_CANCELED_ERROR", error: "Registration is not allowed for a canceled course." });
}
  const newRegistration: Registration = {
    id: registration_id,
    employee_name,
    email,
    course_id,
    status: "ACCEPTED",
  };

  course.registered_employees.push(registration_id);
  registrations.push(newRegistration);

  await saveCourses(courses);
  await saveRegistrations(registrations);

  res.status(200).json({
    status: 200,
    message: `Employee registered successfully for ${course_id}`,
    data: { success: { registration_id:registration_id ,status:"ACCEPTED"} },
  });
};

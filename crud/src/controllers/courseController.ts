import { Request, Response } from "express";
import fs from "fs-extra";
import { Course } from "../models/Course";

const COURSES_FILE = "src/data/courses.json";

// Read courses data
const getCourses = async (): Promise<Course[]> => {
  return fs.readJson(COURSES_FILE).catch(() => []);
};

// Save courses data
const saveCourses = async (courses: Course[]) => {
  return fs.writeJson(COURSES_FILE, courses);
};

// Add course offering
export const addCourse = async (req: Request, res: Response) => {
  console.log("add course");
  const { course_name, instructor_name, start_date, min_employees, max_employees } = req.body;

  if (!course_name || !instructor_name || !start_date || !min_employees || !max_employees) {
    return res.status(400).json({ message: "All fields are required" });
  }
console.log(typeof(instructor_name));
  const course_id = `OFFERING-${course_name}-${instructor_name}`;
  const newCourse: Course = {
    id: course_id,
    course_name,
    instructor_name,
    start_date,
    min_employees,
    max_employees,
    registered_employees: [],
  }

  const courses = await getCourses();
  courses.push(newCourse);
  await saveCourses(courses);

  res.status(200).json({
    status: 200,
    message: "Course added successfully",
    data: { success: { course_id } },
  });
};

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
  const s_date = new Date(
    `${start_date.slice(4, 8)}-${start_date.slice(2, 4)}-${start_date.slice(0, 2)}`  // convert start date format yyyy-mm-dd
  );
  if (!course_name || !instructor_name || !start_date || !min_employees || !max_employees) {
    return res.status(400).json({
      status: 400,
      message: "INPUT_DATA_ERROR", 
      "data": {
          "success": {
              "failure":"all fields are required"
          }
      }
  
     });
  }
  if (max_employees < min_employees) {
    return res.status(400).json({
      status: 400,
      message: "INVALID_EMPLOYEE_LIMIT",
      data: { success: { failure: "Maximum employees cannot be less than minimum employees" } },
    });
  }
console.log(typeof(instructor_name));
  const course_id = `OFFERING-${course_name}-${instructor_name}`;
  const newCourse: Course = {
    id: course_id,
    course_name,
    instructor_name,
   start_date: s_date,
    min_employees,
    max_employees,
    status:"PENDING",
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

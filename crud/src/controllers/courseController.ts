import { Request, Response } from "express";
import { Course } from "../models/Course";
import { getCourses,saveCourses} from '../utils'
// Add course offering
export const addCourse = async (req: Request, res: Response) => {
 
  const { course_name, instructor_name, start_date, min_employees, max_employees } = req.body;
  
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
  const s_date = new Date(
    `${start_date.slice(4, 8)}-${start_date.slice(2, 4)}-${start_date.slice(0, 2)}`  // convert start date format yyyy-mm-dd
  );
  if (max_employees < min_employees) {
    return res.status(400).json({
      status: 400,
      message: "INVALID_EMPLOYEE_LIMIT",
      data: { success: { failure: "Maximum employees cannot be less than minimum employees" } },
    });
  }

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
   // **Check if the course ID already exists**
  const existingCourse = courses.find(course => course.id === course_id);
  if (existingCourse) {
    return res.status(400).json({
      status: 400,
      message: "COURSE_ALREADY_EXISTS",
      data: { success: { failure: "Course with the same name and instructor already exists" } },
    });
  }
  courses.push(newCourse);
  await saveCourses(courses);

  res.status(200).json({
    status: 200,
    message: "Course added successfully",
    data: { success: { course_id } },
  });
};

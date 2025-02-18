import { Request, Response } from "express";
import fs from "fs-extra";
import { Registration } from "../models/Registration";
import { Course } from "../models/Course";
import { getCourses,getRegistrations,saveCourses,saveRegistrations} from '../utils'

// Function to allot a course to registered employees
export const allotCourse = async (req: Request, res: Response) => {
  try {
    // Extract course_id from request parameters
    const { course_id } = req.params;
   
    // Fetch  registrations and courses from the files
    let registrations = await getRegistrations();
    let courses = await getCourses();
    // Find the course with the provided course_id
    let course = courses.filter((c: Course) => c.id === course_id);
    // If the course is not found, return an error response
    if (course.length == 0) {
      return res.status(400).json({
        status: 400,
        message: "Course not found",
        data: { failure: { message: "Invalid course ID" } },
      });
    }

    // Get all registered employees for this course
    //registration update

    let registeredEmployees = registrations.filter(
      (reg: Registration) => reg.course_id === course_id
    );
    // console.log(registeredEmployees.length, course[0].min_employees);
    // Check if minimum required employees are registered
    if (registeredEmployees.length < course[0].min_employees) {
       
        const newdate = new Date(course[0].start_date);
   
    // If the course start date has already passed, return an error response

    // cancelled course if course  date has passed  current date  and registered empl is less than min employee
    if (newdate < new Date()) {
        course[0].status="CANCELLED";

        courses = courses.map((crs) =>
            crs.id === course_id ? course[0] : crs
          );
          saveCourses(courses); 
      return res.status(400).json({
        status: 400,
        message:
          "Course start date has already passed. Registration is not allowed.",
      });
    }
      return res.status(200).json({
        status: 200,
        message: "Course offering cancelled due to insufficient registrations",
        data: {
          success: registeredEmployees.map((emp:Registration) => ({
            registration_id: emp.id,
            email: emp.email,
            name: emp.employee_name,
            course_name: course[0].course_name,
            course_id: course[0].id,
            status: "CANCELLED",
          })),
        },
      });
    }
    
    //file updation Update registrations: Change status to "CONFIRMED" for the allocated course

    registrations = registrations.map((reg) =>
      reg.id === course_id ? { ...reg, status: "CONFIRMED" } : reg
    );
    saveRegistrations(registrations); // Save updated registrations  back to file
    registeredEmployees = registrations.filter(
      (reg: any) => reg.course_id === course_id
    );
    // Sort registered employees alphabetically by name
    registeredEmployees.sort((a, b) =>
      a.employee_name.localeCompare(b.employee_name)
    );
    // Prepare response data with accepted employees
    const response = registeredEmployees.map((emp: any) => ({
      registration_id: emp.id,
      email: emp.email,
      course_name: course[0].course_name,
      course_id: course[0].id,
      status: "ACCEPTED",
    }));

    return res.status(200).json({
      status: 200,
      message: "Successfully allotted course to registered employees",
      data: {
        success: response,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: { failure: { message: error.message } },
    });
  }
};

import { Request, Response } from "express";
import fs from "fs-extra";
// import path from "path";
import { CourseRegistration } from "../models/cancelRegistration";
import { Registration } from "../models/Registration";
import { Course } from "../models/Course";
const REGISTRATIONS_FILE = "src/data/registrations.json";

const getRegistrations = async (): Promise<Registration[]> => fs.readJson(REGISTRATIONS_FILE).catch(() => []);
const COURSES_FILE = "src/data/courses.json";

// Read courses data
const getCourses = async (): Promise<Course[]> => {
  return fs.readJson(COURSES_FILE).catch(() => []);
};
const saveCourses = async (courses: Course[]) => {
  return fs.writeJson(COURSES_FILE, courses);
};
const saveRegistrations = async (registrations: Registration[]) => fs.writeJson(REGISTRATIONS_FILE, registrations);
// Cancel course registration logic
export const cancelCourseRegistration = async(req: Request, res: Response) => {
    const {registration_id } = req.params;
    console.log("reg id is",registration_id)
   
      let registrations=  await getRegistrations()
    const registrationIndex = registrations.findIndex(
        (reg) => reg.id === registration_id
    );

    if (registrationIndex === -1) {
        return res.status(400).json({
            status: 400,
            message: "Registration ID not found",
            data: { failure: { message: "Invalid registration ID" } },
        });
    }
  let registration=registrations[registrationIndex]
    let courses=await getCourses()
   
   
    const courseIndex = courses.findIndex((course) => course.id === registration.course_id);

    if (courseIndex === -1) {
        return res.status(400).json({
            status: 400,
            message: "Course not found",
            data: { failure: { message: "Invalid course ID" } },
        });
    }

    const course = courses[courseIndex];
    // If the course is already allotted, return CANCEL_REJECTED
    if (registration.status === "CONFIRMED") {
        return res.status(200).json({
            status: 200,
            message: "Cancel registration unsuccessful",
            data: {
                success: {
                    registration_id: registration.id,
                    course_id: registration.course_id,
                    status: "CANCEL_REJECTED",
                },
            },
        });
    }

    // If the course is active, cancel it and update status
    registrations[registrationIndex].status = "CANCELLED";
       // Remove the registration_id from the course
    course.registered_employees = course.registered_employees.filter((id:any) => id !== registration_id);
    // Update the course
    courses[courseIndex]=course
    // Save updated data
    await saveRegistrations(registrations);
    await saveCourses(courses);

    return res.status(200).json({
        status: 200,
        message: "Successfully cancelled registration",
        data: {
            success: {
                registration_id: registration.id,
                course_id: registration.course_id,
                status: "CANCEL_ACCEPTED",
            },
        },
    });
};
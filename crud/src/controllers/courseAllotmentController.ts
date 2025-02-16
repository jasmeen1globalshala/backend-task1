import { Request, Response } from "express";
import fs from "fs-extra";
import {CourseOffering } from "../models/courseAllotmentModel";
const COURSE_ALLOTMENT_FILE = "src/data/courseAllotment.json";
import { Registration } from "../models/Registration";
const REGISTRATIONS_FILE = "src/data/registrations.json";

// Read and write data functions

const getCourseAllotments = async ():Promise<CourseOffering[]> => fs.readJson(COURSE_ALLOTMENT_FILE).catch(() => []);
const getRegistrations = async ():Promise<Registration[]> => fs.readJson(REGISTRATIONS_FILE).catch(() => []);
const saveCourseAllotments = async (data: any) => fs.writeJson(COURSE_ALLOTMENT_FILE, data, { spaces: 2 });

export const allotCourse = async (req: Request, res: Response) => {
    try {
        const { course_id } = req.params;
console.log("course",course_id)
        const courseAllotments = await getCourseAllotments();
        const registrations = await getRegistrations();

        // Find course allotment
        let course = courseAllotments.find((c: any) => c.course_id === course_id);
        console.log(course);
        if (!course) {
            return res.status(400).json({
                status: 400,
                message: "Course not found",
                data: { failure: { message: "Invalid course ID" } },
            });
        }

        // Get registered employees for this course
        const registeredEmployees = registrations.filter((reg: any) => reg.course_id === course_id);

        // Check if minimum required employees are registered
        if (registeredEmployees.length < course.minEmployees) {
            return res.status(200).json({
                status: 200,
                message: "Course offering cancelled due to insufficient registrations",
                data: {
                    success: registeredEmployees.map((emp: any) => ({
                        registration_id: emp.id,
                        email: emp.email,
                        name:emp.name,
                        course_name: course.course_name,
                        course_id: course.course_id,
                        status: "CANCELLED",
                    })),
                },
            });
        }

        // Sort registered employees alphabetically by name
        registeredEmployees.sort((a: any, b: any) => a.employee_name.localeCompare(b.employee_name));

        // Store allotments
        course.registeredEmployees = registeredEmployees.map((emp: any) => ({
            // const array= registeredEmployees.map((emp: any) => ({
            registration_id: emp.id,
            email: emp.email,
            name:emp.name,
            course_name: course.course_name,
            course_id: course.course_id,
            status: "ACCEPTED",
        }));

        await saveCourseAllotments(courseAllotments);

        return res.status(200).json({
            status: 200,
            message: "Successfully allotted course to registered employees",
            data: {
                success: course.registeredEmployees,
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

import { Request, Response } from "express";
import fs from "fs";
// import path from "path";
import { CourseRegistration } from "../models/cancelRegistration";

// const dataPath = path.join(__dirname, "/src/data/cancelRegistration.json");
const dataPath =  "src/data/cancelRegistration.json";

// Load course registrations from JSON file
const loadCourseData = (): CourseRegistration[] => {
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
};

// Save course registrations to JSON file
const saveCourseData = (data: CourseRegistration[]) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
};

// Cancel course registration logic
export const cancelCourseRegistration = (req: Request, res: Response) => {
    const {registration_id } = req.params;
    console.log("reg id is",registration_id)
    let courseRegistrations = loadCourseData();

    const registrationIndex = courseRegistrations.findIndex(
        (reg) => reg.registration_id === registration_id
    );

    if (registrationIndex === -1) {
        return res.status(400).json({
            status: 400,
            message: "Registration ID not found",
            data: { failure: { message: "Invalid registration ID" } },
        });
    }

    const registration = courseRegistrations[registrationIndex];

    // If the course is already allotted, return CANCEL_REJECTED
    if (registration.status !== "ACTIVE") {
        return res.status(200).json({
            status: 200,
            message: "Cancel registration unsuccessful",
            data: {
                success: {
                    registration_id: registration.registration_id,
                    course_id: registration.course_id,
                    status: "CANCEL_REJECTED",
                },
            },
        });
    }

    // If the course is active, cancel it and update status
    registration.status = "CANCEL_ACCEPTED";
    saveCourseData(courseRegistrations);

    return res.status(200).json({
        status: 200,
        message: "Successfully cancelled registration",
        data: {
            success: {
                registration_id: registration.registration_id,
                course_id: registration.course_id,
                status: "CANCEL_ACCEPTED",
            },
        },
    });
};

import {Course} from "./models/Course";
import { Registration } from "./models/Registration";
import fs from "fs-extra";
const COURSES_FILE = "src/data/courses.json";
const REGISTRATIONS_FILE = "src/data/registrations.json";

// Read data
export const getCourses = async (): Promise<Course[]> => fs.readJson(COURSES_FILE).catch(() => []);
export const getRegistrations = async (): Promise<Registration[]> => fs.readJson(REGISTRATIONS_FILE).catch(() => []);

// Save data
export const saveCourses = async (courses: Course[]) => fs.writeJson(COURSES_FILE, courses);
export const saveRegistrations = async (registrations: Registration[]) => fs.writeJson(REGISTRATIONS_FILE, registrations);

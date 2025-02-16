export interface CourseRegistration {
    registration_id: string;
    course_id: string;
    status: "ACTIVE" | "CANCEL_ACCEPTED" | "CANCEL_REJECTED";
}
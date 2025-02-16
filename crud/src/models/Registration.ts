export interface Registration {
    id: string; // Unique registration ID
    employee_name: string;
    email: string;
    course_id: string;
    status: "ACCEPTED" | "COURSE_FULL_ERROR" | "CONFIRMED" | "CANCELLED";
  }
  
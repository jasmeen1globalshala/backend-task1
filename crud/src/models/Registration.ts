export interface Registration {
    id: string; // Unique registration ID
    employee_name: string;
    email: string;
    course_id: string;
    status: "ACCEPTED" | "COURSE_FULL_ERROR" | "CONFIRMED" | "CANCELLED";
  }
  // '{ registration_id: any; email: any; name: any; course_name: string; course_id: string; status: "ACCEPTED"; }
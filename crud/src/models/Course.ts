export interface Course {
    id: string; // Format: OFFERING-<course_name>-<instructor>
    course_name: string;
    instructor_name: string;
    start_date: Date; // Format: ddmmyyyy
    min_employees: number;
    max_employees: number;
    registered_employees: string[]; // Store employee IDs
     status: "PENDING"|"CONFIRMED"|"CANCELLED";
  }
 
export interface Employee {
    name: string;
    email: string;
}

export interface CourseOffering {
    course_id: string;
    course_name: string;
    instructor: string;
    date: string;
    minEmployees: number;
    maxEmployees: number;
    registeredEmployees: Employee[];
}

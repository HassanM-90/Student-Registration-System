export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  email: string;
  phoneNumber: string;
  academicYear: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  subjects?: SubjectEnrollment[];
  cgpa?: number;
}

export interface StudentFormData {
  name: string;
  rollNumber: string;
  department: string;
  email: string;
  phoneNumber: string;
  academicYear: string;
  profileImage?: FileList;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  creditHours: number;
  instructorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectFormData {
  name: string;
  code: string;
  creditHours: number;
  instructorName: string;
}

export interface SubjectEnrollment {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  creditHours: number;
  instructorName: string;
  grade: Grade;
  semester: string;
  enrollmentDate: Date;
}

export type Grade = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

export interface GradePoint {
  grade: Grade;
  points: number;
}

export interface Semester {
  id: string;
  name: string;
  year: string;
  isActive: boolean;
}

export type Department = 
  | 'Computer Science'
  | 'Information Technology'
  | 'Electronics'
  | 'Mechanical'
  | 'Civil'
  | 'Electrical'
  | 'Chemical'
  | 'Biotechnology';

export type AcademicYear = 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year';

export interface SearchFilters {
  query: string;
  department: string;
  academicYear: string;
}

export type SortOption = 'name' | 'rollNumber' | 'department' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
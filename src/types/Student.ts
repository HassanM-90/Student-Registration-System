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
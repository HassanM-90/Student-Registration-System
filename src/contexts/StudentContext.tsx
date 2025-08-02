import React, { createContext, useContext, ReactNode } from 'react';
import { Student, SearchFilters, SortOption, SortOrder, Subject, SubjectFormData, SubjectEnrollment, Grade, Semester } from '../types/Student';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateCGPA, formatCGPA } from '../utils/cgpaCalculator';

interface StudentContextType {
  students: Student[];
  subjects: Subject[];
  semesters: Semester[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  searchStudents: (filters: SearchFilters) => Student[];
  sortStudents: (students: Student[], sortBy: SortOption, order: SortOrder) => Student[];
  clearAllStudents: () => void;
  
  // Subject Management
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  getSubjectById: (id: string) => Subject | undefined;
  
  // Enrollment Management
  enrollStudentInSubject: (studentId: string, subjectId: string, semester: string) => void;
  updateEnrollmentGrade: (studentId: string, enrollmentId: string, grade: Grade) => void;
  removeEnrollment: (studentId: string, enrollmentId: string) => void;
  getStudentEnrollments: (studentId: string) => SubjectEnrollment[];
  calculateStudentCGPA: (studentId: string) => number;
  
  // Semester Management
  addSemester: (semester: Omit<Semester, 'id'>) => void;
  updateSemester: (id: string, semester: Partial<Semester>) => void;
  deleteSemester: (id: string) => void;
  getActiveSemester: () => Semester | undefined;
}

const StudentContext = createContext<StudentContextType | null>(null);

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}

interface StudentProviderProps {
  children: ReactNode;
}

export function StudentProvider({ children }: StudentProviderProps) {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
  const [semesters, setSemesters] = useLocalStorage<Semester[]>('semesters', [
    { id: '1', name: 'Fall', year: '2024', isActive: true },
    { id: '2', name: 'Spring', year: '2024', isActive: false },
    { id: '3', name: 'Summer', year: '2024', isActive: false },
  ]);

  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      subjects: [],
      cgpa: 0,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id
          ? { ...student, ...updates, updatedAt: new Date() }
          : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  const searchStudents = (filters: SearchFilters) => {
    return students.filter(student => {
      const matchesQuery = !filters.query || 
        student.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(filters.query.toLowerCase()) ||
        student.email.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesDepartment = !filters.department || student.department === filters.department;
      const matchesAcademicYear = !filters.academicYear || student.academicYear === filters.academicYear;
      
      return matchesQuery && matchesDepartment && matchesAcademicYear;
    });
  };

  const sortStudents = (students: Student[], sortBy: SortOption, order: SortOrder) => {
    return [...students].sort((a, b) => {
      let aValue: string | Date = a[sortBy];
      let bValue: string | Date = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const clearAllStudents = () => {
    setStudents([]);
  };

  // Subject Management
  const addSubject = (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev =>
      prev.map(subject =>
        subject.id === id
          ? { ...subject, ...updates, updatedAt: new Date() }
          : subject
      )
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  const getSubjectById = (id: string) => {
    return subjects.find(subject => subject.id === id);
  };

  // Enrollment Management
  const enrollStudentInSubject = (studentId: string, subjectId: string, semester: string) => {
    const subject = getSubjectById(subjectId);
    if (!subject) return;

    const enrollment: SubjectEnrollment = {
      id: crypto.randomUUID(),
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCode: subject.code,
      creditHours: subject.creditHours,
      instructorName: subject.instructorName,
      grade: 'F', // Default grade
      semester: semester,
      enrollmentDate: new Date(),
    };

    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? {
              ...student,
              subjects: [...(student.subjects || []), enrollment],
              updatedAt: new Date(),
            }
          : student
      )
    );
  };

  const updateEnrollmentGrade = (studentId: string, enrollmentId: string, grade: Grade) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? {
              ...student,
              subjects: student.subjects?.map(enrollment =>
                enrollment.id === enrollmentId
                  ? { ...enrollment, grade }
                  : enrollment
              ) || [],
              updatedAt: new Date(),
            }
          : student
      )
    );
  };

  const removeEnrollment = (studentId: string, enrollmentId: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? {
              ...student,
              subjects: student.subjects?.filter(enrollment => enrollment.id !== enrollmentId) || [],
              updatedAt: new Date(),
            }
          : student
      )
    );
  };

  const getStudentEnrollments = (studentId: string): SubjectEnrollment[] => {
    const student = getStudentById(studentId);
    return student?.subjects || [];
  };

  const calculateStudentCGPA = (studentId: string): number => {
    const enrollments = getStudentEnrollments(studentId);
    return calculateCGPA(enrollments);
  };

  // Semester Management
  const addSemester = (semesterData: Omit<Semester, 'id'>) => {
    const newSemester: Semester = {
      ...semesterData,
      id: crypto.randomUUID(),
    };
    setSemesters(prev => [...prev, newSemester]);
  };

  const updateSemester = (id: string, updates: Partial<Semester>) => {
    setSemesters(prev =>
      prev.map(semester =>
        semester.id === id
          ? { ...semester, ...updates }
          : semester
      )
    );
  };

  const deleteSemester = (id: string) => {
    setSemesters(prev => prev.filter(semester => semester.id !== id));
  };

  const getActiveSemester = () => {
    return semesters.find(semester => semester.isActive);
  };

  const value: StudentContextType = {
    students,
    subjects,
    semesters,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    searchStudents,
    sortStudents,
    clearAllStudents,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    enrollStudentInSubject,
    updateEnrollmentGrade,
    removeEnrollment,
    getStudentEnrollments,
    calculateStudentCGPA,
    addSemester,
    updateSemester,
    deleteSemester,
    getActiveSemester,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}
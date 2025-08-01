import React, { createContext, useContext, ReactNode } from 'react';
import { Student, SearchFilters, SortOption, SortOrder } from '../types/Student';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  searchStudents: (filters: SearchFilters) => Student[];
  sortStudents: (students: Student[], sortBy: SortOption, order: SortOrder) => Student[];
  clearAllStudents: () => void;
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

  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
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

  const value: StudentContextType = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    searchStudents,
    sortStudents,
    clearAllStudents,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}
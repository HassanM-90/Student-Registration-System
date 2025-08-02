import { Grade, GradePoint, SubjectEnrollment } from '../types/Student';

// Grade point mapping
export const GRADE_POINTS: GradePoint[] = [
  { grade: 'A', points: 4.0 },
  { grade: 'A-', points: 3.7 },
  { grade: 'B+', points: 3.3 },
  { grade: 'B', points: 3.0 },
  { grade: 'B-', points: 2.7 },
  { grade: 'C+', points: 2.3 },
  { grade: 'C', points: 2.0 },
  { grade: 'C-', points: 1.7 },
  { grade: 'D+', points: 1.3 },
  { grade: 'D', points: 1.0 },
  { grade: 'F', points: 0.0 },
];

// Get grade points for a specific grade
export const getGradePoints = (grade: Grade): number => {
  const gradePoint = GRADE_POINTS.find(gp => gp.grade === grade);
  return gradePoint ? gradePoint.points : 0;
};

// Calculate CGPA for a list of subject enrollments
export const calculateCGPA = (enrollments: SubjectEnrollment[]): number => {
  if (enrollments.length === 0) return 0;

  let totalGradePoints = 0;
  let totalCreditHours = 0;

  enrollments.forEach(enrollment => {
    const gradePoints = getGradePoints(enrollment.grade);
    totalGradePoints += gradePoints * enrollment.creditHours;
    totalCreditHours += enrollment.creditHours;
  });

  return totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0;
};

// Calculate semester-wise CGPA
export const calculateSemesterCGPA = (enrollments: SubjectEnrollment[], semester: string): number => {
  const semesterEnrollments = enrollments.filter(enrollment => enrollment.semester === semester);
  return calculateCGPA(semesterEnrollments);
};

// Get all unique semesters from enrollments
export const getUniqueSemesters = (enrollments: SubjectEnrollment[]): string[] => {
  const semesters = enrollments.map(enrollment => enrollment.semester);
  return [...new Set(semesters)].sort();
};

// Format CGPA to 2 decimal places
export const formatCGPA = (cgpa: number): string => {
  return cgpa.toFixed(2);
};

// Get grade color for UI display
export const getGradeColor = (grade: Grade): string => {
  switch (grade) {
    case 'A':
      return 'text-green-600 bg-green-100';
    case 'A-':
      return 'text-green-600 bg-green-50';
    case 'B+':
      return 'text-blue-600 bg-blue-100';
    case 'B':
      return 'text-blue-600 bg-blue-50';
    case 'B-':
      return 'text-yellow-600 bg-yellow-100';
    case 'C+':
      return 'text-yellow-600 bg-yellow-50';
    case 'C':
      return 'text-orange-600 bg-orange-100';
    case 'C-':
      return 'text-orange-600 bg-orange-50';
    case 'D+':
      return 'text-red-600 bg-red-100';
    case 'D':
      return 'text-red-600 bg-red-50';
    case 'F':
      return 'text-red-700 bg-red-200';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}; 
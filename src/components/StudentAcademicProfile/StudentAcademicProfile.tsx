import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2,
  Check,
  Award,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { Student, SubjectEnrollment, Grade, Subject } from '../../types/Student';
import { useStudents } from '../../contexts/StudentContext';
import { getGradeColor, formatCGPA, calculateCGPA } from '../../utils/cgpaCalculator';

interface StudentAcademicProfileProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

const StudentAcademicProfile: React.FC<StudentAcademicProfileProps> = ({ student, isOpen, onClose }) => {
  const { 
    subjects, 
    semesters, 
    enrollStudentInSubject, 
    updateEnrollmentGrade, 
    removeEnrollment,
    getStudentEnrollments,
    calculateStudentCGPA
  } = useStudents();
  
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<SubjectEnrollment | null>(null);

  const enrollments = getStudentEnrollments(student.id);
  const cgpa = calculateStudentCGPA(student.id);
  const activeSemester = semesters.find(s => s.isActive);

  const handleEnroll = async () => {
    if (!selectedSubject || !selectedSemester) return;
    
    setIsEnrolling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      enrollStudentInSubject(student.id, selectedSubject, selectedSemester);
      setSelectedSubject('');
      setSelectedSemester('');
    } catch (error) {
      console.error('Error enrolling student:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleUpdateGrade = async (enrollmentId: string, grade: Grade) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateEnrollmentGrade(student.id, enrollmentId, grade);
      setEditingEnrollment(null);
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  };

  const handleRemoveEnrollment = (enrollmentId: string) => {
    if (window.confirm('Are you sure you want to remove this enrollment? This action cannot be undone.')) {
      removeEnrollment(student.id, enrollmentId);
    }
  };

  const getUniqueSemesters = () => {
    const enrollmentSemesters = enrollments.map(e => e.semester);
    const allSemesters = [...new Set([...semesters.map(s => `${s.name} ${s.year}`), ...enrollmentSemesters])];
    return allSemesters.sort();
  };

  const getSemesterEnrollments = (semester: string) => {
    return enrollments.filter(enrollment => enrollment.semester === semester);
  };

  const calculateSemesterCGPA = (semester: string) => {
    const semesterEnrollments = getSemesterEnrollments(semester);
    return calculateCGPA(semesterEnrollments);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Academic Profile</h2>
              <p className="text-sm text-gray-600">{student.name} - {student.rollNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* CGPA Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">Overall CGPA</p>
                  <p className="text-3xl font-bold">{formatCGPA(cgpa)}</p>
                </div>
                <Award className="h-8 w-8 text-primary-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-100 text-sm">Total Subjects</p>
                  <p className="text-3xl font-bold">{enrollments.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-secondary-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Total Credits</p>
                  <p className="text-3xl font-bold">
                    {enrollments.reduce((sum, e) => sum + e.creditHours, 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-emerald-200" />
              </div>
            </div>
          </div>

          {/* Enroll in New Subject */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enroll in New Subject</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a subject</option>
                  {subjects
                    .filter(subject => !enrollments.some(e => e.subjectId === subject.id))
                    .map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.code} - {subject.name}
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a semester</option>
                  {getUniqueSemesters().map(semester => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleEnroll}
                  disabled={!selectedSubject || !selectedSemester || isEnrolling}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Enroll
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enrollments by Semester */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Subject Enrollments</h3>
            
            {enrollments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
                <p className="text-gray-600">Enroll in subjects to start tracking academic progress.</p>
              </div>
            ) : (
              getUniqueSemesters().map(semester => {
                const semesterEnrollments = getSemesterEnrollments(semester);
                const semesterCGPA = calculateSemesterCGPA(semester);
                
                return (
                  <div key={semester} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{semester}</h4>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {semesterEnrollments.length} subject(s)
                          </span>
                          <span className="text-sm font-medium text-primary-600">
                            CGPA: {formatCGPA(semesterCGPA)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid gap-4">
                        {semesterEnrollments.map((enrollment) => (
                          <div key={enrollment.id} className="card group">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <BookOpen className="h-5 w-5 text-primary-600" />
                                  <h5 className="font-semibold text-gray-900">{enrollment.subjectName}</h5>
                                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                                    {enrollment.subjectCode}
                                  </span>
                                </div>
                                
                                <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{enrollment.creditHours} Credit Hours</span>
                                  </div>
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{enrollment.instructorName}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(enrollment.grade)}`}>
                                      Grade: {enrollment.grade}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditingEnrollment(enrollment)}
                                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                  aria-label={`Edit grade for ${enrollment.subjectName}`}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveEnrollment(enrollment.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label={`Remove ${enrollment.subjectName}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Grade Edit Modal */}
        {editingEnrollment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Update Grade</h3>
                <button
                  onClick={() => setEditingEnrollment(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {editingEnrollment.subjectName} ({editingEnrollment.subjectCode})
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {(['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'] as Grade[]).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleUpdateGrade(editingEnrollment.id, grade)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      editingEnrollment.grade === grade
                        ? getGradeColor(grade)
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setEditingEnrollment(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAcademicProfile; 
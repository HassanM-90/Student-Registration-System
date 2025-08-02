import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  GraduationCap, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Trash2,
  AlertCircle,
  BookOpen,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Student, SearchFilters, SortOption, SortOrder, Department, AcademicYear } from '../../types/Student';
import { useStudents } from '../../contexts/StudentContext';
import { formatCGPA } from '../../utils/cgpaCalculator';
import StudentCard from '../StudentCard/StudentCard';
import EditStudentModal from '../EditStudentModal/EditStudentModal';
import SubjectManagement from '../SubjectManagement/SubjectManagement';
import StudentAcademicProfile from '../StudentAcademicProfile/StudentAcademicProfile';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';

const departments: Department[] = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
  'Biotechnology'
];

const academicYears: AcademicYear[] = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year'
];

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { students, deleteStudent, searchStudents, sortStudents, clearAllStudents, calculateStudentCGPA } = useStudents();
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    department: '',
    academicYear: '',
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSubjectManagement, setShowSubjectManagement] = useState(false);
  const [viewingAcademicProfile, setViewingAcademicProfile] = useState<Student | null>(null);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    const filtered = searchStudents(searchFilters);
    return sortStudents(filtered, sortBy, sortOrder);
  }, [students, searchFilters, sortBy, sortOrder, searchStudents, sortStudents]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    const departmentCounts = students.reduce((acc, student) => {
      acc[student.department] = (acc[student.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const yearCounts = students.reduce((acc, student) => {
      acc[student.academicYear] = (acc[student.academicYear] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEnrollments = students.reduce((sum, student) => {
      return sum + (student.subjects?.length || 0);
    }, 0);

    const averageCGPA = students.reduce((sum, student) => {
      const cgpa = calculateStudentCGPA(student.id);
      return sum + cgpa;
    }, 0) / (students.length || 1);

    return {
      total: students.length,
      departments: Object.keys(departmentCounts).length,
      topDepartment: Object.entries(departmentCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
      recentRegistrations: students.filter(s => 
        new Date(s.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length,
      totalEnrollments,
      averageCGPA: formatCGPA(averageCGPA),
    };
  }, [students, calculateStudentCGPA]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters(prev => ({ ...prev, query: e.target.value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      deleteStudent(id);
      // Adjust current page if needed
      if (paginatedStudents.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleViewAcademicProfile = (student: Student) => {
    setViewingAcademicProfile(student);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all students? This action cannot be undone.')) {
      clearAllStudents();
      setCurrentPage(1);
      setShowDeleteConfirm(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Roll Number', 'Department', 'Email', 'Phone', 'Academic Year', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        `"${student.name}"`,
        student.rollNumber,
        `"${student.department}"`,
        student.email,
        student.phoneNumber,
        `"${student.academicYear}"`,
        new Date(student.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-dark-bg-secondary dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text flex items-center">
                <GraduationCap className="h-8 w-8 text-primary-600 mr-3" />
                Student Dashboard
              </h1>
              <p className="text-gray-600 dark:text-dark-text-secondary mt-1">Manage and view all registered students</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <DarkModeToggle className="self-center sm:self-auto" />
              <button
                onClick={() => navigate('/')}
                className="btn-secondary flex items-center justify-center"
              >
                Home
              </button>
              <button
                onClick={() => setShowSubjectManagement(true)}
                className="btn-secondary flex items-center justify-center"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Manage Subjects
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-dark-bg-secondary dark:border-dark-border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600" />
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-dark-bg-secondary dark:border-dark-border">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-secondary-600" />
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Departments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stats.departments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-dark-bg-secondary dark:border-dark-border">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-dark-bg-secondary dark:border-dark-border">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-orange-600" />
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Average CGPA</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stats.averageCGPA}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-dark-bg-secondary dark:border-dark-border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Top Department</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text truncate">{stats.topDepartment}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-dark-bg-secondary dark:border-dark-border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Recent (7 days)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stats.recentRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, roll number, or email..."
                value={searchFilters.query}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-border-light rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg-secondary dark:text-dark-text dark:placeholder-dark-text-muted"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={searchFilters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-border-light rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg-secondary dark:text-dark-text"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={searchFilters.academicYear}
                onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-border-light rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg-secondary dark:text-dark-text"
              >
                <option value="">All Years</option>
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-100 dark:border-dark-border-light">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Sort by:</span>
              {(['name', 'rollNumber', 'department', 'createdAt'] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => handleSort(option)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    sortBy === option
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:text-dark-text dark:hover:bg-dark-bg-tertiary'
                  }`}
                >
                  {option === 'createdAt' ? 'Date' : option.charAt(0).toUpperCase() + option.slice(1)}
                  {sortBy === option && (
                    <ArrowUpDown className="inline ml-1 h-4 w-4" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportToCSV}
                disabled={filteredStudents.length === 0}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-border-light rounded-lg text-sm font-medium text-gray-700 dark:text-dark-text bg-white dark:bg-dark-bg-secondary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              
              {students.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-dark-bg-secondary hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-dark-text-secondary">
            Showing {paginatedStudents.length} of {filteredStudents.length} students
            {searchFilters.query || searchFilters.department || searchFilters.academicYear ? (
              <span className="ml-2 text-primary-600 dark:text-primary-400 font-medium">
                (filtered from {students.length} total)
              </span>
            ) : null}
          </p>
          
          {filteredStudents.length > itemsPerPage && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="px-3 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Student Grid */}
        {paginatedStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onViewAcademic={handleViewAcademicProfile}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-border-light p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
              {students.length === 0 ? 'No students registered yet' : 'No students match your search'}
            </h3>
            <p className="text-gray-600 dark:text-dark-text-secondary mb-6">
              {students.length === 0
                ? 'Get started by registering your first student.'
                : 'Try adjusting your search criteria or filters.'}
            </p>
            {students.length === 0 && (
              <button
                onClick={() => navigate('/register')}
                className="btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Register First Student
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredStudents.length > itemsPerPage && (
          <div className="flex items-center justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-dark-border-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors text-sm dark:text-dark-text dark:bg-dark-bg-secondary"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-dark-border-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors dark:text-dark-text dark:bg-dark-bg-secondary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i + 1));
                if (pageNumber > totalPages) return null;
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 dark:border-dark-border-light text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary dark:bg-dark-bg-secondary'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 dark:border-dark-border-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors dark:text-dark-text dark:bg-dark-bg-secondary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-dark-border-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors text-sm dark:text-dark-text dark:bg-dark-bg-secondary"
              >
                Last
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}

      {/* Subject Management Modal */}
      {showSubjectManagement && (
        <SubjectManagement
          isOpen={showSubjectManagement}
          onClose={() => setShowSubjectManagement(false)}
        />
      )}

      {/* Academic Profile Modal */}
      {viewingAcademicProfile && (
        <StudentAcademicProfile
          student={viewingAcademicProfile}
          isOpen={!!viewingAcademicProfile}
          onClose={() => setViewingAcademicProfile(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-down">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete All Students</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all {students.length} students? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="btn-danger"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
import React from 'react';
import { Student } from '../../types/Student';
import { Edit2, Trash2, Mail, Phone, Calendar, GraduationCap } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {student.profileImage ? (
            <img
              src={student.profileImage}
              alt={`${student.name}'s profile`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.rollNumber}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(student)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            aria-label={`Edit ${student.name}`}
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Delete ${student.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
          <span className="font-medium">{student.department}</span>
          <span className="mx-2">•</span>
          <span>{student.academicYear}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          <span className="truncate">{student.email}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <span>{student.phoneNumber}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 pt-2 border-t border-gray-100">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>Registered {formatDate(student.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
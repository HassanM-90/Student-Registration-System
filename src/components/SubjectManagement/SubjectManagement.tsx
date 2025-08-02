import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Users, 
  Clock, 
  User,
  X,
  Loader2,
  Check
} from 'lucide-react';
import { Subject, SubjectFormData } from '../../types/Student';
import { subjectValidationSchema } from '../../utils/validation';
import { useStudents } from '../../contexts/StudentContext';

interface SubjectManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({ isOpen, onClose }) => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useStudents();
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<SubjectFormData>({
    resolver: yupResolver(subjectValidationSchema) as any,
    mode: 'onBlur',
  });

  const handleAddSubject = async (data: SubjectFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addSubject({
        name: data.name.trim(),
        code: data.code.toUpperCase().trim(),
        creditHours: data.creditHours,
        instructorName: data.instructorName.trim(),
      });
      
      reset();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding subject:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubject = async (data: SubjectFormData) => {
    if (!editingSubject) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateSubject(editingSubject.id, {
        name: data.name.trim(),
        code: data.code.toUpperCase().trim(),
        creditHours: data.creditHours,
        instructorName: data.instructorName.trim(),
      });
      
      reset();
      setEditingSubject(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating subject:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setValue('name', subject.name);
    setValue('code', subject.code);
    setValue('creditHours', subject.creditHours);
    setValue('instructorName', subject.instructorName);
    setShowForm(true);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
      deleteSubject(id);
    }
  };

  const handleCancel = () => {
    reset();
    setEditingSubject(null);
    setShowForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Subject Management</h2>
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
          {/* Add Subject Button */}
          {!showForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Subject
              </button>
            </div>
          )}

          {/* Subject Form */}
          {showForm && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              
              <form onSubmit={handleSubmit(editingSubject ? handleUpdateSubject : handleAddSubject)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      id="subjectName"
                      {...register('name')}
                      className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="e.g., Advanced Mathematics"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      id="subjectCode"
                      {...register('code')}
                      className={`input-field ${errors.code ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="e.g., MATH101"
                    />
                    {errors.code && (
                      <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="creditHours" className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Hours *
                    </label>
                    <input
                      type="number"
                      id="creditHours"
                      {...register('creditHours')}
                      className={`input-field ${errors.creditHours ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="3"
                      min="1"
                      max="6"
                    />
                    {errors.creditHours && (
                      <p className="text-red-600 text-sm mt-1">{errors.creditHours.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor Name *
                    </label>
                    <input
                      type="text"
                      id="instructorName"
                      {...register('instructorName')}
                      className={`input-field ${errors.instructorName ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="e.g., Dr. John Smith"
                    />
                    {errors.instructorName && (
                      <p className="text-red-600 text-sm mt-1">{errors.instructorName.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingSubject ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {editingSubject ? 'Update Subject' : 'Add Subject'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Subjects List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Subjects ({subjects.length})</h3>
            
            {subjects.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects available</h3>
                <p className="text-gray-600">Add your first subject to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="card group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <BookOpen className="h-5 w-5 text-primary-600" />
                          <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                            {subject.code}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{subject.creditHours} Credit Hours</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{subject.instructorName}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500">
                              Created {new Date(subject.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditSubject(subject)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          aria-label={`Edit ${subject.name}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Delete ${subject.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectManagement; 
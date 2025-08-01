import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, Upload, Loader2 } from 'lucide-react';
import { Student, StudentFormData, Department, AcademicYear } from '../../types/Student';
import { studentValidationSchema, formatPhoneNumber, formatRollNumber } from '../../utils/validation';
import { useStudents } from '../../contexts/StudentContext';

interface EditStudentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

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

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, isOpen, onClose }) => {
  const { updateStudent, students } = useStudents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(student.profileImage || null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<StudentFormData>({
    resolver: yupResolver(studentValidationSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      email: student.email,
      phoneNumber: student.phoneNumber,
      academicYear: student.academicYear,
    },
  });

  const watchedRollNumber = watch('rollNumber');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        email: student.email,
        phoneNumber: student.phoneNumber,
        academicYear: student.academicYear,
      });
      setPreviewImage(student.profileImage || null);
    }
  }, [isOpen, student, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue('profileImage', undefined);
  };

  const checkRollNumberExists = (rollNumber: string) => {
    return students.some(s => s.rollNumber === rollNumber && s.id !== student.id);
  };

  const onSubmit = async (data: StudentFormData) => {
    if (checkRollNumberExists(data.rollNumber)) {
      alert('A student with this roll number already exists!');
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const updatedData = {
        name: data.name.trim(),
        rollNumber: data.rollNumber,
        department: data.department,
        email: data.email.toLowerCase().trim(),
        phoneNumber: data.phoneNumber,
        academicYear: data.academicYear,
        profileImage: previewImage || undefined,
      };

      updateStudent(student.id, updatedData);
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phoneNumber', formatted);
  };

  const handleRollNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRollNumber(e.target.value);
    setValue('rollNumber', formatted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Student</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  id="editProfileImage"
                  {...register('profileImage', { onChange: handleImageChange })}
                />
                <label
                  htmlFor="editProfileImage"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Image
                </label>
              </div>
            </div>
            {errors.profileImage && (
              <p className="text-red-600 text-sm mt-1">{errors.profileImage.message}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="editName"
                {...register('name')}
                className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="editRollNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number *
              </label>
              <input
                type="text"
                id="editRollNumber"
                {...register('rollNumber')}
                onChange={handleRollNumberChange}
                className={`input-field ${errors.rollNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                maxLength={11}
              />
              {errors.rollNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.rollNumber.message}</p>
              )}
              {watchedRollNumber && checkRollNumberExists(watchedRollNumber) && (
                <p className="text-red-600 text-sm mt-1">This roll number is already registered</p>
              )}
            </div>

            <div>
              <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="editEmail"
                {...register('email')}
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="editPhoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
                              <input
                  type="tel"
                  id="editPhoneNumber"
                  {...register('phoneNumber', { onChange: handlePhoneChange })}
                  className={`input-field ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="0300-1234567"
                />
              {errors.phoneNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="editDepartment" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="editDepartment"
                {...register('department')}
                className={`input-field ${errors.department ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="editAcademicYear" className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year *
              </label>
              <select
                id="editAcademicYear"
                {...register('academicYear')}
                className={`input-field ${errors.academicYear ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Select Academic Year</option>
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.academicYear && (
                <p className="text-red-600 text-sm mt-1">{errors.academicYear.message}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting || (watchedRollNumber ? checkRollNumberExists(watchedRollNumber) : false)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
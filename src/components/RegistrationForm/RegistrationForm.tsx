import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2, Check } from 'lucide-react';
import { StudentFormData, Department, AcademicYear } from '../../types/Student';
import { studentValidationSchema, formatPhoneNumber, formatRollNumber } from '../../utils/validation';
import { useStudents } from '../../contexts/StudentContext';

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

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { addStudent, students } = useStudents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<StudentFormData>({
    resolver: yupResolver(studentValidationSchema) as any, // Fix type error by casting to any
    mode: 'onBlur',
  });

  const watchedFields = watch();

  // Debug: Log form state to help identify validation issues
  console.log('Form state:', {
    isValid,
    errors,
    watchedFields
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue('profileImage', undefined);
  };

  const checkRollNumberExists = (rollNumber: string) => {
    return students.some(student => student.rollNumber === rollNumber);
  };

  const onSubmit = async (data: StudentFormData) => {
    if (checkRollNumberExists(data.rollNumber)) {
      alert('A student with this roll number already exists!');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const studentData = {
        name: data.name.trim(),
        rollNumber: data.rollNumber,
        department: data.department,
        email: data.email.toLowerCase().trim(),
        phoneNumber: data.phoneNumber,
        academicYear: data.academicYear,
        profileImage: previewImage || undefined,
      };

      addStudent(studentData);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        reset();
        setPreviewImage(null);
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to register student. Please try again.');
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

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              Student has been successfully registered. Redirecting to dashboard...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
            aria-label="Go back to home"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
          <p className="text-gray-600">Fill in the details below to register a new student</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Object.keys(watchedFields).filter(key => watchedFields[key as keyof StudentFormData] && watchedFields[key as keyof StudentFormData] !== '').length}/7 fields completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(watchedFields).filter(key => watchedFields[key as keyof StudentFormData] && watchedFields[key as keyof StudentFormData] !== '').length / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Profile Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image (Optional)
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
                      aria-label="Remove image"
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
                    {...register('profileImage', { onChange: handleImageChange })}
                    className="hidden"
                    id="profileImage"
                  />
                  <label
                    htmlFor="profileImage"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 5MB. JPEG, PNG, WebP only.
                  </p>
                </div>
              </div>
              {errors.profileImage && (
                <p className="text-red-600 text-sm mt-1">{errors.profileImage.message}</p>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter full name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number *
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  {...register('rollNumber', { onChange: handleRollNumberChange })}
                  className={`input-field ${errors.rollNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="CS2021BT001"
                  maxLength={11}
                  aria-describedby={errors.rollNumber ? 'roll-error' : undefined}
                />
                {errors.rollNumber && (
                  <p id="roll-error" className="text-red-600 text-sm mt-1">{errors.rollNumber.message}</p>
                )}
                {watchedFields.rollNumber && checkRollNumberExists(watchedFields.rollNumber) && (
                  <p className="text-red-600 text-sm mt-1">This roll number is already registered</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Format: XX0000XX000 (e.g., CS2021BT001)
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="student@university.edu"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  {...register('phoneNumber', { onChange: handlePhoneChange })}
                  className={`input-field ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="0300-1234567"
                  aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
                />
                {errors.phoneNumber && (
                  <p id="phone-error" className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Format: 03XX-XXXXXXX (e.g., 0300-1234567) or +92-XXX-XXXXXXX
                </p>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  id="department"
                  {...register('department')}
                  className={`input-field ${errors.department ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-describedby={errors.department ? 'department-error' : undefined}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p id="department-error" className="text-red-600 text-sm mt-1">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year *
                </label>
                <select
                  id="academicYear"
                  {...register('academicYear')}
                  className={`input-field ${errors.academicYear ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-describedby={errors.academicYear ? 'year-error' : undefined}
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.academicYear && (
                  <p id="year-error" className="text-red-600 text-sm mt-1">{errors.academicYear.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary"
            >
              View Dashboard
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting || (watchedFields.rollNumber ? checkRollNumberExists(watchedFields.rollNumber) : false)}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Student'
              )}
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
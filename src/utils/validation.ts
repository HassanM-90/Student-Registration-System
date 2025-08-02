import * as yup from 'yup';

export const studentValidationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  rollNumber: yup
    .string()
    .required('Roll number is required')
    .test('roll-number-format', 'Roll number format: XX0000XX000 (e.g., CS2021BT001)', (value) => {
      if (!value) return false;
      const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      return cleaned.length === 11 && /^[A-Z]{2}\d{4}[A-Z]{2}\d{3}$/.test(cleaned);
    }),
  
  department: yup
    .string()
    .required('Department is required')
    .oneOf([
      'Computer Science',
      'Information Technology',
      'Electronics',
      'Mechanical',
      'Civil',
      'Electrical',
      'Chemical',
      'Biotechnology'
    ], 'Please select a valid department'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
  
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .test('phone-format', 'Please enter a valid Pakistan phone number', (value) => {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      
      // Pakistan phone number validation
      // Mobile: 03XXXXXXXXX (11 digits starting with 03)
      // Mobile without 0: 3XXXXXXXXX (10 digits starting with 3)
      // International: +92XXXXXXXXXXX (12 digits starting with 92)
      if (digitsOnly.startsWith('03') && digitsOnly.length === 11) return true;
      if (digitsOnly.startsWith('3') && digitsOnly.length === 10) return true;
      if (digitsOnly.startsWith('92') && digitsOnly.length === 12) return true;
      
      return false;
    }),
  
  academicYear: yup
    .string()
    .required('Academic year is required')
    .oneOf(['First Year', 'Second Year', 'Third Year', 'Fourth Year'], 'Please select a valid academic year'),
  
  profileImage: yup
    .mixed()
    .optional()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value || !(value as FileList)[0]) return true;
      return (value as FileList)[0].size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only JPEG, PNG, and WebP images are allowed', (value) => {
      if (!value || !(value as FileList)[0]) return true;
      return ['image/jpeg', 'image/png', 'image/webp'].includes((value as FileList)[0].type);
    }),
});

export const subjectValidationSchema = yup.object({
  name: yup
    .string()
    .required('Subject name is required')
    .min(2, 'Subject name must be at least 2 characters')
    .max(100, 'Subject name must not exceed 100 characters'),
  
  code: yup
    .string()
    .required('Subject code is required')
    .min(3, 'Subject code must be at least 3 characters')
    .max(10, 'Subject code must not exceed 10 characters')
    .matches(/^[A-Z0-9]+$/, 'Subject code can only contain uppercase letters and numbers'),
  
  creditHours: yup
    .number()
    .required('Credit hours are required')
    .min(1, 'Credit hours must be at least 1')
    .max(6, 'Credit hours must not exceed 6')
    .typeError('Credit hours must be a number'),
  
  instructorName: yup
    .string()
    .required('Instructor name is required')
    .min(2, 'Instructor name must be at least 2 characters')
    .max(50, 'Instructor name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Instructor name can only contain letters and spaces'),
});

export const formatPhoneNumber = (value: string): string => {
  const phoneNumber = value.replace(/\D/g, '');
  
  // Handle Pakistan phone numbers
  // Format: +92-XXX-XXXXXXX or 03XX-XXXXXXX
  if (phoneNumber.startsWith('92')) {
    // International format: +92-XXX-XXXXXXX
    if (phoneNumber.length <= 5) return `+${phoneNumber}`;
    if (phoneNumber.length <= 8) return `+${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5)}`;
    return `+${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5, 12)}`;
  } else if (phoneNumber.startsWith('03')) {
    // Local mobile format: 03XX-XXXXXXX
    if (phoneNumber.length <= 4) return phoneNumber;
    if (phoneNumber.length <= 8) return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`;
    return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4, 11)}`;
  } else if (phoneNumber.startsWith('3')) {
    // Local mobile format without 0: 3XX-XXXXXXX
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 7) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 10)}`;
  } else {
    // Default formatting for other numbers
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    if (phoneNumber.length <= 10) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};

export const formatRollNumber = (value: string): string => {
  // Remove all non-alphanumeric characters and convert to uppercase
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // If the input is long enough, format it as XX0000XX000
  if (cleaned.length >= 11) {
    const dept = cleaned.slice(0, 2);
    const year = cleaned.slice(2, 6);
    const type = cleaned.slice(6, 8);
    const num = cleaned.slice(8, 11);
    return `${dept}${year}${type}${num}`;
  }
  
  return cleaned;
};
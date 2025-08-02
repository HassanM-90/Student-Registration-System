# Student Registration System

A comprehensive, modern web application for managing university student registrations with full CRUD operations, built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

### ✅ Splash/Welcome Screen
- **Animated welcome screen** with smooth transitions and modern design
- **Interactive elements** with hover effects and animations
- **Navigation button** that routes to the registration form
- **Responsive design** that works on all device sizes

### ✅ University Registration Form
- **Complete student information fields**:
  - Full name (with validation)
  - Roll number (with format validation: XX0000XX000)
  - Department selection (8 departments available)
  - Email address (with validation)
  - Phone number (with formatting)
  - Academic year selection
  - Profile image upload (optional)
- **Form state management** using React Hook Form
- **Real-time validation** with Yup schema validation
- **Image upload functionality** with preview and file validation
- **Progress indicator** showing form completion status
- **Duplicate roll number detection**

### ✅ Subject & CGPA Management
- **Complete Subject Management**:
  - **Create**: Add new subjects with name, code, credit hours, and instructor
  - **Read**: View all available subjects in a comprehensive list
  - **Update**: Edit subject information through modal
  - **Delete**: Remove subjects with confirmation
- **Student Enrollment System**:
  - Enroll students in subjects by semester
  - Track enrollment dates and academic progress
  - Manage multiple semesters and academic years
- **Grade Management**:
  - Assign grades (A, A-, B+, B, B-, C+, C, C-, D+, D, F) to enrollments
  - Color-coded grade display for easy identification
  - Real-time grade updates with visual feedback
- **CGPA Calculation**:
  - **Dynamic CGPA calculation** based on grades and credit hours
  - **Semester-wise CGPA** tracking
  - **Overall CGPA** calculation for each student
  - **Grade point mapping** (A=4.0, A-=3.7, B+=3.3, etc.)
  - **Automatic CGPA updates** when grades change
- **Academic Profile Integration**:
  - **Comprehensive academic dashboard** for each student
  - **Subject enrollment tracking** with detailed information
  - **Grade history** and performance analytics
  - **Credit hour tracking** and total credits calculation
  - **Semester-wise academic progress** visualization

### ✅ Student Listing Page (Dashboard)
- **Complete CRUD operations**:
  - **Create**: Add new students through registration form
  - **Read**: Display all registered students with their information
  - **Update**: Edit student information through modal
  - **Delete**: Remove individual students or clear all
- **Advanced search and filtering**:
  - Search by name, roll number, or email
  - Filter by department and academic year
  - Sort by name, roll number, department, or registration date
- **Pagination** for large datasets
- **Enhanced statistics dashboard** showing:
  - Total students
  - Number of departments
  - Total enrollments
  - Average CGPA
  - Top department
  - Recent registrations (last 7 days)
- **Export functionality** (CSV download)
- **Responsive grid layout** with student cards
- **Academic profile integration** with CGPA display

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Form Management**: React Hook Form with Yup validation
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **State Management**: React Context API with localStorage persistence
- **Build Tool**: Vite
- **Package Manager**: npm

## 📋 Requirements Met

### ✅ Splash/Welcome Screen
- [x] Animated welcome screen with modern design
- [x] Button that routes to registration form
- [x] Smooth animations and transitions

### ✅ University Registration Form
- [x] Student name field with validation
- [x] Roll number field with format validation
- [x] Department selection dropdown
- [x] Image upload functionality
- [x] Effective form state management using React Hook Form
- [x] Real-time validation and error handling

### ✅ Subject & CGPA Management
- [x] Complete subject CRUD operations
- [x] Student enrollment system
- [x] Grade management with color coding
- [x] Dynamic CGPA calculation
- [x] Semester-wise academic tracking
- [x] Academic profile integration
- [x] Grade point mapping system

### ✅ Student Listing Page
- [x] Display all registered students with information
- [x] Show uploaded images
- [x] Complete CRUD operations:
  - [x] Create: Add new students
  - [x] Read: View all students
  - [x] Update: Edit student information
  - [x] Delete: Remove students
- [x] Advanced search and filtering
- [x] Sorting capabilities
- [x] Pagination for large datasets
- [x] Academic profile integration
- [x] CGPA tracking and display

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-registration-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/
│   ├── EditStudentModal/           # Edit student modal component
│   ├── RegistrationForm/           # Student registration form
│   ├── SplashScreen/              # Welcome screen
│   ├── StudentCard/               # Individual student card
│   ├── StudentDashboard/          # Main dashboard with listing
│   ├── SubjectManagement/         # Subject CRUD management
│   └── StudentAcademicProfile/    # Academic profile and CGPA tracking
├── contexts/
│   └── StudentContext.tsx         # Global state management
├── hooks/
│   └── useLocalStorage.ts         # Custom hook for localStorage
├── types/
│   └── Student.ts                # TypeScript type definitions
├── utils/
│   ├── validation.ts             # Form validation schemas
│   └── cgpaCalculator.ts         # CGPA calculation utilities
├── App.tsx                       # Main application component
└── main.tsx                     # Application entry point
```

## 🎨 Features in Detail

### Splash Screen
- **Animated elements** with staggered animations
- **Feature highlights** showcasing system capabilities
- **Statistics display** with animated counters
- **Smooth transitions** and hover effects
- **Accessibility features** with proper ARIA labels

### Registration Form
- **Comprehensive validation**:
  - Name: Letters and spaces only, 2-50 characters
  - Roll number: Format XX0000XX000 (e.g., CS2021BT001)
  - Email: Standard email validation
  - Phone: 10-15 digits with formatting
  - Department: Predefined list validation
  - Academic year: Predefined options validation
  - Image: File size and type validation
- **Real-time feedback** with progress indicator
- **Image preview** with upload/remove functionality
- **Duplicate detection** for roll numbers
- **Success state** with automatic navigation

### Student Dashboard
- **Advanced filtering**:
  - Text search across name, roll number, email
  - Department filter
  - Academic year filter
- **Sorting options**:
  - Name (A-Z, Z-A)
  - Roll number
  - Department
  - Registration date
- **Pagination** with configurable items per page
- **Statistics cards** with real-time data
- **Export functionality** for data backup
- **Bulk operations** (clear all students)

### Student Cards
- **Profile image display** with fallback icon
- **Complete information** display
- **Edit and delete actions** with hover effects
- **Academic profile button** for detailed CGPA tracking
- **CGPA display** with color-coded grades
- **Subject count** and credit hours summary
- **Responsive design** for all screen sizes

### Subject Management
- **Complete CRUD operations** for subjects
- **Form validation** for subject details
- **Subject listing** with edit/delete functionality
- **Credit hours tracking** and instructor assignment
- **Subject code validation** with format requirements

### Academic Profile System
- **Comprehensive academic dashboard** for each student
- **Subject enrollment management** by semester
- **Grade assignment** with 11-grade scale (A to F)
- **Dynamic CGPA calculation** based on grades and credits
- **Semester-wise academic progress** tracking
- **Color-coded grade display** for easy identification
- **Credit hour tracking** and total credits calculation

## 🔧 Customization

### Adding New Departments
Edit `src/types/Student.ts`:
```typescript
export type Department = 
  | 'Computer Science'
  | 'Information Technology'
  | 'Electronics'
  | 'Mechanical'
  | 'Civil'
  | 'Electrical'
  | 'Chemical'
  | 'Biotechnology'
  | 'Your New Department'; // Add here
```

### Modifying Grade System
Edit `src/utils/cgpaCalculator.ts` to customize:
```typescript
export const GRADE_POINTS: GradePoint[] = [
  { grade: 'A', points: 4.0 },
  { grade: 'A-', points: 3.7 },
  // Add or modify grade points here
];
```

### Adding New Semesters
Edit the semester initialization in `src/contexts/StudentContext.tsx`:
```typescript
const [semesters, setSemesters] = useLocalStorage<Semester[]>('semesters', [
  { id: '1', name: 'Fall', year: '2024', isActive: true },
  { id: '2', name: 'Spring', year: '2024', isActive: false },
  // Add new semesters here
]);
```

### Modifying Validation Rules
Edit `src/utils/validation.ts` to customize:
- Roll number format
- Phone number format
- File size limits
- Email validation rules
- Subject code format
- Credit hours limits
- Instructor name validation

### Styling Customization
- **Colors**: Modify `tailwind.config.js` primary/secondary color schemes
- **Animations**: Add new keyframes in `tailwind.config.js`
- **Components**: Update `src/index.css` for global styles

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with grid layouts and comprehensive academic dashboard
- **Tablet**: Optimized layouts with touch-friendly interactions
- **Mobile**: Stacked layouts with mobile-optimized forms and academic profile views
- **Academic interfaces**: Responsive subject management and grade editing modals

## 🔒 Data Persistence

- **Local Storage**: All data is persisted in browser localStorage
- **No backend required**: Works completely offline
- **Data export**: CSV export functionality for backup
- **Academic data persistence**: Subject enrollments, grades, and CGPA calculations
- **Semester management**: Persistent semester configuration
- **Grade history**: Complete academic record preservation

## 🎯 Performance Features

- **Lazy loading** of components
- **Optimized images** with proper sizing
- **Efficient state management** with React Context
- **Minimal bundle size** with Vite optimization
- **Fast development** with hot module replacement
- **Real-time CGPA calculations** with optimized algorithms
- **Dynamic grade updates** with immediate UI feedback

## 🧪 Testing

The application includes comprehensive validation and error handling:
- **Form validation** with real-time feedback
- **Duplicate detection** for roll numbers
- **File validation** for image uploads
- **Error boundaries** for graceful error handling
- **Grade validation** and CGPA calculation accuracy
- **Subject enrollment** validation and conflict detection
- **Semester management** validation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS** 
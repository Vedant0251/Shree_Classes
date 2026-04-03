// Shree Classes (Dada) - JavaScript Application
console.log('Script loaded successfully - Version 6.0 - Enhanced Student Approval System');

// Sample data
let students = [
  { id: "student1", name: "Rahul Patil", password: "password1", medium: "marathi", standard: 5, totalFees: 10000, paidFees: 5000, status: "approved" },
  { id: "student2", name: "Priya Sharma", password: "password2", medium: "english", standard: 8, totalFees: 12000, paidFees: 6000, status: "approved" },
  { id: "student3", name: "Amit Kumar", password: "password3", medium: "marathi", standard: 7, totalFees: 10000, paidFees: 10000, status: "approved" }
];

let teachers = [
  { id: 'teacher1', username: 'teacher_dada', password: 'Teacher@2025!', name: 'Rajesh Kumar', subject: 'Mathematics', status: 'approved', joinDate: '2024-01-15' }
];

let teacherRequests = [];

let admins = [
  { id: "shree_admin_2025", password: "Shree@Classes#2025!Dada" }
];

let studentRequests = []; // Pending student requests

let announcements = [
  { id: 1, title: "Annual Day Celebration", content: "Annual day will be held on 25th December", medium: "all", standard: "all", date: "2025-07-10", type: "announcement" },
  { id: 2, title: "Holiday Notice", content: "College will remain closed on 15th August", medium: "all", standard: "all", date: "2025-07-11", type: "notice" }
];

let homeworks = [
  { id: 1, subject: "Mathematics", description: "Complete exercise 5.1 from textbook", medium: "marathi", standard: 5, dueDate: "2025-07-15" },
  { id: 2, subject: "Science", description: "Write a note on photosynthesis", medium: "english", standard: 8, dueDate: "2025-07-16" }
];

let exams = [
  { id: 1, title: "Mathematics Test", subject: "Mathematics", date: "2025-07-20", medium: "marathi", standard: 5, maxMarks: 100 },
  { id: 2, title: "Science Exam", subject: "Science", date: "2025-07-22", medium: "english", standard: 8, maxMarks: 100 }
];

let testMarks = [
  { id: 1, studentId: "student1", subject: "Mathematics", marks: 85, date: "2025-07-05" },
  { id: 2, studentId: "student1", subject: "Science", marks: 78, date: "2025-07-05" },
  { id: 3, studentId: "student2", subject: "English", marks: 92, date: "2025-07-06" }
];

let feePayments = [
  { id: 1, studentId: "student1", amount: 5000, date: "2025-06-15", notes: "First installment" },
  { id: 2, studentId: "student2", amount: 6000, date: "2025-06-20", notes: "First installment" },
  { id: 3, studentId: "student3", amount: 10000, date: "2025-06-10", notes: "Full payment" }
];

// Current logged in user

// Temporary signup data
let tempSignupData = {};
let generatedOTP = null;

// Initialize data in localStorage if not exists
function initializeData() {
  // Initialize teachers
  if (!localStorage.getItem('teachers')) {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }
  
  // Initialize teacher requests
  if (!localStorage.getItem('teacherRequests')) {
    localStorage.setItem('teacherRequests', JSON.stringify(teacherRequests));
  }
  
  // Force refresh admin data with new credentials
  localStorage.setItem('admins', JSON.stringify(admins));
  
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(students));
  }

  if (!localStorage.getItem('studentRequests')) {
    localStorage.setItem('studentRequests', JSON.stringify(studentRequests));
  }

  if (!localStorage.getItem('announcements')) {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }

  if (!localStorage.getItem('homeworks')) {
    localStorage.setItem('homeworks', JSON.stringify(homeworks));
  }

  if (!localStorage.getItem('exams')) {
    localStorage.setItem('exams', JSON.stringify(exams));
  }

  if (!localStorage.getItem('testMarks')) {
    localStorage.setItem('testMarks', JSON.stringify(testMarks));
  }

  if (!localStorage.getItem('feePayments')) {
    localStorage.setItem('feePayments', JSON.stringify(feePayments));
  }
}

// Page management - Simple functions to prevent freezing
function showLanding() {
  hideAllPages();
  document.getElementById('landing-page').classList.add('active');
}

function showUnifiedLogin() {
  console.log('Showing unified login');
  hideAllPages();
  const loginPage = document.getElementById('login-page');
  console.log('Login page element:', loginPage);
  if (loginPage) {
    loginPage.classList.add('active');
    console.log('Added active class to login page');
  }
  showLoginForm();
}

function showLoginForm() {
  document.getElementById('login-form-section').classList.remove('hidden');
  document.getElementById('access-request-section').classList.add('hidden');
  document.getElementById('teacher-request-section').classList.add('hidden');
  hideLoginError();
}

function showTeacherRequest() {
  console.log('showTeacherRequest called');
  document.getElementById('login-form-section').classList.add('hidden');
  document.getElementById('access-request-section').classList.add('hidden');
  document.getElementById('teacher-request-section').classList.remove('hidden');
  hideLoginError();
  console.log('Teacher request section should be visible now');
}

// Handle teacher request
function handleTeacherRequest() {
  event.preventDefault();
  
  const username = document.getElementById('teacher-username').value.trim();
  const name = document.getElementById('teacher-name').value.trim();
  const subject = document.getElementById('teacher-subject').value;
  const experience = document.getElementById('teacher-experience').value;
  const phone = document.getElementById('teacher-phone').value.trim();
  
  // Get selected standards
  const standardsCheckboxes = document.querySelectorAll('input[name="standards"]:checked');
  const standards = Array.from(standardsCheckboxes).map(cb => cb.value);
  
  // Validation
  if (!username || username.length < 3) {
    showLoginError('Username must be at least 3 characters long');
    return false;
  }
  
  if (!name) {
    showLoginError('Please enter your full name');
    return false;
  }
  
  if (!subject) {
    showLoginError('Please select your subject');
    return false;
  }
  
  if (!experience || experience < 0) {
    showLoginError('Please enter valid experience');
    return false;
  }
  
  if (standards.length === 0) {
    showLoginError('Please select at least one standard');
    return false;
  }
  
  if (!phone || phone.length < 10) {
    showLoginError('Please enter a valid phone number');
    return false;
  }
  
  // Check if username already exists
  const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
  const requests = JSON.parse(localStorage.getItem('teacherRequests')) || [];
  
  if (teachers.find(t => t.username === username) || requests.find(r => r.username === username)) {
    showLoginError('Username already exists. Please choose another.');
    return false;
  }
  
  // Generate unique request ID
  const requestId = 'treq' + (requests.length + 1);
  
  // Create new teacher request
  const newRequest = {
    id: requestId,
    username: username,
    name: name,
    subject: subject,
    experience: experience,
    standards: standards,
    phone: phone,
    requestDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  
  // Add to requests array
  requests.push(newRequest);
  localStorage.setItem('teacherRequests', JSON.stringify(requests));
  
  // Show success message and go back to login
  showLoginSuccess('Your teacher application has been sent to admin! You will be notified once approved.');
  
  setTimeout(() => {
    showLoginForm();
    // Clear form
    document.getElementById('teacher-username').value = '';
    document.getElementById('teacher-name').value = '';
    document.getElementById('teacher-subject').value = '';
    document.getElementById('teacher-experience').value = '';
    document.getElementById('teacher-phone').value = '';
    // Clear checkboxes
    document.querySelectorAll('input[name="standards"]').forEach(cb => cb.checked = false);
  }, 2000);
  
  return false;
}

function showAccessRequest() {
  document.getElementById('login-form-section').classList.add('hidden');
  document.getElementById('teacher-request-section').classList.add('hidden');
  document.getElementById('access-request-section').classList.remove('hidden');
  hideLoginError();
}

function hideLoginError() {
  const errorDiv = document.getElementById('login-error');
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
}

function showLoginError(message) {
  const errorDiv = document.getElementById('login-error');
  const errorMsg = document.getElementById('error-message');
  if (errorDiv && errorMsg) {
    errorMsg.textContent = message;
    errorDiv.classList.remove('hidden');
  }
}

function showLoginSuccess(message) {
  const successDiv = document.getElementById('login-success');
  const successMsg = document.getElementById('success-message');
  if (successDiv && successMsg) {
    successMsg.textContent = message;
    successDiv.classList.remove('hidden');
  }
}

function showTeacherDashboard() {
  hideAllPages();
  document.getElementById('teacher-dashboard').classList.add('active');
}

function loadTeacherData(teacher) {
  // Update teacher profile
  const teacherNameEl = document.getElementById('teacher-name');
  const welcomeNameEl = document.getElementById('teacher-welcome-name');
  const subjectEl = document.getElementById('teacher-subject');
  const avatarEl = document.getElementById('teacher-avatar');
  
  if (teacherNameEl) teacherNameEl.textContent = teacher.name;
  if (welcomeNameEl) welcomeNameEl.textContent = teacher.name;
  if (subjectEl) subjectEl.textContent = teacher.subject;
  if (avatarEl) avatarEl.textContent = teacher.name.charAt(0).toUpperCase();
  
  // Load teacher-specific data
  loadTeacherStats();
  loadTeacherStudents();
  loadTeacherHomework();
  loadTeacherAnnouncements();
}

function loadTeacherStats() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
  
  // Get current teacher
  const teacher = teachers.find(t => t.id === currentUser.id);
  if (!teacher) return;
  
  // Filter data for this teacher's standards
  const teacherStudents = students.filter(student => 
    teacher.standards.includes(student.standard.toString())
  );
  const teacherHomeworks = homeworks.filter(homework => 
    homework.subject === teacher.subject && teacher.standards.includes(homework.standard.toString())
  );
  
  // Update dashboard counts
  const totalStudentsEl = document.getElementById('teacher-students-count');
  const homeworkCountEl = document.getElementById('teacher-homework-count');
  const announcementsCountEl = document.getElementById('teacher-announcements-count');
  
  if (totalStudentsEl) totalStudentsEl.textContent = teacherStudents.length;
  if (homeworkCountEl) homeworkCountEl.textContent = teacherHomeworks.length;
  if (announcementsCountEl) announcementsCountEl.textContent = announcements.length;
}

function loadTeacherStudents() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
  
  // Get current teacher
  const teacher = teachers.find(t => t.id === currentUser.id);
  if (!teacher) return;
  
  const studentsTable = document.getElementById('teacher-students-table');
  
  if (!studentsTable) return;
  
  studentsTable.innerHTML = '';
  
  if (students.length === 0) {
    studentsTable.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-gray-500">No students assigned</td></tr>';
    return;
  }
  
  // Filter students based on teacher's assigned standards
  const teacherStudents = students.filter(student => 
    teacher.standards.includes(student.standard.toString())
  );
  
  if (teacherStudents.length === 0) {
    studentsTable.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-gray-500">No students assigned to your classes</td></tr>';
    return;
  }
  
  teacherStudents.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-medium">${student.name}</td>
      <td class="py-2 px-4 border-b">${student.standard}</td>
      <td class="py-2 px-4 border-b">${student.medium}</td>
      <td class="py-2 px-4 border-b">
        <span class="badge ${student.status === 'approved' ? 'badge-success' : 'badge-warning'}">
          ${student.status}
        </span>
      </td>
      <td class="py-2 px-4 border-b">₹${student.paidFees || 0}/₹${student.totalFees || 0}</td>
      <td class="py-2 px-4 border-b">
        <button onclick="viewStudentDetails('${student.id}')" class="btn-info px-3 py-1 rounded text-sm">View</button>
      </td>
    `;
    studentsTable.appendChild(row);
  });
}

function loadTeacherHomework() {
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  const homeworkTable = document.getElementById('teacher-homework-table');
  
  if (!homeworkTable) return;
  
  homeworkTable.innerHTML = '';
  
  if (homeworks.length === 0) {
    homeworkTable.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-gray-500">No homework assigned</td></tr>';
    return;
  }
  
  homeworks.forEach(homework => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-medium">${homework.title}</td>
      <td class="py-2 px-4 border-b">${homework.subject}</td>
      <td class="py-2 px-4 border-b">${homework.standard}</td>
      <td class="py-2 px-4 border-b">${homework.dueDate}</td>
      <td class="py-2 px-4 border-b">
        <button onclick="editHomework('${homework.id}')" class="btn-info px-3 py-1 rounded text-sm mr-2">Edit</button>
        <button onclick="deleteHomework('${homework.id}')" class="btn-danger px-3 py-1 rounded text-sm">Delete</button>
      </td>
    `;
    homeworkTable.appendChild(row);
  });
}

function loadTeacherAnnouncements() {
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const announcementsTable = document.getElementById('teacher-announcements-table');
  
  if (!announcementsTable) return;
  
  announcementsTable.innerHTML = '';
  
  if (announcements.length === 0) {
    announcementsTable.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-gray-500">No announcements posted</td></tr>';
    return;
  }
  
  announcements.forEach(announcement => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-medium">${announcement.title}</td>
      <td class="py-2 px-4 border-b">${announcement.type}</td>
      <td class="py-2 px-4 border-b">${announcement.medium}</td>
      <td class="py-2 px-4 border-b">${announcement.date}</td>
      <td class="py-2 px-4 border-b">
        <button onclick="editAnnouncement('${announcement.id}')" class="btn-info px-3 py-1 rounded text-sm mr-2">Edit</button>
        <button onclick="deleteAnnouncement('${announcement.id}')" class="btn-danger px-3 py-1 rounded text-sm">Delete</button>
      </td>
    `;
    announcementsTable.appendChild(row);
  });
}

function showStudentDashboard() {
  hideAllPages();
  document.getElementById('student-dashboard').classList.add('active');
}

function showAdminDashboard() {
  console.log('Redirecting to admin dashboard...');
  hideAllPages();
  // Redirect to separate admin dashboard file
  window.location.href = 'admin_dashboard.html';
}

function hideAllPages() {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
}

// Admin functions
function loadAdminData() {
  loadStudentRequests();
  loadAdminStudents();
  loadAdminAnnouncements();
  loadAdminHomework();
  loadAdminFees();
  loadAdminStats();
}

function loadAdminStudents() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const studentsTable = document.getElementById('students-table');
  
  if (!studentsTable) return;
  
  studentsTable.innerHTML = '';
  
  if (students.length === 0) {
    studentsTable.innerHTML = '<tr><td colspan="8" class="py-4 text-center text-gray-500">No students available</td></tr>';
    return;
  }
  
  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-mono text-xs">${student.id}</td>
      <td class="py-2 px-4 border-b font-medium">${student.name}</td>
      <td class="py-2 px-4 border-b">${student.username}</td>
      <td class="py-2 px-4 border-b">${student.mobile}</td>
      <td class="py-2 px-4 border-b">${student.medium}</td>
      <td class="py-2 px-4 border-b">${student.standard}</td>
      <td class="py-2 px-4 border-b">
        <span class="badge badge-success">${student.status}</span>
      </td>
      <td class="py-2 px-4 border-b">
        <button onclick="viewStudent('${student.id}')" class="btn-info px-3 py-1 rounded text-sm">View</button>
      </td>
    `;
    studentsTable.appendChild(row);
  });
}

function loadAdminAnnouncements() {
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const recentAnnouncements = document.getElementById('admin-recent-announcements');
  
  if (!recentAnnouncements) return;
  
  recentAnnouncements.innerHTML = '';
  
  if (announcements.length === 0) {
    recentAnnouncements.innerHTML = '<li class="py-3">No recent announcements</li>';
    return;
  }
  
  announcements.slice(0, 3).forEach(announcement => {
    const li = document.createElement('li');
    li.className = 'py-3';
    li.innerHTML = `
      <div class="flex items-start">
        <i class="fas fa-${announcement.type === 'notice' ? 'exclamation-triangle text-yellow-500' : 'bullhorn text-blue-500'} mt-1 mr-3"></i>
        <div>
          <h4 class="font-semibold text-sm">${announcement.title}</h4>
          <p class="text-xs text-gray-600 mt-1">${announcement.content}</p>
          <p class="text-xs text-gray-400 mt-1">${announcement.date}</p>
        </div>
      </div>
    `;
    recentAnnouncements.appendChild(li);
  });
}

function viewStudent(studentId) {
  alert(`View details for student: ${studentId}\n\nThis would open a detailed view of the student's information.`);
}

function showAdminSection(section) {
  // Hide all admin sections
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.classList.add('hidden');
  });
  
  // Show selected section
  const targetSection = document.getElementById('admin-section-' + section);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Load section-specific data
  if (section === 'requests') {
    loadStudentRequests();
  } else if (section === 'students') {
    loadAdminStudents();
  } else if (section === 'dashboard') {
    loadAdminStats();
  }
}

function loadStudentRequests() {
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  const requestsTable = document.getElementById('requests-table');
  
  if (!requestsTable) return;
  
  requestsTable.innerHTML = '';
  
  if (requests.length === 0) {
    requestsTable.innerHTML = '<tr><td colspan="9" class="py-4 text-center text-gray-500">No pending requests</td></tr>';
    return;
  }
  
  requests.forEach(request => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-mono text-xs">${request.id}</td>
      <td class="py-2 px-4 border-b font-medium">${request.name}</td>
      <td class="py-2 px-4 border-b">${request.username}</td>
      <td class="py-2 px-4 border-b">${request.accessRequest}</td>
      <td class="py-2 px-4 border-b">${request.medium}</td>
      <td class="py-2 px-4 border-b">${request.standard}</td>
      <td class="py-2 px-4 border-b">${request.requestDate}</td>
      <td class="py-2 px-4 border-b">
        <span class="badge badge-warning">${request.status}</span>
      </td>
      <td class="py-2 px-4 border-b">
        <button onclick="approveRequest('${request.id}')" class="btn-success px-3 py-1 rounded text-sm mr-2">Approve</button>
        <button onclick="rejectRequest('${request.id}')" class="btn-danger px-3 py-1 rounded text-sm">Reject</button>
      </td>
    `;
    requestsTable.appendChild(row);
  });
}

function approveRequest(requestId) {
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  const students = JSON.parse(localStorage.getItem('students')) || [];
  
  const requestIndex = requests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return;
  
  const request = requests[requestIndex];
  
  // Show approval dialog
  const approvalDialog = document.createElement('div');
  approvalDialog.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%;">
        <h3 style="margin: 0 0 20px; color: #10b981; font-size: 1.5rem;">
          <i class="fas fa-user-check" style="margin-right: 10px;"></i>
          Approve Student Request
        </h3>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 10px; font-weight: 600; color: #374151;">Student Details:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p><strong>Name:</strong> ${request.name}</p>
            <p><strong>Username:</strong> ${request.username}</p>
            <p><strong>Access Type:</strong> ${request.accessRequest}</p>
            <p><strong>Request Date:</strong> ${request.requestDate}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 10px; font-weight: 600; color: #374151;">Account Settings:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #374151;">Medium:</label>
              <select id="approve-medium" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="marathi">Marathi</option>
                <option value="english">English</option>
                <option value="semi-english">Semi-English</option>
              </select>
            </div>
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #374151;">Standard:</label>
              <select id="approve-standard" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="5">5th</option>
                <option value="6">6th</option>
                <option value="7">7th</option>
                <option value="8">8th</option>
                <option value="9">9th</option>
                <option value="10">10th</option>
              </select>
            </div>
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #374151;">Total Fees:</label>
              <input type="number" id="approve-fees" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" value="10000" min="1000">
            </div>
          </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button onclick="this.parentElement.parentElement.remove(); cancelApproval()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Cancel
          </button>
          <button onclick="confirmApproval('${requestId}')" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
            <i class="fas fa-check" style="margin-right: 8px;"></i>
            Approve & Generate Password
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(approvalDialog);
}

function confirmApproval(requestId) {
  const medium = document.getElementById('approve-medium').value;
  const standard = document.getElementById('approve-standard').value;
  const fees = document.getElementById('approve-fees').value;
  
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  const students = JSON.parse(localStorage.getItem('students')) || [];
  
  const requestIndex = requests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return;
  
  const request = requests[requestIndex];
  
  // Generate random password
  const randomPassword = generateRandomPassword();
  
  // Create student from request
  const student = {
    id: 'student' + (students.length + 1),
    name: request.name,
    username: request.username,
    password: randomPassword,
    accessRequest: request.accessRequest,
    medium: medium,
    standard: parseInt(standard),
    totalFees: parseInt(fees),
    paidFees: 0,
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'approved'
  };
  
  // Add to students array
  students.push(student);
  localStorage.setItem('students', JSON.stringify(students));
  
  // Remove from requests
  requests.splice(requestIndex, 1);
  localStorage.setItem('studentRequests', JSON.stringify(requests));
  
  // Remove approval dialog
  document.body.removeChild(document.body.lastChild);
  
  // Show success message with generated password
  alert(`Student approved successfully!\n\nName: ${student.name}\nUsername: ${student.username}\nGenerated Password: ${randomPassword}\nMedium: ${medium}\nStandard: ${standard}th\nTotal Fees: ₹${fees}\n\nPlease share these credentials with the student.`);
  
  // Refresh admin data
  loadStudentRequests();
  loadAdminStudents();
  loadAdminStats();
}

function cancelApproval() {
  const approvalDialog = document.body.lastChild;
  if (approvalDialog && approvalDialog.tagName === 'DIV') {
    document.body.removeChild(approvalDialog);
  }
}

// Generate random password
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Approve teacher request
function approveTeacherRequest(requestId) {
  const requests = JSON.parse(localStorage.getItem('teacherRequests')) || [];
  const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
  
  const requestIndex = requests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return;
  
  const request = requests[requestIndex];
  
  // Generate random password
  const randomPassword = generateRandomPassword();
  
  // Create teacher from request
  const teacher = {
    id: 'teacher' + (teachers.length + 1),
    username: request.username,
    password: randomPassword,
    name: request.name,
    subject: request.subject,
    experience: request.experience,
    standards: request.standards,
    phone: request.phone,
    joinDate: new Date().toISOString().split('T')[0],
    status: 'approved'
  };
  
  // Add to teachers array
  teachers.push(teacher);
  localStorage.setItem('teachers', JSON.stringify(teachers));
  
  // Remove from requests
  requests.splice(requestIndex, 1);
  localStorage.setItem('teacherRequests', JSON.stringify(requests));
  
  // Show success message with generated password
  alert(`Teacher approved!\n\nUsername: ${teacher.username}\nGenerated Password: ${randomPassword}\n\nPlease share this password with the teacher.`);
  
  // Refresh admin data
  loadTeacherRequests();
  loadAdminStats();
}

// Reject teacher request
function rejectTeacherRequest(requestId) {
  if (!confirm('Are you sure you want to reject this teacher application?')) return;
  
  const requests = JSON.parse(localStorage.getItem('teacherRequests')) || [];
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex !== -1) {
    requests.splice(requestIndex, 1);
    localStorage.setItem('teacherRequests', JSON.stringify(requests));
    loadTeacherRequests();
    loadAdminStats();
    alert('Teacher application rejected.');
  }
}

// Load teacher requests
function loadTeacherRequests() {
  const requests = JSON.parse(localStorage.getItem('teacherRequests')) || [];
  const requestsTable = document.getElementById('teacher-requests-table');
  
  if (!requestsTable) return;
  
  requestsTable.innerHTML = '';
  
  if (requests.length === 0) {
    requestsTable.innerHTML = '<tr><td colspan="8" class="py-4 text-center text-gray-500">No pending teacher requests</td></tr>';
    return;
  }
  
  requests.forEach(request => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-mono text-xs">${request.id}</td>
      <td class="py-2 px-4 border-b font-medium">${request.name}</td>
      <td class="py-2 px-4 border-b">${request.username}</td>
      <td class="py-2 px-4 border-b">${request.subject}</td>
      <td class="py-2 px-4 border-b">${request.experience} years</td>
      <td class="py-2 px-4 border-b">${request.standards.join(', ')}</td>
      <td class="py-2 px-4 border-b">${request.requestDate}</td>
      <td class="py-2 px-4 border-b">
        <span class="badge badge-warning">${request.status}</span>
      </td>
      <td class="py-2 px-4 border-b">
        <button onclick="approveTeacherRequest('${request.id}')" class="btn-success px-3 py-1 rounded text-sm mr-2">Approve</button>
        <button onclick="rejectTeacherRequest('${request.id}')" class="btn-danger px-3 py-1 rounded text-sm">Reject</button>
      </td>
    `;
    requestsTable.appendChild(row);
  });
}

function rejectRequest(requestId) {
  if (!confirm('Are you sure you want to reject this request?')) return;
  
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex !== -1) {
    requests.splice(requestIndex, 1);
    localStorage.setItem('studentRequests', JSON.stringify(requests));
    loadStudentRequests();
    loadAdminStats();
    alert('Student request rejected.');
  }
}

function loadAdminStats() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  const teacherRequests = JSON.parse(localStorage.getItem('teacherRequests')) || [];
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  
  // Update dashboard counts
  const totalStudentsEl = document.getElementById('total-students-count');
  const requestsCountEl = document.getElementById('requests-count');
  const announcementsCountEl = document.getElementById('announcements-count');
  const homeworkCountEl = document.getElementById('homework-count');
  const totalFeesEl = document.getElementById('total-fees-amount');
  const quickRequestsBadgeEl = document.getElementById('quick-requests-badge');
  const lastUpdatedEl = document.getElementById('last-updated');
  
  if (totalStudentsEl) totalStudentsEl.textContent = students.length;
  if (requestsCountEl) requestsCountEl.textContent = requests.length;
  if (announcementsCountEl) announcementsCountEl.textContent = announcements.length;
  if (homeworkCountEl) homeworkCountEl.textContent = homeworks.length;
  if (quickRequestsBadgeEl) quickRequestsBadgeEl.textContent = requests.length;
  if (lastUpdatedEl) lastUpdatedEl.textContent = new Date().toLocaleTimeString();
  
  // Calculate total fees
  const totalFees = students.reduce((sum, student) => sum + (student.totalFees || 0), 0);
  if (totalFeesEl) totalFeesEl.textContent = `₹${totalFees.toLocaleString()}`;
  
  // Update recent activity
  updateRecentActivity();
  
  // Update admin student statistics
  updateAdminStudentStats();
}

// Update recent activity
function updateRecentActivity() {
  const activityEl = document.getElementById('recent-activity');
  if (!activityEl) return;
  
  const activities = [
    { icon: 'fas fa-circle text-green-500', title: 'System started', time: '2 minutes ago' },
    { icon: 'fas fa-circle text-blue-500', title: 'Admin login', time: 'Just now' }
  ];
  
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  if (requests.length > 0) {
    activities.unshift({
      icon: 'fas fa-circle text-yellow-500',
      title: `${requests.length} new student request${requests.length > 1 ? 's' : ''}`,
      time: 'Recently'
    });
  }
  
  activityEl.innerHTML = activities.slice(0, 5).map(activity => `
    <div class="flex items-center text-sm p-2 bg-gray-50 rounded">
      <i class="${activity.icon} text-xs mr-2"></i>
      <div>
        <span class="font-medium">${activity.title}</span>
        <div class="text-xs text-gray-500">${activity.time}</div>
      </div>
    </div>
  `).join('');
}

// Teacher section navigation
function showTeacherSection(section) {
  // Hide all teacher sections
  document.querySelectorAll('.teacher-section').forEach(sec => {
    sec.classList.add('hidden');
  });
  
  // Remove active class from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected section
  const sectionEl = document.getElementById(`teacher-section-${section}`);
  if (sectionEl) {
    sectionEl.classList.remove('hidden');
  }
  
  // Add active class to clicked nav item
  const navItem = event.target.closest('.nav-item');
  if (navItem) {
    navItem.classList.add('active');
  }
  
  // Reload data for the section
  if (section === 'students') {
    loadTeacherStudents();
  } else if (section === 'homework') {
    loadTeacherHomework();
  } else if (section === 'announcements') {
    loadTeacherAnnouncements();
  } else if (section === 'dashboard') {
    loadTeacherStats();
  }
}

// Admin section navigation
function showAdminSection(section) {
  console.log('Showing admin section:', section);
  
  // Hide all admin sections
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.classList.add('hidden');
  });
  
  // Remove active class from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected section
  const sectionEl = document.getElementById(`admin-section-${section}`);
  if (sectionEl) {
    sectionEl.classList.remove('hidden');
    console.log(`Admin section ${section} shown successfully`);
  } else {
    console.error(`Admin section ${section} not found!`);
  }
  
  // Add active class to clicked nav item
  const navItem = event.target.closest('.nav-item');
  if (navItem) {
    navItem.classList.add('active');
  }
  
  // Load data for the section
  if (section === 'requests') {
    loadStudentRequests();
  } else if (section === 'teacher-requests') {
    loadTeacherRequests();
  } else if (section === 'students') {
    loadAdminStudents();
  } else if (section === 'announcements') {
    loadAdminAnnouncements();
  } else if (section === 'homework') {
    loadAdminHomework();
  } else if (section === 'fees') {
    loadAdminFees();
  } else if (section === 'dashboard') {
    loadAdminStats();
  }
}

// Student functions
function loadStudentData(student) {
  // Update student name and profile
  const studentNameEl = document.getElementById('student-name');
  const welcomeNameEl = document.getElementById('student-welcome-name');
  const classInfoEl = document.getElementById('student-class-info');
  const avatarEl = document.getElementById('student-avatar');
  const memberSinceEl = document.getElementById('member-since');
  
  if (studentNameEl) studentNameEl.textContent = student.name;
  if (welcomeNameEl) welcomeNameEl.textContent = `Welcome, ${student.name}!`;
  if (classInfoEl) classInfoEl.textContent = `${student.medium.charAt(0).toUpperCase() + student.medium.slice(1)} - ${student.standard}th Standard`;
  if (avatarEl) avatarEl.textContent = student.name.charAt(0).toUpperCase();
  if (memberSinceEl) memberSinceEl.textContent = student.registrationDate || '2025';
  
  // Calculate and update progress
  updateStudentProgress(student);
  
  // Load student data
  loadStudentAnnouncements(student.medium, student.standard);
  loadStudentHomework(student.medium, student.standard);
  loadStudentTestMarks(student.id);
  loadStudentFees(student.id);
}

function updateStudentProgress(student) {
  const testMarks = JSON.parse(localStorage.getItem('testMarks')) || [];
  const studentMarks = testMarks.filter(tm => tm.studentId === student.id);
  
  let avgScore = 0;
  if (studentMarks.length > 0) {
    avgScore = Math.round(studentMarks.reduce((sum, mark) => sum + mark.marks, 0) / studentMarks.length);
  }
  
  // Update progress indicators
  const avgScoreEl = document.getElementById('avg-score');
  const overallProgressEl = document.getElementById('overall-progress');
  const attendanceEl = document.getElementById('attendance-rate');
  const rankEl = document.getElementById('class-rank');
  
  if (avgScoreEl) avgScoreEl.textContent = `${avgScore}%`;
  if (overallProgressEl) overallProgressEl.textContent = `${avgScore}%`;
  if (attendanceEl) attendanceEl.textContent = '92%'; // Mock data
  if (rankEl) rankEl.textContent = `#${Math.floor(Math.random() * 10) + 1}`; // Mock rank
  
  // Update progress bar
  const progressBar = document.querySelector('.bg-blue-600.h-2.rounded-full');
  if (progressBar) progressBar.style.width = `${avgScore}%`;
}

// Admin management functions
function addAnnouncement() {
  const title = document.getElementById('announcement-title').value;
  const content = document.getElementById('announcement-content').value;
  const type = document.getElementById('announcement-type').value;
  const priority = document.getElementById('announcement-priority').value;
  const medium = document.getElementById('announcement-medium').value;
  const standard = document.getElementById('announcement-standard').value;
  
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  
  const newAnnouncement = {
    id: announcements.length + 1,
    title: title,
    content: content,
    type: type,
    priority: priority,
    medium: medium,
    standard: standard,
    date: new Date().toISOString().split('T')[0],
    postedBy: 'Admin'
  };
  
  announcements.push(newAnnouncement);
  localStorage.setItem('announcements', JSON.stringify(announcements));
  
  // Reset form
  document.getElementById('announcement-form').reset();
  
  // Reload announcements
  loadAdminAnnouncements();
  loadAdminStats();
  
  alert('Announcement posted successfully!');
  
  return false;
}

function addHomework() {
  const subject = document.getElementById('homework-subject').value;
  const description = document.getElementById('homework-description').value;
  const medium = document.getElementById('homework-medium').value;
  const standard = document.getElementById('homework-standard').value;
  const dueDate = document.getElementById('homework-due-date').value;
  
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  
  const newHomework = {
    id: homeworks.length + 1,
    subject: subject,
    description: description,
    medium: medium,
    standard: parseInt(standard),
    dueDate: dueDate,
    assignedDate: new Date().toISOString().split('T')[0],
    assignedBy: 'Admin'
  };
  
  homeworks.push(newHomework);
  localStorage.setItem('homeworks', JSON.stringify(homeworks));
  
  // Reset form
  document.getElementById('homework-form').reset();
  
  // Reload homework
  loadAdminHomework();
  loadAdminStats();
  
  alert('Homework assigned successfully!');
  
  return false;
}

function loadAdminAnnouncements() {
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const announcementsList = document.getElementById('admin-announcements-list');
  
  if (!announcementsList) return;
  
  announcementsList.innerHTML = '';
  
  if (announcements.length === 0) {
    announcementsList.innerHTML = '<div class="text-gray-500 text-center py-4">No announcements available</div>';
    return;
  }
  
  announcements.slice().reverse().forEach(announcement => {
    const priorityColor = announcement.priority === 'urgent' ? 'red' : announcement.priority === 'high' ? 'orange' : 'blue';
    const typeIcon = announcement.type === 'notice' ? 'exclamation-triangle' : announcement.type === 'holiday' ? 'calendar-alt' : 'bullhorn';
    
    const div = document.createElement('div');
    div.className = 'p-3 border rounded hover:bg-gray-50';
    div.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center mb-1">
            <i class="fas fa-${typeIcon} text-${priorityColor}-500 mr-2"></i>
            <h4 class="font-semibold text-sm">${announcement.title}</h4>
            <span class="ml-2 bg-${priorityColor}-100 text-${priorityColor}-800 text-xs px-2 py-1 rounded">${announcement.priority}</span>
          </div>
          <p class="text-xs text-gray-600 mb-1">${announcement.content}</p>
          <div class="flex items-center text-xs text-gray-400">
            <span>${announcement.medium} - ${announcement.standard}</span>
            <span class="mx-2">•</span>
            <span>${announcement.date}</span>
          </div>
        </div>
        <button onclick="deleteAnnouncement(${announcement.id})" class="text-red-500 hover:text-red-700 ml-2">
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    `;
    announcementsList.appendChild(div);
  });
}

function loadAdminHomework() {
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  const homeworkList = document.getElementById('admin-homework-list');
  
  if (!homeworkList) return;
  
  homeworkList.innerHTML = '';
  
  if (homeworks.length === 0) {
    homeworkList.innerHTML = '<div class="text-gray-500 text-center py-4">No homework assigned</div>';
    return;
  }
  
  homeworks.slice().reverse().forEach(homework => {
    const div = document.createElement('div');
    div.className = 'p-3 border rounded hover:bg-gray-50';
    div.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center mb-1">
            <i class="fas fa-book text-blue-500 mr-2"></i>
            <h4 class="font-semibold text-sm">${homework.subject}</h4>
          </div>
          <p class="text-xs text-gray-600 mb-1">${homework.description}</p>
          <div class="flex items-center text-xs text-gray-400">
            <span>${homework.medium} - ${homework.standard}</span>
            <span class="mx-2">•</span>
            <span>Due: ${homework.dueDate}</span>
          </div>
        </div>
        <button onclick="deleteHomework(${homework.id})" class="text-red-500 hover:text-red-700 ml-2">
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    `;
    homeworkList.appendChild(div);
  });
}

function deleteAnnouncement(id) {
  if (!confirm('Are you sure you want to delete this announcement?')) return;
  
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const filtered = announcements.filter(a => a.id !== id);
  localStorage.setItem('announcements', JSON.stringify(filtered));
  
  loadAdminAnnouncements();
  loadAdminStats();
}

function deleteHomework(id) {
  if (!confirm('Are you sure you want to delete this homework?')) return;
  
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  const filtered = homeworks.filter(h => h.id !== id);
  localStorage.setItem('homeworks', JSON.stringify(filtered));
  
  loadAdminHomework();
  loadAdminStats();
}

function loadAdminFees() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const feePayments = JSON.parse(localStorage.getItem('feePayments')) || [];
  
  let totalReceivable = 0;
  let totalReceived = 0;
  
  students.forEach(student => {
    totalReceivable += student.totalFees;
  });
  
  feePayments.forEach(payment => {
    totalReceived += payment.amount;
  });
  
  const pending = totalReceivable - totalReceived;
  const collectionRate = totalReceivable > 0 ? Math.round((totalReceived / totalReceivable) * 100) : 0;
  
  // Update fee overview
  const totalReceivableEl = document.getElementById('total-receivable');
  const totalReceivedEl = document.getElementById('total-received');
  const pendingEl = document.getElementById('pending-amount');
  const rateEl = document.getElementById('collection-rate');
  
  if (totalReceivableEl) totalReceivableEl.textContent = `₹${totalReceivable}`;
  if (totalReceivedEl) totalReceivedEl.textContent = `₹${totalReceived}`;
  if (pendingEl) pendingEl.textContent = `₹${pending}`;
  if (rateEl) rateEl.textContent = `${collectionRate}%`;
  
  // Load fees table
  const feesTable = document.getElementById('fees-table');
  if (feesTable) {
    feesTable.innerHTML = '';
    
    students.forEach(student => {
      const studentPayments = feePayments.filter(fp => fp.studentId === student.id);
      const paid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const remaining = student.totalFees - paid;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="py-2 px-4 border-b font-mono text-xs">${student.id}</td>
        <td class="py-2 px-4 border-b font-medium">${student.name}</td>
        <td class="py-2 px-4 border-b">₹${student.totalFees}</td>
        <td class="py-2 px-4 border-b text-green-600">₹${paid}</td>
        <td class="py-2 px-4 border-b text-red-600">₹${remaining}</td>
        <td class="py-2 px-4 border-b">
          <span class="badge ${remaining === 0 ? 'badge-success' : 'badge-warning'}">
            ${remaining === 0 ? 'Paid' : 'Pending'}
          </span>
        </td>
        <td class="py-2 px-4 border-b">
          <button onclick="recordPayment('${student.id}')" class="btn-success px-3 py-1 rounded text-sm">
            Record Payment
          </button>
        </td>
      `;
      feesTable.appendChild(row);
    });
  }
}

function recordPayment(studentId) {
  const amount = prompt('Enter payment amount:');
  if (!amount || isNaN(amount)) return;
  
  const feePayments = JSON.parse(localStorage.getItem('feePayments')) || [];
  
  const newPayment = {
    id: feePayments.length + 1,
    studentId: studentId,
    amount: parseFloat(amount),
    date: new Date().toISOString().split('T')[0],
    notes: 'Payment recorded by admin'
  };
  
  feePayments.push(newPayment);
  localStorage.setItem('feePayments', JSON.stringify(feePayments));
  
  loadAdminFees();
  loadAdminStats();
  
  alert('Payment recorded successfully!');
}

function loadStudentAnnouncements(medium, standard) {
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const announcementsList = document.getElementById('announcements-list');
  
  if (!announcementsList) return;
  
  announcementsList.innerHTML = '';
  
  const filteredAnnouncements = announcements.filter(ann => 
    (ann.medium === 'all' || ann.medium === medium) && 
    (ann.standard === 'all' || ann.standard == standard)
  );
  
  if (filteredAnnouncements.length === 0) {
    announcementsList.innerHTML = '<li class="py-3">No announcements available</li>';
    return;
  }
  
  filteredAnnouncements.forEach(announcement => {
    const li = document.createElement('li');
    li.className = 'py-3';
    li.innerHTML = `
      <div class="flex items-start">
        <i class="fas fa-${announcement.type === 'notice' ? 'exclamation-triangle text-yellow-500' : 'bullhorn text-blue-500'} mt-1 mr-3"></i>
        <div>
          <h4 class="font-semibold text-sm">${announcement.title}</h4>
          <p class="text-xs text-gray-600 mt-1">${announcement.content}</p>
          <p class="text-xs text-gray-400 mt-1">${announcement.date}</p>
        </div>
      </div>
    `;
    announcementsList.appendChild(li);
  });
}

function loadStudentHomework(medium, standard) {
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  const homeworkList = document.getElementById('homework-list');
  
  if (!homeworkList) return;
  
  homeworkList.innerHTML = '';
  
  const filteredHomeworks = homeworks.filter(hw => 
    hw.medium === medium && hw.standard == standard
  );
  
  if (filteredHomeworks.length === 0) {
    homeworkList.innerHTML = '<li class="py-3">No homework assigned</li>';
    return;
  }
  
  filteredHomeworks.forEach(homework => {
    const li = document.createElement('li');
    li.className = 'py-3';
    li.innerHTML = `
      <div class="flex items-start">
        <i class="fas fa-book text-green-500 mt-1 mr-3"></i>
        <div>
          <h4 class="font-semibold text-sm">${homework.subject}</h4>
          <p class="text-xs text-gray-600 mt-1">${homework.description}</p>
          <p class="text-xs text-red-500 mt-1">Due: ${homework.dueDate}</p>
        </div>
      </div>
    `;
    homeworkList.appendChild(li);
  });
}

function loadStudentTestMarks(studentId) {
  const testMarks = JSON.parse(localStorage.getItem('testMarks')) || [];
  const testMarksTable = document.getElementById('test-marks-table');
  
  if (!testMarksTable) return;
  
  testMarksTable.innerHTML = '';
  
  const studentMarks = testMarks.filter(tm => tm.studentId === studentId);
  
  if (studentMarks.length === 0) {
    testMarksTable.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">No test marks available</td></tr>';
    return;
  }
  
  studentMarks.forEach(mark => {
    const progress = mark.marks >= 80 ? 'bg-green-500' : mark.marks >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${mark.subject}</td>
      <td class="py-2 px-4 border-b font-semibold">${mark.marks}/100</td>
      <td class="py-2 px-4 border-b">${mark.date}</td>
      <td class="py-2 px-4 border-b">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="${progress} h-2 rounded-full" style="width: ${mark.marks}%"></div>
        </div>
      </td>
    `;
    testMarksTable.appendChild(row);
  });
}

function loadStudentFees(studentId) {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const feePayments = JSON.parse(localStorage.getItem('feePayments')) || [];
  
  const student = students.find(s => s.id === studentId);
  if (!student) return;
  
  const studentPayments = feePayments.filter(fp => fp.studentId === studentId);
  const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = student.totalFees - totalPaid;
  const progressPercentage = student.totalFees > 0 ? Math.round((totalPaid / student.totalFees) * 100) : 0;
  
  // Update fee elements
  const totalFeesEl = document.getElementById('total-fees');
  const paidFeesEl = document.getElementById('paid-fees');
  const remainingFeesEl = document.getElementById('remaining-fees');
  const feesStatusEl = document.getElementById('fees-status');
  const feesProgressBarEl = document.getElementById('fees-progress-bar');
  
  if (totalFeesEl) totalFeesEl.textContent = `₹${student.totalFees}`;
  if (paidFeesEl) paidFeesEl.textContent = `₹${totalPaid}`;
  if (remainingFeesEl) remainingFeesEl.textContent = `₹${remaining}`;
  
  if (feesProgressBarEl) feesProgressBarEl.style.width = `${progressPercentage}%`;
  
  if (feesStatusEl) {
    if (remaining === 0) {
      feesStatusEl.className = 'badge badge-success';
      feesStatusEl.textContent = 'Fully Paid';
    } else if (remaining === student.totalFees) {
      feesStatusEl.className = 'badge badge-danger';
      feesStatusEl.textContent = 'Unpaid';
    } else {
      feesStatusEl.className = 'badge badge-warning';
      feesStatusEl.textContent = 'Partially Paid';
    }
  }
}

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  showLanding();
}

// Tab switching
function switchTab(tabType) {
  if (tabType === 'student') {
    document.getElementById('student-tab').classList.add('active');
    document.getElementById('admin-tab').classList.remove('active');
    document.getElementById('student-login-form').classList.remove('hidden');
    document.getElementById('admin-login-form').classList.add('hidden');
  } else {
    document.getElementById('student-tab').classList.remove('active');
    document.getElementById('admin-tab').classList.add('active');
    document.getElementById('student-login-form').classList.add('hidden');
    document.getElementById('admin-login-form').classList.remove('hidden');
  }
}

// Check if user is already logged in
function checkLoggedInStatus() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    currentUser = user;
    if (user.type === 'student') {
      const students = JSON.parse(localStorage.getItem('students')) || [];
      const student = students.find(s => s.id === user.id);
      
      if (student) {
        showLogin(); // For now, just show login
      } else {
        logout();
      }
    } else {
      showLogin(); // For now, just show login
    }
  }
}

// Initialize on page load
window.onload = function() {
  initializeData();
  checkLoggedInStatus();
};

// Handle unified login
function handleUnifiedLogin() {
  event.preventDefault();
  
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  
  // Check if it's admin login
  if (username === 'shree_admin_2025' && password === 'Shree@Classes#2025!Dada') {
    localStorage.setItem('currentUser', JSON.stringify({
      type: 'admin',
      id: 'shree_admin_2025'
    }));
    showAdminDashboard();
    loadAdminData();
    return false;
  }
  
  // Check if it's teacher login
  const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
  const teacher = teachers.find(t => t.username === username && t.password === password);
  
  if (teacher) {
    if (teacher.status !== 'approved') {
      showLoginError('Your teacher account is pending admin approval.');
      return false;
    }
    
    localStorage.setItem('currentUser', JSON.stringify({
      type: 'teacher',
      id: teacher.id
    }));
    showTeacherDashboard();
    loadTeacherData(teacher);
    return false;
  }
  
  // Check if it's student login
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const student = students.find(s => (s.username === username || s.id === username) && s.password === password);
  
  if (student) {
    if (student.status !== 'approved') {
      showLoginError('Your account is pending admin approval.');
      return false;
    }
    
    localStorage.setItem('currentUser', JSON.stringify({
      type: 'student',
      id: student.id
    }));
    showStudentDashboard();
    loadStudentData(student);
  } else {
    showLoginError('Invalid username or password');
  }
  
  return false;
}

// Handle access request
function handleAccessRequest() {
  event.preventDefault();
  
  const username = document.getElementById('request-username').value.trim();
  const name = document.getElementById('request-name').value.trim();
  const accessRequest = document.getElementById('request-access').value;
  
  // Validation
  if (!username || username.length < 3) {
    showLoginError('Username must be at least 3 characters long');
    return false;
  }
  
  if (!name) {
    showLoginError('Please enter your full name');
    return false;
  }
  
  if (!accessRequest) {
    showLoginError('Please select an access request type');
    return false;
  }
  
  // Check if username already exists
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  
  if (students.find(s => s.username === username) || requests.find(r => r.username === username)) {
    showLoginError('Username already exists. Please choose another.');
    return false;
  }
  
  // Generate unique request ID
  const requestId = 'req' + (requests.length + 1);
  
  // Create new request
  const newRequest = {
    id: requestId,
    username: username,
    name: name,
    accessRequest: accessRequest,
    requestDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  
  // Add to requests array
  requests.push(newRequest);
  localStorage.setItem('studentRequests', JSON.stringify(requests));
  
  // Show success message
  showLoginSuccess('Your access request has been submitted successfully! Admin will review and approve your request.');
  
  // Clear form
  document.getElementById('request-username').value = '';
  document.getElementById('request-name').value = '';
  document.getElementById('request-access').value = 'new';
  
  // Redirect to login after delay
  setTimeout(() => {
    showLoginForm();
  }, 3000);
  
  return false;
}

// Handle signup step 1 - Completely rewritten
function handleSignupStep1() {
  // Get all form values
  const name = document.getElementById('student-name').value.trim();
  const username = document.getElementById('student-username').value.trim();
  const password = document.getElementById('student-password').value;
  const accessRequest = document.getElementById('student-access-request').value;
  
  // Clear any previous errors
  hideSignupError();
  
  // Basic validation
  if (!name) {
    showSignupError('Please enter your name');
    return false;
  }
  
  if (!username) {
    showSignupError('Please enter a username');
    return false;
  }
  
  if (!password || password.length < 6) {
    showSignupError('Password must be at least 6 characters long');
    return false;
  }
  
  if (!accessRequest) {
    showSignupError('Please select an access request type');
    return false;
  }
  
  // Check username uniqueness
  const students = JSON.parse(localStorage.getItem('students')) || [];
  if (students.find(s => s.username === username)) {
    showSignupError('Username already exists. Please choose another.');
    return false;
  }
  
  // Store data and proceed
  tempSignupData = { name, username, password, accessRequest };
  
  // Go directly to step 3
  document.getElementById('signup-step-1').classList.add('hidden');
  document.getElementById('signup-step-2').classList.add('hidden');
  document.getElementById('signup-step-3').classList.remove('hidden');
  
  return false;
}

function hideSignupError() {
  const errorDiv = document.getElementById('signup-error');
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
}

// Handle OTP verification
function handleOTPVerification() {
  const enteredOTP = document.getElementById('otp-code').value;
  
  if (enteredOTP === generatedOTP) {
    // OTP verified, move to step 3
    document.getElementById('signup-step-2').classList.add('hidden');
    document.getElementById('signup-step-3').classList.remove('hidden');
    showSignupSuccess('Mobile number verified! Please complete your profile.');
  } else {
    showSignupError('Invalid OTP. Please try again.');
  }
  
  return false;
}

// Handle additional information
function handleAdditionalInfo() {
  const medium = document.getElementById('student-medium').value;
  const standard = document.getElementById('student-standard').value;
  const fatherName = document.getElementById('student-father-name').value.trim();
  const address = document.getElementById('student-address').value.trim();
  
  // Get existing student requests
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  
  // Generate unique request ID
  const requestId = 'req' + (requests.length + 1);
  
  // Create new student request
  const newRequest = {
    id: requestId,
    name: tempSignupData.name,
    username: tempSignupData.username,
    password: tempSignupData.password,
    accessRequest: tempSignupData.accessRequest,
    medium: medium,
    standard: parseInt(standard),
    fatherName: fatherName,
    address: address,
    totalFees: medium === 'english' ? 12000 : 10000,
    requestDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  
  // Add to requests array
  requests.push(newRequest);
  localStorage.setItem('studentRequests', JSON.stringify(requests));
  
  // Show success message
  showSignupSuccess('Your registration request has been sent to admin for approval! You will be notified once approved.');
  
  // Clear temporary data
  tempSignupData = {};
  generatedOTP = null;
  
  // Reset form
  document.getElementById('additional-info-form').reset();
  
  // Redirect to login after 3 seconds
  setTimeout(() => {
    showLogin();
  }, 3000);
  
  return false;
}

// Resend OTP
function resendOTP() {
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  alert(`New OTP sent: ${generatedOTP}\n\nIn production, this would be sent to your mobile number.`);
  showSignupSuccess('OTP resent successfully!');
}

// Go back to step 1
function goBackToStep1() {
  document.getElementById('signup-step-2').classList.add('hidden');
  document.getElementById('signup-step-1').classList.remove('hidden');
  generatedOTP = null;
}

// Handle signup (old function - kept for compatibility)
function handleSignup() {
  return handleSignupStep1();
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById('login-error');
  const errorMsg = document.getElementById('error-message');
  
  errorMsg.textContent = message;
  errorDiv.classList.remove('hidden');
  
  setTimeout(() => {
    errorDiv.classList.add('hidden');
  }, 3000);
}

// Show signup error
function showSignupError(message) {
  const errorDiv = document.getElementById('signup-error');
  const errorMsg = document.getElementById('signup-error-message');
  
  errorMsg.textContent = message;
  errorDiv.classList.remove('hidden');
  
  document.getElementById('signup-success').classList.add('hidden');
  
  setTimeout(() => {
    errorDiv.classList.add('hidden');
  }, 5000);
}

// Show signup success
function showSignupSuccess(message) {
  const successDiv = document.getElementById('signup-success');
  const successMsg = document.getElementById('signup-success-message');
  
  successMsg.textContent = message;
  successDiv.classList.remove('hidden');
  
  document.getElementById('signup-error').classList.add('hidden');
}

// Logout
function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  showPage('landing');
}

// Load student data
function loadStudentData(student) {
  document.getElementById('student-name').textContent = student.name;
  document.getElementById('medium-select').value = student.medium;
  updateStandardOptions();
  document.getElementById('standard-select').value = student.standard;
  loadAnnouncements(student);
  loadHomework(student);
  loadTestMarks(student);
  loadFees(student);
}

// Update standard options
function updateStandardOptions() {
  const medium = document.getElementById('medium-select').value;
  const standardSelect = document.getElementById('standard-select');
  
  standardSelect.innerHTML = '';
  
  if (medium === 'marathi') {
    for (let i = 3; i <= 10; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i}th Standard`;
      standardSelect.appendChild(option);
    }
  } else {
    for (let i = 8; i <= 10; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i}th Standard`;
      standardSelect.appendChild(option);
    }
  }
}

// Load announcements for student
function loadAnnouncements(student) {
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const announcementsList = document.getElementById('announcements-list');
  
  announcementsList.innerHTML = '';
  
  const relevantAnnouncements = announcements.filter(a => 
    (a.medium === 'all' || a.medium === student.medium) && 
    (a.standard === 'all' || parseInt(a.standard) === student.standard)
  );
  
  if (relevantAnnouncements.length === 0) {
    announcementsList.innerHTML = '<li class="py-3 text-gray-500">No announcements available for your class</li>';
    return;
  }
  
  relevantAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  relevantAnnouncements.forEach(announcement => {
    const li = document.createElement('li');
    li.className = 'py-3 border-b border-gray-100 last:border-b-0';
    li.innerHTML = `
      <div class="flex items-start">
        <i class="fas fa-bullhorn text-teal-custom mt-1 mr-3"></i>
        <div class="flex-1">
          <p class="font-semibold text-gray-800">${announcement.title}</p>
          <p class="text-gray-600 text-sm mt-1">${announcement.content}</p>
          <div class="flex items-center mt-2 text-xs text-gray-500">
            <span class="inline-block px-2 py-1 bg-teal-100 text-teal-800 rounded-full mr-2">
              ${announcement.medium === 'all' ? 'All Mediums' : announcement.medium.charAt(0).toUpperCase() + announcement.medium.slice(1)}
            </span>
            <span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full mr-2">
              ${announcement.standard === 'all' ? 'All Standards' : announcement.standard + 'th Standard'}
            </span>
            <span>Posted: ${formatDate(announcement.date)}</span>
          </div>
        </div>
      </div>
    `;
    announcementsList.appendChild(li);
  });
}

// Load homework for student
function loadHomework(student) {
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  const homeworkList = document.getElementById('homework-list');
  
  homeworkList.innerHTML = '';
  
  const relevantHomework = homeworks.filter(h => 
    h.medium === student.medium && 
    parseInt(h.standard) === student.standard
  );
  
  if (relevantHomework.length === 0) {
    homeworkList.innerHTML = '<li class="py-3 text-gray-500">No homework assigned for your class</li>';
    return;
  }
  
  relevantHomework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  relevantHomework.forEach(homework => {
    const today = new Date();
    const dueDate = new Date(homework.dueDate);
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    const isOverdue = daysLeft < 0;
    const isDueSoon = daysLeft <= 3 && daysLeft >= 0;
    
    const li = document.createElement('li');
    li.className = 'py-3 border-b border-gray-100 last:border-b-0';
    li.innerHTML = `
      <div class="flex items-start">
        <i class="fas fa-book text-yellow-custom mt-1 mr-3"></i>
        <div class="flex-1">
          <p class="font-semibold text-gray-800">${homework.subject}</p>
          <p class="text-gray-600 text-sm mt-1">${homework.description}</p>
          <div class="flex items-center mt-2 text-xs">
            <span class="inline-block px-2 py-1 ${
              isOverdue ? 'bg-red-100 text-red-800' : 
              isDueSoon ? 'bg-orange-100 text-orange-800' : 
              'bg-green-100 text-green-800'
            } rounded-full mr-2">
              ${isOverdue ? 'Overdue' : isDueSoon ? 'Due Soon' : 'On Time'}
            </span>
            <span class="text-gray-500">Due: ${formatDate(homework.dueDate)}</span>
            ${isOverdue ? `<span class="ml-2 text-red-600 font-semibold">${Math.abs(daysLeft)} days overdue</span>` : 
              isDueSoon ? `<span class="ml-2 text-orange-600 font-semibold">${daysLeft} days left</span>` : ''}
          </div>
        </div>
      </div>
    `;
    homeworkList.appendChild(li);
  });
}

// Load test marks for student
function loadTestMarks(student) {
  const testMarks = JSON.parse(localStorage.getItem('testMarks')) || [];
  const marksTable = document.getElementById('test-marks-table');
  
  marksTable.innerHTML = '';
  
  const studentMarks = testMarks.filter(mark => mark.studentId === student.id);
  
  if (studentMarks.length === 0) {
    marksTable.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">No test marks available for your class</td></tr>';
    return;
  }
  
  studentMarks.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  studentMarks.forEach(mark => {
    const row = document.createElement('tr');
    const grade = getGrade(mark.marks);
    const gradeColor = getGradeColor(mark.marks);
    
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-medium">${mark.subject}</td>
      <td class="py-2 px-4 border-b">
        <div class="flex items-center">
          <span class="font-bold mr-2">${mark.marks}/100</span>
          <span class="px-2 py-1 text-xs rounded-full ${gradeColor}">${grade}</span>
        </div>
      </td>
      <td class="py-2 px-4 border-b text-gray-600">${formatDate(mark.date)}</td>
      <td class="py-2 px-4 border-b">
        <div class="flex items-center">
          <div class="progress-bar w-20 mr-2">
            <div class="progress" style="width: ${mark.marks}%"></div>
          </div>
          <span class="text-xs text-gray-600">${mark.marks}%</span>
        </div>
      </td>
    `;
    marksTable.appendChild(row);
  });
}

// Helper functions
function getGrade(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
}

function getGradeColor(marks) {
  if (marks >= 90) return 'bg-green-100 text-green-800';
  if (marks >= 80) return 'bg-green-100 text-green-800';
  if (marks >= 70) return 'bg-blue-100 text-blue-800';
  if (marks >= 60) return 'bg-blue-100 text-blue-800';
  if (marks >= 50) return 'bg-yellow-100 text-yellow-800';
  if (marks >= 40) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Load fees for student
function loadFees(student) {
  const totalFees = student.totalFees;
  const paidFees = student.paidFees;
  const remainingFees = totalFees - paidFees;
  
  document.getElementById('total-fees').textContent = `₹${totalFees}`;
  document.getElementById('paid-fees').textContent = `₹${paidFees}`;
  document.getElementById('remaining-fees').textContent = `₹${remainingFees}`;
  
  const feesStatus = document.getElementById('fees-status');
  
  if (remainingFees === 0) {
    feesStatus.className = 'badge badge-success';
    feesStatus.textContent = 'Fully Paid';
  } else if (paidFees > 0) {
    feesStatus.className = 'badge badge-warning';
    feesStatus.textContent = 'Partially Paid';
  } else {
    feesStatus.className = 'badge badge-danger';
    feesStatus.textContent = 'Unpaid';
  }
}

// Load student dashboard
function loadStudentDashboard() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user && user.type === 'student') {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === user.id);
    if (student) {
      loadStudentData(student);
    }
  }
}

// Load admin dashboard
function loadAdminData() {
  populateStudentDropdowns();
  updateDashboardCounts();
  loadAdminDashboardData();
  showAdminSection('dashboard');
}

// Load admin dashboard
function loadAdminDashboard() {
  populateStudentDropdowns();
  updateDashboardCounts();
  loadAdminDashboardData();
}

// Show admin section
function showAdminSection(section) {
  const sections = document.querySelectorAll('.admin-section');
  sections.forEach(s => s.classList.add('hidden'));
  
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  
  document.getElementById(`admin-section-${section}`).classList.remove('hidden');
  event.currentTarget.classList.add('active');
  
  switch(section) {
    case 'announcements':
      loadAdminAnnouncements();
      break;
    case 'students':
      loadAdminStudents();
      break;
  }
}

// Load admin dashboard data
function loadAdminDashboardData() {
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const recentAnnouncementsList = document.getElementById('admin-recent-announcements');
  
  recentAnnouncementsList.innerHTML = '';
  
  if (announcements.length === 0) {
    recentAnnouncementsList.innerHTML = '<li class="py-3">No recent announcements</li>';
  } else {
    const recentAnnouncements = announcements.slice(0, 5);
    recentAnnouncements.forEach(announcement => {
      const li = document.createElement('li');
      li.className = 'py-3';
      li.innerHTML = `
        <p class="font-semibold">${announcement.title}</p>
        <p class="text-gray-600">${announcement.content}</p>
        <p class="text-sm text-gray-500 mt-1">Posted on: ${formatDate(announcement.date)}</p>
      `;
      recentAnnouncementsList.appendChild(li);
    });
  }
  
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  const recentHomeworkList = document.getElementById('admin-recent-homework');
  
  recentHomeworkList.innerHTML = '';
  
  if (homeworks.length === 0) {
    recentHomeworkList.innerHTML = '<li class="py-3">No recent homework</li>';
  } else {
    const recentHomework = homeworks.slice(0, 5);
    recentHomework.forEach(homework => {
      const li = document.createElement('li');
      li.className = 'py-3';
      li.innerHTML = `
        <p class="font-semibold">${homework.subject} (${homework.medium}, ${homework.standard}th)</p>
        <p class="text-gray-600">${homework.description}</p>
        <p class="text-sm text-gray-500 mt-1">Due date: ${formatDate(homework.dueDate)}</p>
      `;
      recentHomeworkList.appendChild(li);
    });
  }
}

// Update dashboard counts
function updateDashboardCounts() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const testMarks = JSON.parse(localStorage.getItem('testMarks')) || [];
  const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  
  document.getElementById('total-students-count').textContent = students.length;
  document.getElementById('tests-count').textContent = testMarks.length;
  document.getElementById('homework-count').textContent = homeworks.length;
  document.getElementById('announcements-count').textContent = announcements.length;
}

// Populate student dropdowns
function populateStudentDropdowns() {
  // This would be used for test marks and fees management
  // Implement as needed
}

// Load admin announcements
function loadAdminAnnouncements() {
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  const announcementsTable = document.getElementById('announcements-table');
  
  announcementsTable.innerHTML = '';
  
  if (announcements.length === 0) {
    announcementsTable.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-gray-500">No announcements available</td></tr>';
    return;
  }
  
  announcements.forEach(announcement => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${announcement.title}</td>
      <td class="py-2 px-4 border-b">${announcement.content}</td>
      <td class="py-2 px-4 border-b">${announcement.medium}</td>
      <td class="py-2 px-4 border-b">${announcement.standard}</td>
      <td class="py-2 px-4 border-b">${formatDate(announcement.date)}</td>
      <td class="py-2 px-4 border-b">
        <button onclick="deleteAnnouncement(${announcement.id})" class="text-red-600 hover:text-red-800">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    announcementsTable.appendChild(row);
  });
}

// Load admin students with enhanced features
function loadAdminStudents() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  const studentsTable = document.getElementById('students-table');
  
  if (!studentsTable) return;
  
  studentsTable.innerHTML = '';
  
  if (students.length === 0) {
    studentsTable.innerHTML = '<tr><td colspan="10" class="py-4 text-center text-gray-500">No students available</td></tr>';
    return;
  }
  
  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-mono text-xs">${student.id}</td>
      <td class="py-2 px-4 border-b font-medium">${student.name}</td>
      <td class="py-2 px-4 border-b">
        <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">${student.username}</span>
      </td>
      <td class="py-2 px-4 border-b">
        <span class="font-mono text-sm bg-red-50 text-red-700 px-2 py-1 rounded">${student.password}</span>
      </td>
      <td class="py-2 px-4 border-b">${student.medium}</td>
      <td class="py-2 px-4 border-b">${student.standard}</td>
      <td class="py-2 px-4 border-b">₹${student.totalFees || 0}</td>
      <td class="py-2 px-4 border-b">₹${student.paidFees || 0}</td>
      <td class="py-2 px-4 border-b">
        <span class="badge ${student.status === 'approved' ? 'badge-success' : 'badge-warning'}">
          ${student.status}
        </span>
      </td>
      <td class="py-2 px-4 border-b">
        <button onclick="viewStudentDetails('${student.id}')" class="btn-info px-3 py-1 rounded text-sm mr-2">View</button>
        <button onclick="editStudent('${student.id}')" class="btn-warning px-3 py-1 rounded text-sm mr-2">Edit</button>
        <button onclick="resetStudentPassword('${student.id}')" class="btn-secondary px-3 py-1 rounded text-sm mr-2">Reset Password</button>
        <button onclick="deleteStudent('${student.id}')" class="btn-danger px-3 py-1 rounded text-sm">Delete</button>
      </td>
    `;
    studentsTable.appendChild(row);
  });
}

// Update admin student statistics
function updateAdminStudentStats() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const requests = JSON.parse(localStorage.getItem('studentRequests')) || [];
  
  const totalStudentsEl = document.getElementById('admin-students-count');
  const activeStudentsEl = document.getElementById('admin-active-students');
  const pendingStudentsEl = document.getElementById('admin-pending-students');
  const totalRevenueEl = document.getElementById('admin-total-revenue');
  
  if (totalStudentsEl) totalStudentsEl.textContent = students.length;
  if (activeStudentsEl) activeStudentsEl.textContent = students.filter(s => s.status === 'approved').length;
  if (pendingStudentsEl) pendingStudentsEl.textContent = requests.length;
  if (totalRevenueEl) {
    const totalRevenue = students.reduce((sum, student) => sum + (student.paidFees || 0), 0);
    totalRevenueEl.textContent = `₹${totalRevenue.toLocaleString()}`;
  }
}

// Export students data
function exportStudentsData() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const dataStr = JSON.stringify(students, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'students_data.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Print students list
function printStudentsList() {
  window.print();
}

// Edit student
function editStudent(studentId) {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const student = students.find(s => s.id === studentId);
  
  if (student) {
    const newName = prompt('Edit student name:', student.name);
    if (newName && newName.trim()) {
      student.name = newName.trim();
      localStorage.setItem('students', JSON.stringify(students));
      loadAdminStudents();
    }
  }
}

// Reset student password
function resetStudentPassword(studentId) {
  if (!confirm('Are you sure you want to reset this student\'s password?')) return;
  
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const student = students.find(s => s.id === studentId);
  
  if (student) {
    const newPassword = generateRandomPassword();
    student.password = newPassword;
    localStorage.setItem('students', JSON.stringify(students));
    
    alert(`Password reset successfully!\n\nStudent: ${student.name}\nNew Password: ${newPassword}\n\nPlease share this password with the student.`);
    loadAdminStudents();
  }
}

// Delete student
function deleteStudent(studentId) {
  if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
  
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const studentIndex = students.findIndex(s => s.id === studentId);
  
  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
    localStorage.setItem('students', JSON.stringify(students));
    loadAdminStudents();
    loadAdminStats();
  }
}

// Add announcement
function addAnnouncement() {
  const title = document.getElementById('announcement-title').value;
  const content = document.getElementById('announcement-content').value;
  const medium = document.getElementById('announcement-medium').value;
  const standard = document.getElementById('announcement-standard').value;
  
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  
  const newId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
  
  const newAnnouncement = {
    id: newId,
    title: title,
    content: content,
    medium: medium,
    standard: standard,
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString()
  };
  
  announcements.push(newAnnouncement);
  localStorage.setItem('announcements', JSON.stringify(announcements));
  
  showSuccessMessage('Announcement created successfully! Students can now see it.');
  
  document.getElementById('announcement-form').reset();
  
  loadAdminAnnouncements();
  updateDashboardCounts();
  loadAdminDashboardData();
  
  return false;
}

// Delete announcement
function deleteAnnouncement(id) {
  let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
  announcements = announcements.filter(announcement => announcement.id !== id);
  localStorage.setItem('announcements', JSON.stringify(announcements));
  
  loadAdminAnnouncements();
  updateDashboardCounts();
  loadAdminDashboardData();
}

// Search students
function searchStudents() {
  const searchTerm = document.getElementById('student-search').value.toLowerCase();
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const studentsTable = document.getElementById('students-table');
  
  studentsTable.innerHTML = '';
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm) ||
    student.username.toLowerCase().includes(searchTerm) ||
    student.mobile.includes(searchTerm) ||
    student.id.toLowerCase().includes(searchTerm)
  );
  
  if (filteredStudents.length === 0) {
    studentsTable.innerHTML = '<tr><td colspan="11" class="py-4 text-center text-gray-500">No students found</td></tr>';
    return;
  }
  
  filteredStudents.forEach(student => {
    const remaining = student.totalFees - student.paidFees;
    const status = remaining === 0 ? 
      '<span class="badge badge-success">Fully Paid</span>' : 
      remaining === student.totalFees ? 
        '<span class="badge badge-danger">Unpaid</span>' : 
        '<span class="badge badge-warning">Partially Paid</span>';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-4 border-b font-mono text-xs">${student.id}</td>
      <td class="py-2 px-4 border-b font-medium">${student.name}</td>
      <td class="py-2 px-4 border-b">
        <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">${student.username}</span>
      </td>
      <td class="py-2 px-4 border-b">
        <span class="font-mono text-sm bg-red-50 text-red-700 px-2 py-1 rounded">${student.password}</span>
      </td>
      <td class="py-2 px-4 border-b">${student.mobile}</td>
      <td class="py-2 px-4 border-b">
        <span class="px-2 py-1 text-xs rounded-full ${
          student.medium === 'marathi' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }">${student.medium.charAt(0).toUpperCase() + student.medium.slice(1)}</span>
      </td>
      <td class="py-2 px-4 border-b">${student.standard}th</td>
      <td class="py-2 px-4 border-b">₹${student.totalFees}</td>
      <td class="py-2 px-4 border-b">₹${student.paidFees}</td>
      <td class="py-2 px-4 border-b">${status}</td>
      <td class="py-2 px-4 border-b">
        <button onclick="viewStudentDetails('${student.id}')" class="text-blue-600 hover:text-blue-800 mr-2" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button onclick="resetStudentPassword('${student.id}')" class="text-orange-600 hover:text-orange-800 mr-2" title="Reset Password">
          <i class="fas fa-key"></i>
        </button>
        <button onclick="deleteStudent('${student.id}')" class="text-red-600 hover:text-red-800" title="Delete Student">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    studentsTable.appendChild(row);
  });
}

// View student details
function viewStudentDetails(studentId) {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const student = students.find(s => s.id === studentId);
  
  if (student) {
    const details = `
      Student Details:
      
      Name: ${student.name}
      Username: ${student.username}
      Password: ${student.password}
      Mobile: ${student.mobile}
      Medium: ${student.medium}
      Standard: ${student.standard}th
      Father's Name: ${student.fatherName}
      Address: ${student.address}
      Registration Date: ${student.registrationDate}
      Total Fees: ₹${student.totalFees}
      Paid Fees: ₹${student.paidFees}
      Remaining Fees: ₹${student.totalFees - student.paidFees}
      Status: ${student.status}
    `;
    
    alert(details);
  }
}

// Reset student password
function resetStudentPassword(studentId) {
  if (confirm('Are you sure you want to reset this student\'s password to "password123"?')) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
      students[studentIndex].password = 'password123';
      localStorage.setItem('students', JSON.stringify(students));
      showSuccessMessage('Password reset successfully! New password: password123');
      loadAdminStudents();
    }
  }
}

// Delete student
function deleteStudent(studentId) {
  if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(s => s.id !== studentId);
    localStorage.setItem('students', JSON.stringify(students));
    showSuccessMessage('Student deleted successfully');
    loadAdminStudents();
    updateDashboardCounts();
  }
}

// Export student data
function exportStudentData() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  
  let csvContent = "ID,Name,Username,Password,Mobile,Medium,Standard,Father's Name,Address,Registration Date,Total Fees,Paid Fees,Remaining Fees,Status\n";
  
  students.forEach(student => {
    csvContent += `${student.id},"${student.name}",${student.username},${student.password},${student.mobile},${student.medium},${student.standard},"${student.fatherName}","${student.address}",${student.registrationDate},${student.totalFees},${student.paidFees},${student.totalFees - student.paidFees},${student.status}\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'students_data.csv';
  a.click();
  window.URL.revokeObjectURL(url);
  
  showSuccessMessage('Student data exported successfully');
}

// Show success message
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
  successDiv.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-2"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

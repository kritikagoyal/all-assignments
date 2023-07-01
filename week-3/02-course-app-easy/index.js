const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username == admin.username && a.password == admin.password);
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
}

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(a => a.username == user.username && a.password == user.password);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.userId == admin.userId && a.password == admin.password);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists.' });
  } else {
    ADMINS.push(admin);
    res.status(200).json({ message: 'Admin created successfully' })
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.status(200).json({ message: 'User logged in successfully' });
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.status(200).json({ message: 'Course added successfully', courseId: course.id});
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.id);
  const course = COURSES.find(a => a.id == courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.status(200).json({ courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = {...req.body, purchasedCourses: []};
  USERS.push(user);
  res.json({ message: 'User created successfully' });
});

app.post('/users/login', userAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  COURSES.filter(c => c.published)
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
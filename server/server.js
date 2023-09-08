const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const dotenv = require('dotenv').config();

app.use(cors());
{
  
}
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database Connected'))
  .catch((error) => console.error('Database not connected', error));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check if the password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if the username or email is already in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user.' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Create a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to log in.' });
  }
});

// Protected Route (example)
app.get('/api/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route.' });
});

// Function to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: 'Access denied. Token is missing.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// Define your other routes and models here

// Example route: Interest Schema
const interestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  sharedActivities: [String],
  favors: [String],
});

const Interest = mongoose.model('Interest', interestSchema);

// Endpoint to submit interest
app.post('/api/interest', async (req, res) => {
  try {
    const interest = new Interest(req.body);
    console.log('Received interest data:', interest);
    await interest.save();
    console.log('Interest saved successfully');
    res.status(201).json({ message: 'Interest form submitted successfully.' });
  } catch (error) {
    console.error('Error saving interest:', error);
    res.status(500).json({ message: 'Failed to submit interest form.' });
  }
});

// Endpoint to fetch all interests
app.get('/api/highest-shared-activity-interest', async (req, res) => {
  try {
    const result = await Interest.findOne({})
      .sort({ sharedActivities: -1 })
      .limit(1)
      .exec();

    if (!result) {
      return res.status(404).json({ message: 'No interests found.' });
    }

    const highestSharedActivityInterest = {
      name: result.name,
      contact: result.contact,
      latitude: result.latitude,
      longitude: result.longitude,
      sharedActivities: result.sharedActivities,
      count: result.sharedActivities.length,
    };

    res.status(200).json(highestSharedActivityInterest);
  } catch (error) {
    console.error('Error fetching highest shared activity interest:', error);
    res.status(500).json({ message: 'Failed to fetch highest shared activity interest.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





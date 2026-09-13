require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const checkJWT = require('./middleware/checkJWT');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
const port = 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true, 
      useNewUrlParser: true
    });
  } catch (err) {
    console.error(err);
  }
}

connectDB();

// Handles all requests without requiring login
app.use('/api/account/', require('./routes/account'));
app.use('/api/refresh', require('./routes/refresh'));
app.use('/api/open/', require('./routes/open'));


// Handles all requests with requirement of login
app.use(checkJWT);
app.use('/api/secure/', require('./routes/secure'));
app.use('/api/admin/', require('./routes/admin'));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
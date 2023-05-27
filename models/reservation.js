const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  cnic: String,
  nationality: String,
  arrivalTime: String,
});

module.exports = mongoose.model('Reservation', reservationSchema);

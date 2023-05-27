const nodemailer = require('nodemailer');
const Reservation = require('../models/reservation');

exports.createReservation = async (req, res) => {
  const reservation = new Reservation(req.body);
  try {
    const savedReservation = await reservation.save();
    await sendConfirmationEmail(savedReservation);
    res.status(201).json(savedReservation);
  } catch (err) {
    res.status(500).json({ error: 'Error creating reservation' });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving reservations' });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving reservation' });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(updatedReservation);
  } catch (err) {
    res.status(500).json({ error: 'Error updating reservation' });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndRemove(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting reservation' });
  }
};

// Function to send confirmation email
async function sendConfirmationEmail(reservation) {
  try {
    // Configure nodemailer transporter using your email service provider settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose the email message
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: reservation.email,
      subject: 'Hotel Room Reservation Confirmation',
      text: `Dear ${reservation.firstName} ${reservation.lastName},
        Your room reservation has been confirmed. Details:
        - Arrival Time: ${reservation.arrivalTime}
        - Confirmation Code: ${reservation._id}

        Thank you for choosing our hotel. We look forward to your arrival.

        Best regards,
        Hotel Management`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.response);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

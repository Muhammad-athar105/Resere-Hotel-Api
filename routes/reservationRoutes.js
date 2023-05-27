const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/reserveHotel', reservationController.createReservation);
router.get('/view', reservationController.getReservations);
router.get('/view:id', reservationController.getReservationById);
router.put('/update:id', reservationController.updateReservation);
router.delete('/delete:id', reservationController.deleteReservation);

module.exports = router;

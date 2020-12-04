const express = require('express');
const router = express.Router();

const AppointmentController = require ('./controller');

router.post('/create', AppointmentController.createAppointment )
router.post('/update',AppointmentController.updateAppointment)
router.get('/get',AppointmentController.getAppointment)
router.get('/get/all',AppointmentController.getAllAppointments)
router.get('/getByUser',AppointmentController.getAppointmentByUser)



module.exports = router;

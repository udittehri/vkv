const { request } = require('express');
const express = require('express');
const router = express.Router();

const AuthRoutes = require('./../../services/auth');
const AppointmentRoutes = require('./../../services/appointments')
//New 

router.use('/auth', AuthRoutes)
router.use('/appointment', AppointmentRoutes)
// router.use('/user', UserRoutes)

// router.use('/leave', LeaveRoutes) //Apply Middleware token 
// router.use('/holiday', HolidayRoutes)



module.exports = router;

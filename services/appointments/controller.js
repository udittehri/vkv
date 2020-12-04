const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path').resolve;
const config = require(path('config/constants'));
const apiError = require('./../../common/api-errors');

const messages = require('./../../common/messages');
const ResponseService = require('./../../common/response');

const UserService = require('./../user/service')
const AppointmentServcice = require('./service');

// var getJwtAuthToken = getJwtAuthToken.bind(this);

class AppointmentController {
    createAppointment = async (req, res) => {
        try {
            let request = { ...req.body }

            // If no username provided, Throw error.
            if (!request.date) throw new apiError.ValidationError('username', messages.DATE_REQUIRED);

            // If no password provided, Throw unauthorized
            if (!request.message) throw new apiError.ValidationError('password', messages.MESSAGE_REQUIRED);

            if (!request.userID) throw new apiError.ValidationError('password', messages.USER_ID_REQUIRED);
            let User = await UserService.getUser({ _id: request.userID })

            let existingAppointment = await AppointmentServcice.getAppointment({ date: request.date, userID: request.userID })
            if (existingAppointment) throw new apiError.ValidationError('already',messages.APPOINTMENT_ALREADY_EXISIT)
            //Get User 
            let appointments = await AppointmentServcice.getAllAppointments({ date: request.date })

            let totalAppointments = appointments.length;
            console.log(totalAppointments);

            let criteria = {
                date: request.date,
                rx: request.message,
                userID: request.userID,
                appointmentNumber: `${request.date.split('-').join('')}-${totalAppointments + 1}`
            }

            let appointment = await AppointmentServcice.createAppointment(criteria)

            return res.status(200).send(ResponseService.success(appointment));
        }
        catch (err) {
            return res.status(err.code || 500).send(ResponseService.failure(err));
        }

    }


    async updateAppointment(req, res) {
        try {
            let request = Object.assign({}, req.body)
            //  , , password, , , , : aadhar-panCard, company: name-code ,,designation
            if (!request.userID) throw new apiError.ValidationError('password', messages.USER_ID_REQUIRED);
            if (!request.id) throw new apiError.ValidationError('password', messages.ID_INVALID);

            let existingAppointment = await AppointmentServcice.getAppointment({ _id: request.id, userID: request.userID })
            if (!existingAppointment) throw new apiError.ValidationError('already', messages.APPOINTMENT_NOT_FOUND)

            let id = request.userID
            delete request.userID

            let appointment = await AppointmentServcice.updateAppointment({ _id: id }, request)

            res.send(ResponseService.success(appointment));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));

        }

    }
    async getAllAppointments(req, res) {
        try {
            let request = { ...req.body };
            let query = { ...req.query }
            console.log(req.query);

            let existingAppointment = await AppointmentServcice.getAllAppointments({ date: query.date, status: 1 })

            res.send(ResponseService.success(existingAppointment));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));

        }

    }
    async getAppointment(req, res) {
        try {
            let request = { ...req.body };
            if (!request.id) throw new apiError.ValidationError('password', messages.ID_INVALID);

            let existingAppointment = await AppointmentServcice.getAppointment({ _id: request.id })
            if (!existingAppointment) throw new apiError.ValidationError('already', messages.APPOINTMENT_NOT_FOUND)

            res.send(ResponseService.success(existingAppointment));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));

        }

    }
    async getAppointmentByUser(req, res) {
        try {
            let request = { ...req.body }

            if (!request.userID) throw new apiError.ValidationError('user', messages.USER_ID_REQUIRED)
            // if (!request.date) throw new apiError.ValidationError ('user', messages.USER_ID_REQUIRED)
            let date = new Date().toLocaleDateString()
            console.log(request);
            let appointments = await AppointmentServcice.getOneAppointment({ date: request.date, userID: request.userID, status : 1  })
            console.log(appointments, "These are appointments ");
            res.send(ResponseService.success(appointments));

        }
        catch {

        }
    }

}

module.exports = new AppointmentController;

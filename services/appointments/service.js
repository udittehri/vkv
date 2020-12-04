const Appointment = require('./appointments');

class AppointmentService {

    getAppointment(request) {
        return Appointment.findOne(request);
    }
    getAllAppointments(request) {
        return Appointment.find(request);
    }
    getOneAppointment (request){
        return Appointment.findOne(request);
    }

    createAppointment(details) {
        return new Appointment(details).save();
    }

    updateAppointment(criteria, details) {
        return Appointment.findOneAndUpdate(criteria, details, { new: true })
    }

    // Delete User is To Update User with status Disabled 
}

module.exports = new AppointmentService();
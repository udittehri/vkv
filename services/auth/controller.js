const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path').resolve;
const config = require(path('config/constants'));
const apiError = require('./../../common/api-errors');

const messages = require('./../../common/messages');
const ResponseService = require('./../../common/response');
const UserService = require('./../user/service');

// var getJwtAuthToken = getJwtAuthToken.bind(this);

class AuthController {
    login = async (req, res) => {
        try {
            let request = { ...req.body }

            // If no username provided, Throw error.
            if (!request.contactNumber) throw new apiError.ValidationError('username', messages.CONTACT_REQUIRED);

            // If no password provided, Throw unauthorized
            if (!request.password) throw new apiError.ValidationError('password', messages.PASSWORD_REQUIRED);

            //Get User 
            let User = await UserService.getUser({ contactNumber: request.contactNumber })

            if (!User) throw new apiError.NotFoundError('User', messages.USERNAME_OR_PASSWORD_INVALID);

            if (User.status != 1) throw new apiError.NotFoundError('User', messages.USER_BLOCKED)

            let matchBcrypt = await bcrypt.compare(request.password, User.password);
            if (!matchBcrypt) throw new apiError.UnauthorizedError(messages.USERNAME_OR_PASSWORD_INVALID);

            //Remove Password 
            // console.log(User, 'This found !!', this);

            User.password = null;

            //Generate JWT Token 
            let token = await this.getJwtAuthToken(User)
            // let token =""
            let response = {
                token, User
            }
            return res.status(200).send(ResponseService.success(response));
        }
        catch (err) {
            return res.status(err.code || 500).send(ResponseService.failure(err));
        }

    }


    async register(req, res) {
        try {
            let details = Object.assign({}, req.body)
            //  , , password, , , , : aadhar-panCard, company: name-code ,,designation
            if (!details.contactNumber) throw new apiError.ValidationError('contactNumber', messages.CONTACT_REQUIRED)
            let userCheck = await UserService.getUser({ contactNumber: details.contactNumber })
            if (userCheck) throw new apiError.ResourceAlreadyExistError('contactNumber', messages.CONTACT_ALREADY_EXIST);

            if (!details.name) throw new apiError.ValidationError('Full Name', messages.NAME_REQUIRED);
            if (!details.contactNumber) throw new apiError.ValidationError('Contact Number', messages.CONTACT_REQUIRED);
            // if (!details.reportingTL) throw new apiError.ValidationError('Reporting TL',messages.TL_REQUIRED);
            if (!details.password) throw new apiError.ValidationError('Password', messages.PASSWORD_REQUIRED);

            var salt = await bcrypt.genSaltSync(10);
            var hash = await bcrypt.hashSync(details.password, salt);
            if (!hash) throw errorHandler.InternalServerError();
            details.password = hash;

            let user = await UserService.createUser(details);
            delete user.password;
            delete user.created_at;
            delete user.updated_at;

            res.send(ResponseService.success(user));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));

        }

    }
    async updatePassword(req, res) {
        try {
            let request = { ...req.body };
            if (!request._id) throw new apiError.ValidationError('Employee ID', messages.USER_ID_REQUIRED);
            if (!request.oldPassword) throw new apiError.ValidationError('Old Password', messages.PASSWORD_REQUIRED);
            let userCheck = await UserService.getUser({ employeeCode: request.employeeCode })
            if (!userCheck) throw new apiError.ValidationError('employeeCode', messages.INVALID_EMPCODE);

            var salt = await bcrypt.genSaltSync(10);
            var hash = await bcrypt.hashSync(request.newPassword, salt);
            if (!hash) throw errorHandler.InternalServerError();
            request.newPassword = hash;

            delete request.oldPassword;

            let updates = await UserService.updateUser({ employeeCode: request.employeeCode }, { password: request.newPassword })

            res.send(ResponseService.success({ updates }));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));

        }

    }
    async resetPassword(req, res) {


    }
    getJwtAuthToken = (user) => {
        // Create JWT auth signature
        let jwtTokenArgs = {
            id: user._id
        };

        // Generate and return jwt authentication token
        return jwt.sign(jwtTokenArgs, config.authSecretToken);
    }
}

module.exports = new AuthController;

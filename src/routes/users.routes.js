const {Router} = require('express');
const router = Router();

const {updateProfilePicture, getPersonalInformation} = require('../controllers/user.controller');

const {
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
} = require('./../middlewares');

const access = [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
]

router.route('/:userId')
    .get(access, getPersonalInformation)

router.route('/updateProfilePicture')
    .post(access, updateProfilePicture)

module.exports = router;
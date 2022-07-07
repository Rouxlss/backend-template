const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const User = require('../models/user.model');

userCrtl = {}

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
});

const upload = (location) => {
    return multer({
        storage: multerS3({
            s3,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            bucket: process.env.S3_BUCKET_NAME,
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                cb(null, location);
            }
        })
    })
}

userCrtl.getPersonalInformation = async (req, res) => {

    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            message: 'User id is required',
            error: true
        });
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(400).json({
            message: 'User not found',
            error: true
        });
    }

    const personalInformation = {
        name: user.name,
        number: user.userNumber,
        profilePicture: user.profilePicture,
        personalInformation: user.personalInformation
    }

    return res.status(200).json({
        message: 'User found',
        error: false,
        personalInformation
    });

}

userCrtl.updateProfilePicture = (req, res) => {

    const location = `users/${req.user_id}/profile_picture/${req.user_id}`;
    const uploadSingle = upload(location).single('image-upload');

    uploadSingle(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                message: 'Error uploading file',
                error: true
            });
        }

        const user = await User.findById(req.user_id);
        user.profilePicture = req.file.location;
        user.save();

        return res.status(200).json({
            message: 'File uploaded successfully',
            error: false,
            file: req.file.location
        });
    });

}

module.exports = userCrtl;
const express = require("express");
const router = express.Router();
const { asyncErrorHandler, handleValidationErrors } = require("../utils");
const { check, validationResult } = require("express-validator");
const { User } = require("../db/models")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getUserToken = require("../auth");


const validateUsername =
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a username");

const validateEmailAndPassword = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
];

router.post("/",
    validateUsername,
    validateEmailAndPassword,
    handleValidationErrors,
    asyncErrorHandler(async (req, res, next) => {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create( { username, email, hashedPassword });

        const token = getUserToken(user);
        res.status(201).json({
            user: { id: user.id },
            token,
        })
}));

module.exports = router;

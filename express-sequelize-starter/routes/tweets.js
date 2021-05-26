const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const db = require("../db/models")

const { Tweet } = db;

const asyncErrorHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next)

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    if (validationErrors) {
        const errors = validationErrors.array().map((error) => error.msg);
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }
    next();
};


router.get(
    "/",
    asyncErrorHandler(async (req, res) => {
        const allTweets = await Tweet.findAll();
        // res.send({ allTweets });
        res.json({ allTweets });
    })
);

router.get(
    "/:id(\\d+)",
    asyncErrorHandler(async (req, res, next) => {
        const tweetId = parseInt(req.params.id, 10);
        const singleTweet = await Tweet.findByPk(tweetId);
        if (singleTweet) {
            res.json({ singleTweet });
        } else {
            const tweetNotFoundError = (tweetId) => {
                const error = new Error("Tweet Not Found");
                error.status = 404;
                return error
            }
            next(tweetNotFoundError(tweetId));
        }
    })
)

router.post(
    "/",
    asyncErrorHandler(async (req, res) => {

    })
)



module.exports = router;

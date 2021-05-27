const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const db = require("../db/models")

const { Tweet } = db;

const asyncErrorHandler = (handler) => (req,res,next) => handler(req, res, next).catch(next)

const handleValidationErrors = (req,res,next) => {
    const validationErrors = validationResult(req);
    // console.log(validationErrors)
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => error.msg);
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }
    next();
};

const tweetValidator = [
    check("message")
        .exists({checkFalsy:true})
        .withMessage("Please provide a Tweet.")
        .isLength({max:280})
        .withMessage("Tweet too long.")
]

router.get(
    "/",
    asyncErrorHandler(async (req,res,next) => {
        const allTweets = await Tweet.findAll();
        // res.send({ allTweets });
        res.json({ allTweets });
    })
);

router.get(
    "/:id(\\d+)",
    asyncErrorHandler(async (req,res,next) => {
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
    tweetValidator,
    handleValidationErrors,
    asyncErrorHandler(async (req,res,next) => {
        const { message } = req.body
        const createTweet = await Tweet.create({message})
        res.send("Tweet Sent")
    })
)

router.put(
    "/:id(\\d+)",
    asyncErrorHandler(async(req,res,next) => {
        const tweetId = parseInt(req.params.id, 10);
        const singleTweet = await Tweet.findByPk(tweetId);
        if (singleTweet) {
            await singleTweet.update({message: req.body.message})
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

router.delete(
    "/:id(\\d+)",
    asyncErrorHandler(async(req,res,next) => {
        const tweetId = parseInt(req.params.id, 10);
        const singleTweet = await Tweet.findByPk(tweetId);
        if (singleTweet) {
            await singleTweet.destroy({message: req.body.message})
            res.status(204).end();
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


module.exports = router;

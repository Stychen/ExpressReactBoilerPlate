import express from 'express';


const router = express.Router();


/**
 * Home
 */

router.get("/", (req, res, next) => {
    console.log("[Debug] go to home");
    res.render("home", {
        context: {
            nothingHere: "hello"
        }
    });
});


/**
 * About
 */

router.get("/about", (req, res, next) => {
    res.render("about");
});


module.exports = router;
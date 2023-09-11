const router = require('express').Router()
const courses = require('../../db/courses.json')

// Axios post data to the database;
router.post('/', (req, res) => {
    const courses = req.body;
    res.send(courses.courseInfo)
})

router.get('/', (req, res) => {
    res.send(courses)
})

module.exports = router;
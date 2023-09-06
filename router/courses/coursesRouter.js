const router = require('express').Router()
const courses = require('../../db/courses.json')

router.get('/',(req,res)=>{
    res.send(courses)
})

module.exports = router;
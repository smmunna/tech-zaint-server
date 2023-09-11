const router = require('express').Router()
const con = require('../../db/connection');
const courses = require('../../db/courses.json')
const upload = require('../../components/uploadImage/uploadImage')

// All courses getting
router.get('/all', (req, res) => {
    try {
        const sql = `SELECT * FROM courses`
        con.query(sql, (err, result) => {
            if (err) throw err
            res.send(result)
        })
    } catch (error) {

    }
})

// Single course;
router.get('/:id',(req,res)=>{
    const id = req.params.id;
    try {
        const sql = `SELECT id, title, category, description, price, discount_price, rating, instructor, demo, thumbnail, total_time, content_preview FROM courses WHERE id= ?`
        con.query(sql,[id],(err,result)=>{
            if(err) throw err
            res.send(result)
        })
    } catch (error) {
        
    }
})


// Axios post data to the database;
router.post('/', upload.single("thumbnail"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    const courses = req.body;

    const {
        title,
        category,
        description,
        price,
        discount_price,
        rating,
        instructor,
        demo,
        total_time,
        content_preview
    } = courses

    const thumbnail = "http://localhost:3000/" + req.file.path.replace("\\", "/");

    try {
        const sql = `INSERT INTO courses( title, category, description, price, discount_price, rating, instructor, demo, thumbnail, total_time,content_preview) 
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        con.query(sql, [
            title,
            category,
            description,
            price,
            discount_price,
            rating,
            instructor,
            demo,
            thumbnail,
            total_time,
            content_preview
        ],
            (err, result) => {
                if (err) throw err;
                res.send({ status: 'ok' })
            }
        )

    } catch (error) {
        res.send(error.message)
    }

})

// for testing purpose;
router.get('/', (req, res) => {
    res.send(courses)
})

module.exports = router;
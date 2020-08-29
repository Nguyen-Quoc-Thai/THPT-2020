const express = require('express')
const pug = require('pug')

const { provinces_1, provinces_2 } = require('./utils')
const { writeToFile } = require('./fetchData')

const port = 8080

const app = express()

// Public folder
app.use(express.static('public'))

// Body parser
app.use(express.urlencoded())
app.use(express.json())

// Template engine PUG
app.set('view engine', 'pug')
app.set('views', './views')

// Homepage
app.get('/', function (req, res) {
    res.render('Home/index', {provinces_1, provinces_2})
})

// Request export
app.post('/export', function (req, res) {

    const {provCode, limit} = req.body

    if (limit) writeToFile( +provCode, +limit)
    else writeToFile( +provCode )

    res.redirect('/')
})

app.listen(port, () => console.log(`Server is listening at port: ${port}`))
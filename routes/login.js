const express = require ('express')
const router = express.Router()

const staticuser = require('../user.json')

router.post('../login', (req, res) => {
    res.send('HAI')
})

module.exports = router
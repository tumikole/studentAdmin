const express = require('express')
const app = express()
const {authenticationRoutes} = require('./routes/Auth')
const {allRoutes} = require('./routes/Routes')

const port = 4001

app.use(express.json())

authenticationRoutes(app)
allRoutes(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
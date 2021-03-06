const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const {JSDOM} = require('jsdom')
const jsdom = new JSDOM('<!DOCTYPE html>')

const {window} = jsdom
const {document} = window

global.window = window
global.document = document

const $ = (global.jQuery = require('jquery'))

console.log(`jQuery ${jQuery.fn.jquery} working! Yay!!!`)

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
)
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

module.exports = app

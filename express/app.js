"use strict"

const express = require('express'),
      bodyParser = require('body-parser'),
      path = require('path'),
      MAusSchema = require('./models/MAus_mango_model'),
      mongoose = require('mongoose'),
      handlebars = require('handlebars'),
      nodemailer = require('nodemailer'),
      fs = require('fs'),
      moment = require('moment-timezone')


moment.tz.setDefault("America/New_York");

const subPath = '/public/MAus'
const webPage = '/feedback.html'
const thankYou = '/thankyou.html'
const emailFile = '/emailTemplates/MAus/feedbackEmailTemplate.html'
const emailTemplate = path.join(__dirname,emailFile)
const date = new Date()


const app = express()

var newFeedback

var currentDateTime
var applicationUrl
var customProperty
var application
var language
var tenantId
var businessSegmentName
var userSsoId
var category
var comments
var ratingContent
var ratingUsability
var ratingOverall
var visitingReason
var recommend
var emailAddress
var feedbackContact
    
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

mongoose.Promise = Promise

//Connect to the database
console.log("(" + moment().format('MMMM Do YYYY, h:mm:ss a') + ' ' + moment.tz('America/New_York').zoneAbbr() + 
    ") Attempting to connect to MONGODB")

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
    .then(() => {
        console.log("Was able to connect to the Mongo database!")
    })
    .catch((err) => {
        console.log("Failed to connect to the mongodb database: \n", err)
        return 110
    })


// Tell bodyParser midleware to assemble the express packets into a JSON structure
app.use(bodyParser.json())

// __dirname should be "/usr/src/app"
const publicDir = path.join(__dirname,subPath);

// Route to handle a request to display the "Thank You!" page
app.get('/MAus/ThankYou/', (req, res) => {
    console.log("Got request for thank you page")
    res.sendFile(publicDir + thankYou)
})

// Route that will get the request to display the feedback form
app.get('/Maus/', (req, res) => {
    console.log("Got request for a feedback form at route /MAus/")
    res.sendFile(publicDir + webPage)
})

// Route that will receive the customer answers as JSON

app.post('/MAus', (req, res) => {
    applicationUrl = req.body.applicationUrl
    customProperty = req.body.customProperty
    application = req.body.application
    language = req.body.language
    tenantId = req.body.tenantId
    businessSegmentName = req.body.businessSegmentName
    userSsoId = req.body.userSsoId
    category = req.body.category
    comments = req.body.comments
    ratingContent = req.body.ratingContent
    ratingUsability = req.body.ratingUsability
    ratingOverall = req.body.ratingOverall
    visitingReason = req.body.visitingReason
    recommend = req.body.recommend
    emailAddress = req.body.emailAddress
    feedbackContact = req.body.feedbackContact

    var returnData = {
        error: false,
        exceptionMessage: {
            details: ""
        }
    }

    console.log("Received the feedback!")
    console.log(req.body)

    currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a') + ' ' + moment.tz('America/New_York').zoneAbbr()

    // Create a database record in the "MAus" Mango collection using the MAusSchema
    newFeedback = {applicationUrl, customProperty, application, language, tenantId,
                        businessSegmentName, userSsoId, category, comments, 
                        ratingContent, ratingUsability, ratingOverall, visitingReason, 
                        recommend, emailAddress, feedbackContact}
    
    MAusSchema.create(
        newFeedback, function(err, theFeedback) {
            if (err) {
                var errorMsg = "Couldn't add the feedback to the database"
                console.log(errorMsg)
                console.log(err)
                returnData.error.exceptionMessage = errorMsg
            } else {
                console.log("Feedback sucessfully added to the database")
                sendEmail()
            }
        }
    )

    res.send({returnData})
})

// Set up the MyAccounts Canada English feedback route
app.get('/MAcaneng', (req, res) => {
    res.send('Hello from the MyAccounts Canadian English route!')
})

// Set up the MyAccounts Canada French feedback route
app.get('/MAcanfr', (req, res) => {
    res.send('Hello from the MyAccounts Canadian French route!')
})


function sendEmail() {
        fs.readFile(emailTemplate, function (err, data) {
            if (err) {
                var errorMsg = "Couldn't format the email template"
                console.log(errorMsg)
                console.log(err)
                returnData.error.exceptionMessage = errorMsg
            } else {
                console.log("Was able to render the email template")
                console.log("currentDateTime: " + currentDateTime)

                let templateVariables = {
                    currentDateTime,
                    applicationUrl,
                    customProperty,
                    application,
                    language,
                    tenantId,
                    businessSegmentName,
                    userSsoId,
                    category,
                    comments,
                    ratingContent,
                    ratingUsability,
                    ratingOverall,
                    visitingReason,
                    recommend,
                    emailAddress,
                    feedbackContact
                }

                console.log("Template variables being passed into handlebars:\n", templateVariables)

                var template = handlebars.compile(data.toString())
                var emailText = template(templateVariables)


                //var emailText = template.render(data.toString(), newFeedback)

                // Now send the email
                const mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to: process.env.EMAIL_TO,
                    subject: 'Feedback received for MyAccounts US on ' + moment().format('MMMM Do YYYY, h:mm:ss a') + ' ' + moment.tz('America/New_York').zoneAbbr(),
                    html: emailText,
                    replyTo: process.env.EMAIL_REPLYTO
                }

                // Requesting that an email be sent. This will be done asynchronously
                transporter.sendMail(mailOptions, function (err, res) {
                    if (err) {
                        console.log("There was an error sending the email:\n", err)
                    } else {
                        console.log("Here is the response for a successful email send:\n", res)
                    }
                })
            }
        })
}

app.listen(process.env.EXPRESS_PORT, err => {
    if (err) {
        console.log('Couldn\'t connect to express server!')
        return 1
    }
    console.log('Express server is listening on port ' + process.env.EXPRESS_PORT)
})
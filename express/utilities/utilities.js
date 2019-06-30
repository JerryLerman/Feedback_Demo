moment = require('moment')

function writeLog(logEntry, logEntry1) {
    if (!logEntry1) {
        logEntry1=""
    }
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a') + ' ' + moment.tz('America/New_York').zoneAbbr() + ": ",
        logEntry, logEntry1)
}

module.exports = writeLog
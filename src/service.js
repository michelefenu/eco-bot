//module service.js

const https = require("https");
const moment = require('moment');
const tz = require('moment-timezone');

let cityData = "";
let url = "";

const loadCityData = function () {

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'Development')
            url = `https://firebasestorage.googleapis.com/v0/b/eco-bot-data.appspot.com/o/${process.env.CITY_CODE}-dev.json?alt=media`;
        else if (process.env.NODE_ENV === 'Integration')
            url = `https://firebasestorage.googleapis.com/v0/b/eco-bot-data.appspot.com/o/${process.env.CITY_CODE}-int.json?alt=media`;
        else
            url = `https://firebasestorage.googleapis.com/v0/b/eco-bot-data.appspot.com/o/${process.env.CITY_CODE}.json?alt=media`;

        https.get(url, res => {
            res.setEncoding("utf8");

            let body = "";

            res.on("data", data => {
                body += data;
            });

            res.on("end", () => {
                cityData = JSON.parse(body);
                resolve(cityData);
            });
        });
    });
}

const getCityName = function () {
    return cityData.Name;
}

const getCityCode = function () {
    return cityData.Code;
}

const getCollectionInfo = function () {
    return cityData.CollectionInfo;
}

const getEcocentro = function () {
    return cityData.Ecocentro;
}

const getIngombranti = function () {
    return cityData.Ingombranti;
}

const getSpeciali = function () {
    return cityData.Speciali;
}

const getTomorrowSchedule = function () {
    return getScheduleForDayOffset();
}

/**
 * Returns the material that will be collected aftert 6AM on the day offset specified day as a parameter
 *
 * 0 = tomorrow, 1 = tomorrow + 1 day, 2 = tomorrow + 3 days...
 *
 * Default: tomorrow
 */
const getScheduleForDayOffset = function (offset) {
    offset = offset || 0;

    let calendar = cityData.Calendar;

    let currentTime = moment().tz("Europe/Rome").locale('it');

    // We add 18 hours rather than 24 for tomorrow because the "day" starts at 6AM
    currentTime.add(18, 'h').add(offset, 'd');

    let dayInfo = calendar[currentTime.format('YYYY')][currentTime.format('MM')][currentTime.format('DD')];

    return dayInfo;
}

/**
 * Returns the collection calendar for the next n days
 *
 * Default: 7 days
 */
const getCalendar = function (offset) {
    offset = offset || 7;

    let currentTime = moment().tz("Europe/Rome").locale('it');

    let calendarInfo = [];
    for (let i = 0; i < offset; i++) {
        calendarInfo.push(getScheduleForDayOffset(i));
        currentTime.add(1, 'd');
    }

    return calendarInfo;
}

const getCityData = function () {
    return cityData;
}

module.exports = {
    getCityName,
    getCityCode,
    getCityData,
    getCollectionInfo,
    getEcocentro,
    getIngombranti,
    getSpeciali,
    getTomorrowSchedule,
    getCalendar,
    loadCityData,
}

//module bot.js

const TelegramBotClient = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const https = require("https");
const moment = require('moment');

dotenv.config({ silent: true });

const url = `https://firebasestorage.googleapis.com/v0/b/eco-bot-data.appspot.com/o/${process.env.CODICE_COMUNE}.json?alt=media`;

let municipalityData = "";

https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
    });
    res.on("end", () => {
        municipalityData = JSON.parse(body);
    });
});

const bot = new TelegramBotClient(
    process.env.BOT_TOKEN,
    {
        polling: true,
        onlyFirstMatch: true,
    });

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `Ciao, sono EcoBot, ti posso dare informazioni sulla raccolta differenziata nel comune di ${municipalityData.Name}\n\nProva a scrivermi /domani per sapere che materiale verrà ritirato domani o /calendario per avere il calendario della raccolta per i prossimi sette giorni\n\n_Nota_: sono un bot *non* ufficiale e *non* collegato in alcun modo al comune di ${municipalityData.Name} o alla società che gestisce la raccolta differenziata\n\nAllora, che ti interessa sapere?`,
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/domani/i, (msg, match) => {
    const chatId = msg.chat.id;

    let calendar = municipalityData.Calendar;

    let currentTime = moment().locale('it');
    currentTime = currentTime.add(1, 'd').subtract(6, 'h');

    let materiali = calendar[currentTime.format('YYYY')][currentTime.format('MM')][currentTime.format('DD')];

    let dayName = currentTime.format('dddd');
    let dayNumber = currentTime.format('DD');
    let monthName = currentTime.format('MMMM');

    bot.sendMessage(
        chatId,
        `${capitalize(dayName)} ${dayNumber} ${monthName} verrà ritirato\n*${materiali}*\n\nRicordati di portare fuori i contenitori entro le 6 del mattino`,
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/calendario/i, (msg, match) => {
    const chatId = msg.chat.id;

    let calendar = municipalityData.Calendar;

    let currentTime = moment().locale('it');

    let message = "";
    for (let i = 0; i < 7; i++) {
        message += currentTime.format('DD') + " " + currentTime.format('MMMM') + ": *" + (calendar[currentTime.format('YYYY')][currentTime.format('MM')][currentTime.format('DD')] || "-") + "*\n";
        currentTime = currentTime.add(1, 'd')
    }

    bot.sendMessage(
        chatId,
        `Questo è il calendario per i prossimi 7 giorni\n${message}`,
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/.+/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `Non sono in grado di capire questo comando\n\nProva a scrivermi /domani per sapere che materiale verrà ritirato domani o /calendario per avere il calendario della raccolta per i prossimi sette giorni`,
        { parse_mode: 'Markdown' }
    );
});


const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

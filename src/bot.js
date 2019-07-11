//module bot.js

const TelegramBotClient = require('node-telegram-bot-api');
const service = require('./service');
const moment = require('moment');
const tz = require('moment-timezone');
const utils = require('./utils');

const bot = new TelegramBotClient(
    process.env.BOT_TOKEN,
    {
        polling: true,
        onlyFirstMatch: true,
    }
);

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;

    let cityData = service.getCityData();

    bot.sendMessage(
        chatId,
        `Ciao, sono EcoBot 👋\n\nTi posso dare informazioni sulla raccolta differenziata nel comune di *${cityData.Name}*\n\nProva a scrivere /domani per sapere che materiale verrà ritirato domani o /calendario per avere il calendario della raccolta per i prossimi sette giorni\n\nSono un bot *non* ufficiale e *non* collegato in alcun modo al comune di ${cityData.Name} o alla società che gestisce la raccolta differenziata, che non possono essere ritenuti responsabili per i contenuti delle nostre conversazioni\n\nAllora, che ti interessa sapere?`,
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/domani/i, (msg, match) => {
    
    let materials = service.getTomorrowSchedule().materials.join(', ') || 'Nessun ritiro previsto';

    let currentTime = moment().tz("Europe/Rome").locale('it');
    currentTime = currentTime.add(18, 'h');

    let dayName = currentTime.format('dddd');
    let dayNumber = currentTime.format('D');
    let monthName = currentTime.format('MMMM');

    let message = `${utils.capitalize(dayName)} ${dayNumber} ${monthName} verrà ritirato\n*${materials}*\n\n👉 Ricordati di portare fuori i contenitori entro le 6 del mattino`;

    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        message,
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/calendario/i, (msg, match) => {
    let calendar = service.getCalendar();

    let currentTime = moment().tz("Europe/Rome").locale('it');

    let message = ``;
    for (let i = 0; i < calendar.length; i++) {
        message += `${currentTime.add(1, 'd').format('D MMMM')}: *${calendar[i].materials.join(', ')  || 'Nessun ritiro'}*\n`
    }

    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `Ecco il calendario per i prossimi 7 giorni\n\n${message}\n👉 Ricordati di portare fuori i contenitori entro le 6 del mattino del giorno di ritiro`,
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/ciao|buongiorno|salve|buonasera|buon giorno|buona sera/i, (msg, match) => {
    let saluto = match[0].replace(' ', '');

    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `${utils.capitalize(saluto)} a te! 🙂\n\nProva a scrivermi /domani per sapere che materiale verrà ritirato domani o /calendario per avere il calendario della raccolta per i prossimi sette giorni`,
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/grazie|ti ringrazio/i, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `È sempre un piacere! 😉`,
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

bot.on("polling_error", (err, match) => {
    console.log(err);
});

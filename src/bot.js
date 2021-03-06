const TelegramBotClient = require('node-telegram-bot-api')
const service = require('./service')
const moment = require('moment')
const tz = require('moment-timezone')
const utils = require('./utils')
const logger = require('pino')()

const bot = new TelegramBotClient(process.env.BOT_TOKEN, {
    polling: true,
    onlyFirstMatch: true
})

service.loadCityData()

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id

    bot.sendMessage(
        chatId,
        `Ciao, sono EcoBot 👋\n\nTi posso dare informazioni sulla raccolta differenziata nel comune di *${service.getCityName()}*\n\nProva a scrivere /domani per sapere che materiale verrà ritirato domani o /calendario per avere il calendario della raccolta per i prossimi sette giorni. Per la lista completa dei comandi scrivi /help\n\nSono un bot *non* ufficiale e *non* collegato in alcun modo al comune di ${service.getCityName()} o alla società che gestisce la raccolta differenziata, che non possono essere ritenuti responsabili per i contenuti delle nostre conversazioni\n\nAllora, che ti interessa sapere?`,
        { parse_mode: 'Markdown' }
    )
})

bot.onText(/domani/i, (msg, match) => {
    logger.info(msg)

    const tomorrowSchedule = service.getTomorrowSchedule()

    let message = ``
    let response = ``
    let failure = false

    if (
        tomorrowSchedule.error &&
        tomorrowSchedule.error.message === 'NO_INFO_AVAILABLE_AFTER'
    ) {
        failure = true
        response = `\nOh no! \nNon sono state ancora pubblicate le informazioni sulla raccolta dopo il *${moment(
            tomorrowSchedule.error.details
        ).format('D MMMM')}* 🤷‍♂️\n`
    } else {
        message =
            tomorrowSchedule.materials.join(', ') || 'Nessun ritiro previsto'
    }

    if (!failure) {
        const currentTime = moment()
            .tz('Europe/Rome')
            .locale('it')
            .add(18, 'h')

        const dayName = currentTime.format('dddd')
        const dayNumber = currentTime.format('D')
        const monthName = currentTime.format('MMMM')

        const collectionInfo = service.getCollectionInfo()

        response = `${utils.capitalize(
            dayName
        )} ${dayNumber} ${monthName} verrà ritirato\n*${message}*\n\n`

        const currentHour = Number(
            moment()
                .tz('Europe/Rome')
                .locale('it')
                .format('HH')
        )

        if (message !== 'Nessun ritiro previsto') {
            response += '👉 Ricordati di portare fuori i contenitori '
            if (
                currentHour >= collectionInfo.collectionStartHourOfTheDay &&
                currentHour <= 23
            )
                response += `questa sera dopo le ${collectionInfo.allowTakeOutTrashFromHour} ed entro le ${collectionInfo.collectionStartHourOfTheDay} del mattino di domani`
            else {
                response += `entro le ${collectionInfo.collectionStartHourOfTheDay} del mattino`
            }
        } else {
            response +=
                '👉 Puoi chiedermi cosa passerà nei prossimi giorni usando il comando /calendario '
        }
    }
    const chatId = msg.chat.id

    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' })
})

bot.onText(/calendario(\s*[a-zA-Z]*)*(\d+)*/i, (msg, match) => {
    logger.info(msg)

    let numberOfDays = match[2]

    if (!numberOfDays) {
        numberOfDays = 7
    } else if (numberOfDays > 31) {
        numberOfDays = 31
    }

    const calendar = service.getCalendar(numberOfDays)

    const collectionInfo = service.getCollectionInfo()

    const currentTime = moment()
        .tz('Europe/Rome')
        .locale('it')

    let message = ``
    let failure = false
    let previousMonth = '';
    for (let i = 0; i < calendar.length; i++) {
        if (
            calendar[i].error &&
            calendar[i].error.message === 'NO_INFO_AVAILABLE_AFTER'
        ) {
            failure = i === 0
            message += `\nNon sono state ancora pubblicate le informazioni sulla raccolta dopo il *${moment(
                calendar[i].error.details
            ).format('D MMMM yyyy')}* 🤷‍♂️\n`
            break
        }

        currentTime.add(1, 'd');

        if (previousMonth !== currentTime.format('MMMM')) {
            previousMonth = currentTime.format('MMMM');
            message += `*\n${utils.capitalize(previousMonth)}\n*`
        }

        message += `${utils.capitalize(currentTime.format('dddd D'))}: *${calendar[
            i
        ].materials.join(', ') || 'Nessun ritiro'}*\n`
    }

    const chatId = msg.chat.id

    let response

    if (!failure) {
        response = `Ecco il calendario per i prossimi ${numberOfDays} giorni\n${message}\n👉 Ricordati di portare fuori i contenitori entro le ${collectionInfo.collectionStartHourOfTheDay} del mattino del giorno di ritiro o la sera prima dopo le ${collectionInfo.allowTakeOutTrashFromHour}`
    } else {
        response = `Oh, no! ${message}`
    }

    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' })
})

bot.onText(
    /ciao|buongiorno|salve|buonasera|buon giorno|buona sera/i,
    (msg, match) => {
        logger.info(msg)

        const saluto = match[0].replace(' ', '')

        const chatId = msg.chat.id

        bot.sendMessage(
            chatId,
            `${utils.capitalize(
                saluto
            )} a te! 🙂\n\nProva a scrivermi /domani per sapere che materiale verrà ritirato domani o /calendario per avere il calendario della raccolta per i prossimi sette giorni`,
            { parse_mode: 'Markdown' }
        )
    }
)

bot.onText(/grazie|ti ringrazio/i, (msg, match) => {
    logger.info(msg)

    const chatId = msg.chat.id

    bot.sendMessage(chatId, `È sempre un piacere! 😉`, {
        parse_mode: 'Markdown'
    })
})

bot.onText(/ecocentro/i, (msg, match) => {
    logger.info(msg)

    const ecocentro = service.getEcocentro()

    let message = ''

    if (ecocentro)
        message = `\n\n*ORARI*\n\n${ecocentro.openingHours}\n\n*INDIRIZZO*\n${ecocentro.address}\n${ecocentro.googleMaps}`

    const chatId = msg.chat.id

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
})

bot.onText(/ingombranti/i, (msg, match) => {
    logger.info(msg)

    const ingombranti = service.getIngombranti()

    let message = ''

    if (ingombranti) message = `${ingombranti.description}`

    const chatId = msg.chat.id

    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    })
})

bot.onText(/farmaci|medicine|medicinali|batteri(e|a)/i, (msg, match) => {
    logger.info(msg)

    const speciali = service.getSpeciali()

    let message = ''

    if (speciali) message = `${speciali.description}`

    const chatId = msg.chat.id

    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    })
})

bot.onText(/help|aiuto/i, (msg, match) => {
    logger.info(msg)

    const message = `
Puoi chiedermi qualcosa usando i seguenti comandi:

*Raccolta*
/domani - scopri cosa verrà ritirato domani mattina
/calendario - il calendario dei ritiri per i prossimi 7 giorni

*Altre Informazioni*
/ecocentro - ottieni informazioni sull'ecocentro comunale
/ingombranti - come conferire rifiuti ingombranti
/help - visualizza questa guida
`

    const chatId = msg.chat.id

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
})

bot.onText(/.+/, (msg, match) => {
    logger.info(msg)

    const chatId = msg.chat.id

    bot.sendMessage(
        chatId,
        `Non sono in grado di capire questo comando\n\nProva a scrivermi /domani per sapere che materiale verrà ritirato domani o /calendario per avere il calendario della raccolta per i prossimi sette giorni`,
        { parse_mode: 'Markdown' }
    )
})

bot.on('polling_error', (err, match) => {
    console.log(err)
})

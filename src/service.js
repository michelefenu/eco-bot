//module service.js

const https = require("https");

const getMunicipalityData = function(municipalityCode) {
    
    let url = "";
    if(process.env.NODE_ENV !== 'Development')
        url = `https://firebasestorage.googleapis.com/v0/b/eco-bot-data.appspot.com/o/${municipalityCode}.json?alt=media`;
    else
        url = `https://firebasestorage.googleapis.com/v0/b/eco-bot-data.appspot.com/o/${municipalityCode}-dev.json?alt=media`;
  
    return new Promise(resolve => {
        https.get(url, res => {
            res.setEncoding("utf8");

            let body = "";

            res.on("data", data => {
                body += data;
            });

            res.on("end", () => {
                resolve(JSON.parse(body));
            });
        });
    })
}

module.exports = {
    getMunicipalityData: getMunicipalityData
}

// rewiremock.js
const rewiremock = require('rewiremock/node');
/// settings
rewiremock.overrideEntryPoint(module); // this is important
module.exports = rewiremock;

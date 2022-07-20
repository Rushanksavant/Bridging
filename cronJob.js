var cron = require('node-cron');
const { main } = require("./main/depositTxn.js")

cron.schedule('0 */5 * * * *', async () => {
    console.log('');
    console.log('********************************************************************************');
    console.log('');

    await main("0xdd160613122C9b3ceb2a2709123e3020CaDa2546");

});
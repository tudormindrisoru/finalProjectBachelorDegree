const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendSMS(code, phone) {
    console.log("SEND SMS ", code, phone);
    await client.messages
        .create({body: `Doc Help generated code: ${code}`, from: '+15305392404', to: `+4${phone}`})
        .then(message => console.log(message.sid))
        .catch(error => console.error(error));
}

module.exports = { sendSMS }
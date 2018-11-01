const functions = require('firebase-functions');
const rp = require('request-promise');
const mailgun = require('mailgun-js')({
  apiKey: functions.config().qodeclub.mailgun, 
  domain: "mg.qodeclub.com"
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

function getMailPayload(payload) {
    if(payload.email !== undefined) {
        return {
            from: 'Message Bot <no-reply@qodeclub.com>',
            to: 'e.hairullin@qiwi.tech',
            //to: 'coworking.aft@fintechru.org',
            subject: 'Сообщение с сайта qodeclub',
            html: "<html><body><p>Привет,</p><p>Мы полчили такое сообщение:</p><ul><li><b>Имя:</b> " + payload.name + "</li><li><b>Email:</b> " + payload.email + "</li><li><b>Компания:</b> " + payload.company + "</li></ul><p>/Message Bot</p></body></html>"
        }
    }
    return undefined;
}

function getReCAPTCHAVerifyPayload(token) {
    return {
        method: 'POST',
        uri: 'https://www.google.com/recaptcha/api/siteverify?secret=' + functions.config().qodeclub.gsecret + '&response=' + token,
        json: true,
    };
}

exports.request = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }
  
    if(req.body === undefined || req.body.gtoken === undefined) {
      return res.status(415).send('No payload we can work with :(');
    }
  
    return rp(getReCAPTCHAVerifyPayload(req.body.gtoken), async (gerr, gres, gbody) => {
      if (!gbody.success) {
        console.error(gerr);
        return res.status(415).send('You\'re a robot');
      }
  
      try {
        mailgun.messages().send(getMailPayload(req.body), (err, body) => {
          console.log(err);
          console.log(body);
        });
        return res.status(200).send('OK');
      } catch(error) {
        console.error(error);
        return res.status(500).send('Something went wrong while posting the message to Slack.');
      }
    });
  });

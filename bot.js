const botBuilder = require('claudia-bot-builder'),
    excuse = require('huh');

const fbTemplate = require('claudia-bot-builder').fbTemplate;

const THANK_WORDS = ['thank you', 'thanks'];

const welcomeMsg = (sender) => {
  console.log('facebook sender', sender);
  return new fbTemplate.Button('Welcome! ' + sender + ' How can I can help you today?')
  .addButton('Book an Appointment', 'BOOK')
  .addButton('View an Appointment', 'VIEW')
  .addButton('Cancel an Appointment', 'CANCEL')
  .get();
};

const bookMsg = new fbTemplate.Text('Are you currently a patient with us?')
  .addQuickReply('Yes', 'PATIENT_YES')
  .addQuickReply('No', 'PATIENT_NO')
  .addQuickReply('I don\'t know', 'PATIENT_NOT_SURE')
  .get();

const viewMsg = new fbTemplate.Text('Ok. Do you know your 8-digit medical ID?')
  .addQuickReply('Yes', 'ID_YES')
  .addQuickReply('No', 'ID_NO')
  .get();

const cancelMsg = new fbTemplate.Text('I\'d be happy to help you with that. Do you know your medical ID?')
  .addQuickReply('Yes', 'ID_YES')
  .addQuickReply('No', 'ID_NO')
  .get();

const yesPatientMsg = new fbTemplate.Text('Ok. Do you know your 8-digit medical ID?')
  .addQuickReply('Yes', 'ID_YES')
  .addQuickReply('No', 'ID_NO')
  .get();

const noPatientMsg = 'Great. Someone will help you register as a new patient shortly.';

const notSurePatientMsg = 'No problem. Let me get someone to help you.';

const noIdMsg = 'No problem. Let me get someone to help you.';

const yesIdMsg = 'Great. Please enter your 8-digit medical ID.';

const receivedIdMsg = 'Thank you. Give me a few moments to find your medical record.';

const deNadaMsg = 'You\'re welcome! Thank you for your patience!';

const idMsgTest = function (message) {
  if (!isNaN(parseInt(message.text)) && message.text.length === 8) {
    return receivedIdMsg;
  } else return 'I\'m sorry. That is not a valid medical number. Please try again.';
}

const claudiaBot = (message, origApiRequest) => {
  if (message.type === 'facebook') {
    console.log('message', message);
      switch (message.text) {
        case 'BOOK':
          return bookMsg;
          break;
        case 'VIEW':
          return viewMsg;
          break;
        case 'CANCEL':
          return cancelMsg;
          break;
        case 'PATIENT_YES':
          return yesPatientMsg;
          break;
        case 'PATIENT_NO':
          return noPatientMsg;
          break;
        case 'PATIENT_NOT_SURE':
          return notSurePatientMsg;
          break;
        case 'ID_YES':
          return yesIdMsg;
          break;
        case 'ID_NO':
          return noIdMsg;
          break;
        case 'MEDICAL_ID':
          return idMsgTest(message);
          break;
        default:
          if (!isNaN(parseInt(message.text))) {
            return idMsgTest(message);
            break;
          } else return welcomeMsg(message.sender);
      }
    // }
  }
};

module.exports = botBuilder(claudiaBot, { platforms: ['facebook', 'alexa'] });

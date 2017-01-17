const botBuilder = require('claudia-bot-builder');
// const apiBotMonkey = require('./helpers/api');

const api_endpoint = 'http://localhost:5000';

const fbTemplate = require('claudia-bot-builder').fbTemplate;

const generic = new fbTemplate.Generic();

let user = { first_name: 'Claudio'};
// let medical_id = '';

const helpMsg = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [{
        title: 'No problem. Give us a call to get some help by clicking the link below.',
        subtitle: 'Or call us directly at 1-510-555-1212.',
        buttons: [{
          type: 'phone_number',
          title: 'Call Us',
          payload: '+15105551212'
        }]
      }]
    }
  }
};

// const welcomeMsg = new fbTemplate.Text('What would you like to do today?')
//   .addQuickReply('Book Appointment', 'BOOK')
//   .addQuickReply('View Appointment', 'VIEW')
//   .addQuickReply('Cancel Appointment', 'CANCEL')
// .get();

const welcomeMsg = new fbTemplate.Text('What would you like to do today?')
    .addQuickReply('Book Appointment', 'BOOK')
    .addQuickReply('View Appointment', 'VIEW')
    .addQuickReply('Cancel Appointment', 'CANCEL')
    .addQuickReply('Get Help', 'HELP')
  .get();

const verifyUserMsg = () => {
  const name = user.first_name;
  if (name) {
    return new fbTemplate.Text('Welcome back, ' + name + '! What would you like to do today?')
      .addQuickReply('Book Appointment', 'BOOK')
      .addQuickReply('View Appointment', 'VIEW')
      .addQuickReply('Cancel Appointment', 'CANCEL')
      .addQuickReply('I\'m not ' + name + '!', 'NOT_ME')
    .get();
  }
  return welcomeMsg;
};

const notMeMsg = new fbTemplate.Text('Sorry about that. Are you currently a patient with us?')
  .addQuickReply('Yes', 'PATIENT_YES')
  .addQuickReply('No', 'PATIENT_NO')
  .addQuickReply('I don\'t know', 'PATIENT_NOT_SURE')
  .get();


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

// const bookMsg = (medical_id) => {
//   if (medical_id) {
//     // do something
//   } else {
//     return new fbTemplate.Text('Are you currently a patient with us?')
//       .addQuickReply('Yes', 'PATIENT_YES')
//       .addQuickReply('No', 'PATIENT_NO')
//       .addQuickReply('I don\'t know', 'PATIENT_NOT_SURE')
//       .get();
//   };
// };
//
// const viewMsg = (medical_id) => {
//   if (medical_id) {
//     // do something else
//   } else {
//     return new fbTemplate.Text('Ok. Do you know your 8-digit medical ID?')
//       .addQuickReply('Yes', 'ID_YES')
//       .addQuickReply('No', 'ID_NO')
//       .get();
//   }
// };
//
// const cancelMsg = (medical_id) => {
//   if (medical_id) {
//     // do something else
//   } else {
//     return new fbTemplate.Text('I\'d be happy to help you with that. Do you know your medical ID?')
//       .addQuickReply('Yes', 'ID_YES')
//       .addQuickReply('No', 'ID_NO')
//       .get();
//   }
// };

const yesPatientMsg = new fbTemplate.Text('Ok. Do you know your 8-digit medical ID?')
  .addQuickReply('Yes', 'ID_YES')
  .addQuickReply('No', 'ID_NO')
  .get();

const noPatientMsg = 'Great. Someone will help you register as a new patient shortly.';

const notSurePatientMsg = helpMsg;

const noIdMsg = helpMsg;

const yesIdMsg = new fbTemplate.Text('Great. Please enter your 8-digit medical ID.')
  .get();

const receivedIdMsg = 'Thank you. Give me a few moments to find your medical record.';

const deNadaMsg = 'You\'re welcome! Thank you for your patience!';

const idMsgTest = (message) => {
  if (!isNaN(parseInt(message.text)) && message.text.length === 8) {
    return receivedIdMsg;
  }
  return 'I\'m sorry. ' + message.text + ' is not a valid medical ID. It should be 8 digits in length and consist only of numbers. Please try again.';
};

const claudiaBot = (message, origApiRequest) => {
  // origApiRequest.lambdaContext.callbackWaitsForEmptyEventLoop = false;
  // let medical_id = '';
  // const user = {};
  // check for user record
  // const route = `${api_endpoint}/user/external/${external_id}`;
  // console.log('route:', route);
  // user = callApi(path);
  // if (user) medical_id = user.medical_id;
  // console.log('user:', user);

  if (message.type === 'facebook') {
    // const external_id = message.sender;
    // console.log('external_id:', external_id);
    console.log('message:', message);
    switch (message.text) {
    case 'GET_STARTED':
      return verifyUserMsg(user);
      // return welcomeMsg;
      break;
    case 'NOT_ME':
      return notMeMsg;
      break;
    case 'BOOK':
      return bookMsg;
      break;
    case 'VIEW':
      return viewMsg;
      break;
    case 'CANCEL':
      return cancelMsg;
      break;
    case 'OTHER':
    case 'HELP':
      return helpMsg;
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
      }
      return welcomeMsg;
      // return welcomeMsg(external_id);
    }
  }
};

// const callApi = function* (route, data = {}) {
//   // fetch(route, headers)
//   yield axios.get(route)
//   .then((response) => {
//     console.log('api call response', response);
//     if (response.ok) return response.json();
//     console.log('Bad network response');
//   })
//   .catch((error) => {
//     // display error
//     console.log('There was a problem with this API call.');
//     return { err: error };
//   });
// };

module.exports = botBuilder(claudiaBot, { platforms: ['facebook'] });

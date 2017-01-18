const botBuilder = require('claudia-bot-builder');
const axios = require('axios');
// const apiBotMonkey = require('./helpers/api');

const api_endpoint = 'https://iztrujvjzn.localtunnel.me';

const fbTemplate = require('claudia-bot-builder').fbTemplate;

const generic = new fbTemplate.Generic();

const user = {};

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

const checkInUserMsg = () => {
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
  const regexTest = /^\d{8}$/;
  if (regexTest.test(message.text)) {
    return receivedIdMsg;
  }
  return 'I\'m sorry. ' + message.text + ' is not a valid medical ID. It should be 8 digits in length and consist only of numbers. Please try again.';
};

const callApi = (route, data) => {
  axios.get(route)
  .then((response) => {
    console.log('api call response', response.data);
    if (response.status === 200) {
      parseUserData(response.data);
      return response.data;
    }
    console.log('Bad network response: ', response.status, ' ', response.statusText);
  })
  .catch((error) => {
    if (error.response) {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      console.log('There was an error in the response: ', error.response.data);
      console.log('Response Status: ', error.response.status);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('There was a problem with this request: ', error.message);
    }
  });
};

const parseUserData = (data) => {
  user.facebook_id = data.external_id;
  user.medical_number = data.medical_number;
  user._id =  data._id;
  user.first_name = data.first_name;
  user.last_name = data.last_name;
  user.phone = data.phone;
  user.email = data.email;
  console.log('user after parsing response data: ', user);
  return user;
};

const claudiaBot = (message, origApiRequest) => {
  if (message.type === 'facebook') {
    // console.log('message:', message);
    const request = message.text;
    switch (request) {
    case 'GET_STARTED':
      const external_id = message.sender;
      const route = `${api_endpoint}/user/external/${external_id}`;
      // retrieve user record
      callApi(route);
      return checkInUserMsg;
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
    }
  }
};

module.exports = botBuilder(claudiaBot, { platforms: ['facebook'] });

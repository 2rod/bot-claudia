const Api = {};

Api.callApi = (route, headers = {}) => {
  fetch(route, headers)
  .then((response) => {
    if (response.ok) return response.json();
    else console.log('Bad network response');
  })
  .catch((error) => {
    // display error
    console.log('There was a problem with this API call.');
    return { err: error };
  });
};

module.exports = Api;

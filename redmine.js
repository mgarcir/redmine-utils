const request = require('request');

function doRequest (taskId, cookie, after){
    const options = {
        url: 'https://dev.crt0.net/issues/' + taskId,
        headers: {
          'User-Agent': 'request',
          'Cookie': cookie //'_redmine_session=xxxxxxxxxxxxxxxx'
        }
    };

    request(options, function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        after(body);
      }else{
        console.error(error);};
    });
};

function taskStatus(body){
  let regex = new RegExp('<td class="status">([a-zA-Z]*)</td>');
  let match = regex.exec(body);

  return match[1];
};

function getTaskStatus(body, callback){
  let status = taskStatus(body);

  callback(status);
};

function isTaskClosed(body, nextStep, error){
  let status = taskStatus(body);

  if (status === 'Closed') {
    nextStep();}
  else{
    error();};
};

module.exports.request = (taskId, cookie, after) => doRequest(taskId, cookie, after);
module.exports.getTaskStatus = (body, next) => getTaskStatus(body, next);
module.exports.isTaskClosed = (body, nextStep, error) => isTaskClosed(body, nextStep, error);
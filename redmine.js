const request = require('request');

function doRequest (taskId, cookie){
    const options = {
        url: 'https://dev.crt0.net/issues/' + taskId,
        headers: {
          'User-Agent': 'request',
          'Cookie': cookie //'_redmine_session=xxxxxxxxxxxxxxxx'
        }
    };

    // Return new promise 
    return new Promise(function(resolve, reject) {
      // Do async job
      request(options, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            resolve(body);
          }else{
            reject(error);};
        });
    });
};

function getTaskStatus(body){
  let regex = new RegExp('<td class="status">([a-zA-Z]*)</td>');
  let match = regex.exec(body);

  return match[1];
};

function isTaskClosed(body){
  let status = getTaskStatus(body);
  return (status === 'Closed')? true : false;
};

module.exports.request = (taskId, cookie) => doRequest(taskId, cookie);
module.exports.getTaskStatus = (body) => getTaskStatus(body);
module.exports.isTaskClosed = (body) => isTaskClosed(body);

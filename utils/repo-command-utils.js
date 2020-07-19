const proc = require('child_process');
const request = require('request');

const constants = require('../constants');
const resUtils = require('./response-utils');


module.exports = {
  initRepos: function() {
    
    return new Promise((resolve,reject) => {
    
      console.log('Initializing and syncing all local repos');

      let options = {
        url: `${constants.GIT_REPO_SERVER_URL}/get-all-repos`,
        method: 'GET',
        headers: {
          'x-server-key': constants.GIT_REPO_SERVER_KEY
        }
      };

      request(options, function(error, response, body) {

        if (error) {
          console.log(`Encountered error during request: ${options.url}`);
          return reject(error);
        }

        // Get the remote collections
        let remoteCollections = JSON.parse(body).data;

        console.log('Remote Collections:');
        console.log(remoteCollections);

        // Get any local collections
        let localCollections = module.exports.executeCommand(null,
          `sh ./scripts/get_all_repos.sh ${constants.GIT_PATH}`,
          'Retrieve all repos',
          '',
          result => result.split(',').map(r => r.trim()).filter(item => item !== '')
        ).data;

        console.log('Local Collections:');
        console.log(localCollections);

        // For each remote collection, clone if it doesn't exist locally, or pull
        remoteCollections.forEach(remoteRepoPath => {
          
          remoteRepoPath.replace(constants.GIT_PATH, '')
          
          localCollections.forEach(localRepo => {

            let localRepoName = localRepo.replace(constants.GIT_PATH, '');

            if (remoteRepoPath.endsWith(`${localRepoName}.git`)) {

              console.log(`Pulling latest for repo ${localRepoName}`);

              module.exports.executeCommand(null,
                `sh ./scripts/git_pull.sh ${localRepo}`,
                'Git Pull',
                '',
                result => result = 'Successfully pulled data'  
              );
              
            }
          });

        });

        return resolve(true);
      });
    });
  },

  executeCommand: function(res, command, actionText, repoName, resCallback) {

    let returnRes = function (res, code, response) {
      if (res){
        return res.status(code).send(response);
      } else {
        return response;
      }
    };

    let result;

    try {
      result = proc.execSync(command).toString().trim();
    } 
    catch (error) {

      let errorText;

      if (error.stdout !== undefined) {
        errorText = error.stdout.toString().trim();
      }

      switch (errorText) {
        case 'NO_REPO_NAME':
          return returnRes(res, 400, resUtils.errorResponse(
            `${actionText} failed!`,
            'Parameter [repo_name] not provided'
          ));
        case 'REPO_EXISTS':
          return returnRes(res, 400, resUtils.errorResponse(
            `${actionText} failed!`,
            `Repo with name [${repoName}] already exists.`
          ));
        case 'REPO_NOT_EXISTS':
          return returnRes(res, 400, resUtils.errorResponse(
            `${actionText} failed!`,
            `Repo with name [${repoName}] does not exist.`
          ));
        default:
          return returnRes(res, 500, resUtils.errorResponse(
            `${actionText} failed!`,
            `Command failed [${command}] : ${errorText || error}`
          ));
      }
    }
  
    if (resCallback !== undefined) {
      result = resCallback(result);
    }

    return returnRes(res, 200, resUtils.dataResponse(result));
  }
};
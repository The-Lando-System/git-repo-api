const resUtils = require('../utils/response-utils');
const repoCommandUtils = require('../utils/repo-command-utils');
const constants = require('../constants');
const request = require('request');

module.exports = function(app) {

  const gitPath = constants.GIT_PATH;

  app.post('/collection/create', function(req,res) {
    let collectionName = req.query.collection_name;

    if (collectionName === undefined) {
      return res.status(400).send(resUtils.errorResponse(
        'Failed to create a new collection',
        'Parameter [collection_name] not provided'
      ));
    }

    let options = {
      url: `${constants.GIT_REPO_SERVER_URL}/create-repo?repo_name=${collectionName}`,
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization
      }
    };

    request(options, function(error, response, body) {

      if (error) {
        console.log(error);
        // return whatever error we got from the create command
        return res.status(500).send(resUtils.errorResponse(`Error occurred creating collection named ${collectionName}`, error));
      }

      if (response.statusCode === 400) {
        return res.status(400).send(resUtils.errorResponse(`Error occurred creating collection named ${collectionName}`, JSON.parse(body)));
      }

      let cloneAddress;
      try {
        cloneAddress = JSON.parse(body).data;
        cloneAddress = `${constants.GIT_REPO_SERVER_HOST}${cloneAddress}`;
      } catch(e) {
        console.log(e);
        return res.status(500).send(resUtils.errorResponse(`Error occurred creating collection named ${collectionName}`, e));
      }
      
      return repoCommandUtils.executeCommand(res,
        `sh ./scripts/clone_repo.sh ${gitPath}/${req.id}/${collectionName} ${cloneAddress}`,
        'Create new collection',
        collectionName,
        (() => `Successfully created collection named [${collectionName}]`) 
      );

    });
  });
};
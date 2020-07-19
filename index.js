const express = require('express');
const logger = require('morgan');

const constants = require('./constants');
const repoCommandUtils = require('./utils/repo-command-utils');

const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

repoCommandUtils.initRepos().then(() => {

  console.log('Repo init complete!');

  require('./routes/google-auth-filter')(app);
  require('./routes/collection-routes')(app);

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log('git-repo-api is up and running on port ', port);
    console.log('Git API Path: ', constants.GIT_PATH);
  });

}).catch(error => {
  console.log(error)
});


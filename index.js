const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./routes/google-auth-filter')(app);
require('./routes/repo-routes')(app, gitPath);

const port = process.env.PORT || 3001;
app.listen(port, () => {
 console.log('git-repo-api is up and running on port ', port);
});
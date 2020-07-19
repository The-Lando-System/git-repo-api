module.exports = {
  GOOGLE_TOKEN_INFO_URL: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
  ADMIN_EMAILS: {
    'matt.voget@gmail.com' : true
  },
  GIT_REPO_SERVER_HOST: '', // might be git@123.123.123.123:
  GIT_REPO_SERVER_URL: 'http://localhost:3000/git-server',
  GIT_REPO_SERVER_KEY: process.env.GIT_REPO_SERVER_KEY || 'abc123',
  GIT_PATH: process.env.GIT_REPO_PATH || '/tmp/git-api'
};
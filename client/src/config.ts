// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: process.env.REACT_APP_AUTH0_CONFIG_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CONFIG_CLIENT_ID,
  callbackUrl: process.env.REACT_APP_AUTH0_CONFIG_CALLBACK_URL
}

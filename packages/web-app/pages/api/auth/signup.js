// api/signup.js
import { handleLogin } from '@auth0/nextjs-auth0';

export default async function signup(req, res) {
  const queryType = req?.query?.type;
  try {
    await handleLogin(req, res, {
      authorizationParams: {
        // Note that this can be combined with prompt=login , which indicates if
        // you want to always show the authentication page or you want to skip
        // if there’s an existing session.
        screen_hint: 'signup'
      },
      returnTo: (queryType) ? '/claim/newClaim' : '/'
    });
  } catch (error) {
    res.status(error.status || 400).end(error.message);
  }
}

import auth0 from 'auth0-js';
import { getItem, setItem } from './storage'

const auth0Client = new auth0.WebAuth({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientID: import.meta.env.VITE_AUTH0_CLIENTID,
  redirectUri: import.meta.env.VITE_REDIRECT_URL,
  responseType: 'token id_token',
});

export function auth0Login() {
  try {
    auth0Client.authorize();
  } catch (err) {
    toast.error('Unable to connect with Auth0')
    router.push('/session/email')
  }
}

export function handleCallback() {
  return new Promise((resolve, reject) => {
    auth0Client.parseHash((err, authResult) => {
      if (authResult && authResult?.accessToken && authResult?.idToken) {
        setItem('auth0Actok', authResult?.accessToken)
        setItem('auth0Idtok', authResult?.idToken)
        resolve(authResult);
      }
      else if (err) {
        reject(err);
      }
    });
  });
}

export function getAuth0User() {
  return new Promise((resolve, reject) => {
    auth0Client.client.userInfo(getItem('auth0Actok'), (err, user) => {
        if (user) {
        resolve(user);
      } else if (err) {
        reject(err);
      }
    });
  });
}

export function auth0Logout() {
  auth0Client.logout({
    returnTo: import.meta.env.VITE_LOGOUT_URL,
    clientID: import.meta.env.VITE_AUTH0_CLIENTID,
  });
}


export const initializeLogin = async (element) => {
  if (!element) return console.error('I need an element')

  try {
    // init: load login scope
    await gapi.load('auth2', () => {
      const auth = gapi.auth2.init({
        client_id: `837199060608-p9vaeb7s7e2mcd1ei990k9pm14qkpsfi.apps.googleusercontent.com`,
        scope: 'profile email https://www.googleapis.com/auth/cloud-platform',
      });

      // Listen for sign-in state changes.
      auth.isSignedIn.listen(signinChanged);
    });

  } catch {
    // try it again...
    location.reload();
  }

  // sign in functionality
  const googleSignin = document.createElement('div');
  googleSignin.setAttribute('class', 'g-signin2');
  googleSignin.id = 'google-sign-in';
  googleSignin.setAttribute('data-theme', 'dark');
  // append to dom
  element.appendChild(googleSignin);

  // sign out functionality
  const googleSignOut = document.createElement('button');
  googleSignOut.innerText = 'sign out';
  googleSignOut.id = 'google-sign-out';
  googleSignOut.classList.add('hidden');
  googleSignOut.onclick = signOut;

  // append to dom
  element.appendChild(googleSignOut);

  return null;
};

export const googleAuthorization = async () => {
  let user;
  const auth2 = gapi.auth2.getAuthInstance();

  // refresh token every hour
  await auth2.then((auth) => {
    user = auth.currentUser.get();
    // reload token after 1 hour = 3.600.000ms (min 1 minute)
    setInterval(() => { user.reloadAuthResponse(); }, 1000 * 60 * 59);
  });

  return user;
};

export const signOut = async () => {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log('User signed out.');

    // remove token wen we log out
    window.data = null;
  });
};

export const signinChanged = async (value) => {
  console.log('Signin state changed to ', value);

  const signInButton = document.getElementById('google-sign-in');
  const signOutButton = document.getElementById('google-sign-out');

  if (!value) {
    signOutButton.classList.add('hidden');
    signInButton.classList.remove('hidden');
    return null
  };

  signInButton.classList.add('hidden');
  signOutButton.classList.remove('hidden');

  // logged in: get a token
  return await getToken();
};

export const getToken = async () => {

  // logged in: get a token
  const user = await googleAuthorization();

  // get token
  const response = await user.getAuthResponse();

  // store token in a global...
  window.data = response;

  return response
}

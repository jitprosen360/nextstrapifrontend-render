import axios from 'axios';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function signIn({ email, password, username, id_token, access_token }) {
  const payload = {
    password,
  };

  if (email) {
    payload.identifier = email;
  } else if (username) {
    payload.identifier = username;
  } else {
    throw new Error('Email or username is required.');
  }

  if (id_token && access_token) {
    payload.id_token = id_token;
    payload.access_token = access_token;
  }

  try {
    const response = await axios.post(`${strapiUrl}/api/auth/local`, payload);

    // Manually include username in the response
    return {
      user: {
        ...response.data.user,
        username: username || response.data.user.username
      },
      
      jwt: response.data.jwt,
    };
  
  } catch (error) {
    // Sign In Fail
    return null;
  }
}

export async function signOut(params) {
  // Implement logic to clear the user's session or perform any necessary logout actions
  // For example, if you are using cookies for session management, you can clear the cookies here.
  
  // Example using cookies (you may need to adjust this based on your session management method):
  params.res.setHeader('Set-Cookie', `authToken=; path=/; expires=Thu, 01 Jan 2023 00:00:00 GMT`);
  
  // Redirect the user to the home page or any other appropriate page after logout
  params.res.redirect('/');
}

// export async function signIn({ email, password,username }) {
//   const res = await axios.post(`${strapiUrl}/api/auth/local`, {
//     identifier: email,
//     username,
//     password,
//   });
//   return res.data;
// }


// export async function register({ email, password,username }){
// axios
//   .post(`${strapiUrl}/api/auth/local/register`, {
//     username,
//     email ,
//     password
//   })
//   .then(response => {
//     console.log('User profile', response.data.user);
//     console.log('User token', response.data.jwt);
//   })
//   .catch(error => {
//     console.log('An error occurred:', error.response);
//   });
// }


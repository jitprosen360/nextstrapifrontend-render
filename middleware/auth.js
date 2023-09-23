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

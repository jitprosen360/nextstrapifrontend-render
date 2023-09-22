import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from '../../../../middleware/auth';
import { getSession , signOut } from 'next-auth/react';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'Sign in with Email',
      credentials: {
        username: { label: 'Username', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        /**
         * This function is used to define if the user is authenticated or not.
         * If authenticated, the function should return an object contains the user data.
         * If not, the function should return `null`.
         */
        if (credentials == null) return null;
        /**
         * credentials is defined in the config above.
         * We can expect it contains two properties: `email` and `password`
         */
        try {
          const { user, jwt  } = await signIn({
            username: credentials.username,
            email: credentials.email,
            password: credentials.password,
            
          });
          
          

          return { ...user, jwt };
        } catch (error) {
          // Sign In Fail
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.id = token.id;
      session.jwt = token.jwt;
      return Promise.resolve(session);
    },
   
    jwt: async ({ token, user , req   }) => {
      const isSignIn = user ? true : false;
      if (isSignIn ) {
        token.id = user.id;
        token.jwt = user.jwt;
   
      }
      return Promise.resolve(token);
    },
  },
  signOut: async (session) => {
    // Use getSession to get the user's session token
    const token = await getSession({ req: session.req });
  
    // Check if there is an active session
    if (token) {
      // Create a new short-lived token (e.g., expires in a few seconds)
      const token = await signToken({ token : token.user }, { expiresIn: '360s' });
  
      // Return the new token (optional) or a success message
      return Promise.resolve({ token, success: true });
    }
    // Return a response if there is no active session
    return Promise.resolve({token, success: false });
  },
  
  

  secret: process.env.NEXTAUTH_SECRET,
});
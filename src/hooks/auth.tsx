import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as GoogleAuthentication from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: ReactNode;
};

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
};

interface IAuthContextData {
  user: User;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
};

interface IAuthResponse {
  params: {
    access_token: string;
  },
  type: string;
};

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children } : AuthProviderProps) {
  const userStorageKey = '@gofinances:user';

  const [isUserStorageLoading, setIsUserStorageLoading] = useState(false);
  const [user, setUser] = useState({} as User);

  async function signInWithGoogle() {
    try {
      // O que queremos na resposta
      const RESPONSE_TYPE = 'token';
      // As informações que queremos
      const SCOPE = encodeURI('profile email');

      // Endpoint de autenticação do Google
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const { params, type } = await GoogleAuthentication.startAsync({ authUrl }) as IAuthResponse;

      if(type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          name: userInfo.give_name,
          email: userInfo.email,
          photo: userInfo.picture,
        };
        
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));            
      };
    } catch (error) {
      throw new Error(error as string);
    }
  };

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      if(credential) {
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name: credential.fullName!.givenName!,
          photo: undefined,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };

  useEffect(() => {
    async function loadUserStorageData() {
      const storedUser = await AsyncStorage.getItem(userStorageKey);

      if(storedUser) {
        const loggedUser = JSON.parse(storedUser) as User;
        setUser(loggedUser);
      }

      setIsUserStorageLoading(false);
    }

    loadUserStorageData();
  }, [])

  return(
    <AuthContext.Provider value={{ 
      user,
      signInWithGoogle,
      signInWithApple
    }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  return context;
};

export { AuthProvider, useAuth };

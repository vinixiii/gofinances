import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { useAuth } from '../hooks/auth';

export function Routes() {
  const { user, isUserStorageLoading } = useAuth();

  return (
    <NavigationContainer>
      { user.id && !isUserStorageLoading ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}

import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';

import { AuthProvider, useAuth } from './auth';

import { mocked } from 'ts-jest/utils';
import { startAsync } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

fetchMock.enableMocks();

const userInfo = {
  id: '1',
  email: 'vini@email.com',
  name: 'Vinícius',
  photo: 'any_photo.png'
};

jest.mock('expo-auth-session');

describe('Auth Hook', () => {
  beforeEach(async () => {
      const userCollectionKey = '@gofinances:user'
      await AsyncStorage.removeItem(userCollectionKey)
  });

  it('should be able to sign in with an existing Google account', async () => {
    const googleMock = mocked(startAsync as any);

    googleMock.mockReturnValueOnce({
      type: 'success',
      params: {
        access_token: 'any_token',
      }
    });

    fetchMock.mockResponseOnce(JSON.stringify(userInfo));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user.email).toBe(userInfo.email);
  });

  it('user should not connect if cancel authentication with Google', async () => {
    const googleMock = mocked(startAsync as any);

    googleMock.mockReturnValueOnce({
      type: 'cancel',
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await act(() => result.current.signInWithGoogle());
    
    expect(result.current.user).not.toHaveProperty('id');
  });
});

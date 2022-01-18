import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';

import { AuthProvider, useAuth } from './auth';

fetchMock.enableMocks();

const userInfo = {
  id: 'any_id',
  email: 'john.doe@email.com',
  name: 'John Doe',
  photo: 'any_photo.png'
};

jest.mock('expo-auth-session', () => {
  return {
    startAsync: () => ({
      type: 'success',
      params: {
        access_token: 'any_token',
      }
    }),
  }
});

describe('Auth Hook', () => {
  it('should be able to sign in with an existing Google account', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(userInfo));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await act(() => result.current.signInWithGoogle());
    console.log(result.current.user.email);

    expect(result.current.user.email).toBe(userInfo.email);
  });
});

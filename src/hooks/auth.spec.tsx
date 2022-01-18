import { renderHook } from '@testing-library/react-hooks';

import { AuthProvider, useAuth } from './auth';

describe('Auth Hook', () => {
  it('should be able to sign in with an existing Google account', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    console.log(result);
  });
});

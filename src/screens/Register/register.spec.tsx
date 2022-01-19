import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';

import { Register } from '.';
import theme from '../../global/styles/theme';

const Providers: React.FC = ({ children }) => (
  <NavigationContainer>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </NavigationContainer>
);

describe('Register Screen', () => {
  it('should be open category modal when user click on button', async () => {
    const { getByTestId } = render(
      <Register />,
      {
        wrapper: Providers
      }
    );
    
    const categoryModal = getByTestId('modal-category');

    const categoryButton = getByTestId('button-category');
    fireEvent.press(categoryButton);
    
    await waitFor(() => {
      expect(categoryModal.props.visible).toBeTruthy();
    });
  });
});

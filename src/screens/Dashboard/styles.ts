import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;

  background-color: ${({ theme }) => theme.colors.background };
`

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.title };
`
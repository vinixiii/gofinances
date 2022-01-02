import React from 'react';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const { Navigator, Screen } = createBottomTabNavigator();

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === 'ios' ? getBottomSpace() - 20 : 0,
        }
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: (({ color, size }) => 
            <MaterialIcons name="format-list-bulleted" color={color} size={size} />
          )
        }}
      />
      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: (({ color, size }) => 
            <MaterialIcons name="attach-money" color={color} size={size} />
          )
        }}
      />
      <Screen
        name="Resumo"
        component={Resume}
        options={{
          tabBarIcon: (({ color, size }) => 
            <MaterialIcons name="pie-chart" color={color} size={size} />
          )
        }}
      />
    </Navigator>
  )
}
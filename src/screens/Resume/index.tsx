import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

import { categories } from '../../utils/categories';
import { HistoryCard } from '../../components/HistoryCard';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer
} from './styles';

interface TransactionProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
};

interface CategoryDataProps {
  key: string;
  name: string;
  color: string;
  totalFormatted: string;
  x: string;
  y: number;
}

export function Resume() {
  const theme = useTheme();

  const [totalByCategories, setTotalByCategories] = useState<CategoryDataProps[]>([]);

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';

    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    
    const expenses : TransactionProps[] = transactions
    .filter((expense: TransactionProps) => expense.type === 'negative');
    
    const expensesTotal = expenses
    .reduce((accumulator: number, expense: TransactionProps) => {
      return accumulator + Number(expense.amount);
    }, 0);

    console.log(expensesTotal);

    const totalByCategory : CategoryDataProps[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach(expense => {
        if(expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if(categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${(categorySum / expensesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          totalFormatted,
          x: percent,
          y: categorySum,
        });
      };
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo</Title>
      </Header>

      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight() - 40,
        }}
      >
        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape,
              }
            }}
            labelRadius={100}
          />
        </ChartContainer>

        {
          totalByCategories.map(item => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          ))
        }
      </Content>
    </Container>
  )
}

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { categories } from '../../utils/categories';
import { HistoryCard } from '../../components/HistoryCard';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadingContainer,
  Loading
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

  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date);
  const [totalByCategories, setTotalByCategories] = useState<CategoryDataProps[]>([]);

  function handleDateChange(action: 'next' | 'prev') {
    setIsLoading(true);

    if(action === 'next') {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
      console.log(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
      console.log(newDate);
    }
  }

  async function loadData() {
    const dataKey = '@gofinances:transactions';

    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    
    const expenses : TransactionProps[] = transactions
    .filter((expense: TransactionProps) => 
      expense.type === 'negative' &&
      new Date(expense.date).getMonth() === selectedDate.getMonth() &&
      new Date(expense.date).getFullYear() === selectedDate.getFullYear()
    );

    console.log(expenses);
    
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
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <Title>Resumo</Title>
      </Header>

      {
        isLoading
        ? <LoadingContainer><Loading /></LoadingContainer>
        : 
        
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight() - 40,
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>{ format(selectedDate, 'MMMM, yyyy', { locale: ptBR }) }</Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

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
      }
    </Container>
  )
}

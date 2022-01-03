import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard';

import {
  Container,
  Header,
  Title,
  CategoriesList
} from './styles';
import { categories } from '../../utils/categories';

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
  total: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryDataProps[]>([]);

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';

    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const expenses : TransactionProps[] = transactions
    .filter((expense: TransactionProps) => expense.type === 'negative');

    const totalByCategory : CategoryDataProps[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach(expense => {
        if(expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if(categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total,
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

      <CategoriesList>  
        {
          totalByCategories.map(item => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.total}
              color={item.color}
            />
          ))
        }
      </CategoriesList>
    </Container>
  )
}

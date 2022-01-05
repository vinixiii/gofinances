import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LoadingContainer,
  Loading,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const { user, signOut } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const filtteredCollection = collection
    .filter((item) => item.type === type);

    console.log(type, filtteredCollection);

    if(filtteredCollection.length === 0) {
      return 0;
    }

    const lastTransactionDate = new Date(Math.max.apply(Math, filtteredCollection
    .map((item) => new Date(item.date).getTime())));
  
    return `${lastTransactionDate.getDate()} de ${lastTransactionDate.toLocaleString('pt-BR', { month: 'long' })}`;
  };

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;

    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensesTotal = 0;
    
    const formattedTransactions: DataListProps[] = transactions.map((item: DataListProps) => {
      if(item.type === 'positive') {
        entriesTotal += Number(item.amount);
      } else {
        expensesTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      
      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }
    });

    setTransactions(formattedTransactions);

    const lastEntryDate = getLastTransactionDate(transactions, 'positive');
    const lastExpenseDate = getLastTransactionDate(transactions, 'negative');
    
    const totalInterval = lastExpenseDate === 0
    ? 'Não há transações'
    : `01 a ${lastExpenseDate}`

    const total = entriesTotal - expensesTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastEntryDate === 0
        ? 'Não há transações'
        : `Última entrada dia ${lastEntryDate}`,
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastExpenseDate === 0
        ? 'Não há transações'
        : `Última saída dia ${lastExpenseDate}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      }
    });

    setIsLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
      loadTransactions();
    }, []
  ));

  return (
    <Container>
      {
        isLoading
        ? <LoadingContainer><Loading /></LoadingContainer>
        :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>{user.name}</UserName>            
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>

          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.expenses.amount}
              lastTransaction={highlightData.expenses.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={ item => item.id }
              renderItem={({ item }) =>  <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      }
    </Container>
  )
}

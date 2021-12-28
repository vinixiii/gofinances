import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { Categories } from '../Categories';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

interface FormData {
  name: string;
  amount: string;
};

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório.'),
  amount: yup
    .number()
    .typeError('Informe um valor numérico.')
    .positive('O valor não pode ser negativo.')
    .required('O valor é obrigatório.'),
});

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const { 
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema)});

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleOpenCategoryModal() {
    setIsCategoryModalOpen(true);
  }

  function handleCloseCategoryModal() {
    setIsCategoryModalOpen(false);
  }

  function handleRegister(form: FormData) {
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação.');

    if(category.key === 'category') 
      return Alert.alert('Selecione a categoria da transação.');

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    }
    
    console.log(data);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Register</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name="name"
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              control={control}
              name="amount"
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                type='up'
                title="Income"
                onPress={() => handleTransactionTypeSelect('up')}
                isActive={transactionType === 'up'}
              />
              <TransactionTypeButton
                type='down'
                title="Outcome"
                onPress={() => handleTransactionTypeSelect('down')}
                isActive={transactionType === 'down'}
              />
            </TransactionTypes>
            
            <CategorySelectButton title={category.name} onPress={handleOpenCategoryModal} />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={isCategoryModalOpen} statusBarTranslucent={true}>
          <Categories
            category={category}
            setCategory={setCategory}
            closeCategorySelect={handleCloseCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}

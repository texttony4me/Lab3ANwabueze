import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import database from 'firebase/compat/database'
import firebase from './firebase';

const Tab = createBottomTabNavigator();

const itemList = [
  { name: 'Nike', price: 150, address: 'Toronto' },
  { name: 'FoodBasics', price: 70, address: 'Ottawa' },
  { name: 'Apple', price: 200, address: 'Hamilton' },
  { name: 'Microsoft', price: 120, address: 'London' },
  { name: 'GoodFitness', price: 80, address: 'Kingston' },
  { name: 'Uber', price: 90, address: 'Waterloo' },
  { name: 'Lyft', price: 60, address: 'Windsor' },
  { name: 'Starbucks', price: 100, address: 'Barrie' },
  { name: 'Amazon', price: 250, address: 'Sudbury' },
  { name: 'Ikea', price: 150, address: 'Markham' }
];

const TransactionsScreen = () => {
  
  const [transactions, setTransactions] = useState([]);
  const [initialListLoaded, setInitialListLoaded] = useState(false);
  const [newTransactionName, setNewTransactionName] = useState('');
  const [newTransactionPrice, setNewTransactionPrice] = useState('');


  useEffect(() => {
    fetchInitialList();
  }, []);

  const fetchInitialList = () => {
    firebase.database()
      .ref('/transactions')
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTransactions(Object.values(data));
        }
        setInitialListLoaded(true);
      })
      .catch(error => console.error(error));
  };

  const saveListToFirebase = () => {
    firebase.database()
      .ref('/transactions')
      .set(itemList) // Save itemList to Firebase
      .then(() => {
        console.log('List saved to Firebase');
        setTransactions(itemList); // Update the state with itemList
      })
      .catch(error => console.error(error));
  };

  const fetchTransactions = () => {
    firebase.database()
      .ref('/transactions')
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTransactions(Object.values(data));
        }
      })
      .catch(error => console.error(error));
  };

  const addTransaction = () => {
    const newTransaction = itemList[Math.floor(Math.random() * itemList.length)];

    firebase.database()
      .ref('/transactions')
      .push(newTransaction)
      .then(() => {
        console.log('Transaction added successfully');
        fetchTransactions(); // Refresh transactions after adding a new one
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      {initialListLoaded ? (
        <ScrollView style={styles.listContainer}>
          <Text style={styles.heading}>Transactions</Text>
          {/* Display Firebase data */}
          {transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <Text style={styles.transactionName}>{transaction.name}</Text>
              <Text style={styles.transactionPrice}>${transaction.price}</Text>
            </View>
          ))}

          {/* Display initial list */}
          {itemList.map((item, index) => (
            <View key={index} style={styles.transactionItem}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionPrice}>${item.price}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}

      {/* Add Transaction Form */}
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Transaction Name"
          value={newTransactionName}
          onChangeText={text => setNewTransactionName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Transaction Price"
          value={newTransactionPrice}
          onChangeText={text => setNewTransactionPrice(text)}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity onPress={addTransaction} style={styles.addButton}>
          <Text style={styles.buttonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TransactionDetailsScreen = ({ route }) => {
  const { name, price, address } = route.params.item;
  return (
    <View style={styles.container}>
      <Text style={styles.detailsText}>Name: {name}</Text>
      <Text style={styles.detailsText}>Price: ${price}</Text>
      <Text style={styles.detailsText}>Address: {address}</Text>
    </View>
  );
};

const SummaryScreen = () => {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [highestPrice, setHighestPrice] = useState(0);
  const [lowestPrice, setLowestPrice] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = () => {
    firebase.database()
      .ref('/transactions')
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const transactionList = Object.values(data);
          setTotalTransactions(transactionList.length);

          let max = 0;
          let min = Infinity;
          let total = 0;

          transactionList.forEach(transaction => {
            total += transaction.price;
            if (transaction.price > max) max = transaction.price;
            if (transaction.price < min) min = transaction.price;
          });

          setHighestPrice(max);
          setLowestPrice(min);
          setAveragePrice(total / transactionList.length);
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>Total Transactions: {totalTransactions}</Text>
      <Text style={styles.summaryText}>Highest Price: ${highestPrice}</Text>
      <Text style={styles.summaryText}>Lowest Price: ${lowestPrice}</Text>
      <Text style={styles.summaryText}>Average Spend Per Item: ${averagePrice.toFixed(2)}</Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Transactions') {
              iconName = focused ? 'list-circle' : 'list';
            } else if (route.name === 'Summary') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="Summary" component={SummaryScreen} />
        <Tab.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  listContainer: {
    flex: 1,
    marginBottom: 20
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5
  },
  transactionName: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'bold'
  },
  transactionPrice: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'normal'
  },
  formContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  }
});
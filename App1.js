import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {initialListLoaded ? (
        <>
          {/* Display Firebase data */}
          {transactions.map((transaction, index) => (
            <View key={index}>
              <Text>{transaction.name}</Text>
              <Text>${transaction.price}</Text>
            </View>
          ))}

          {/* Display initial list */}
          {itemList.map((item, index) => (
            <View key={index}>
              <Text>{item.name}</Text>
              <Text>${item.price}</Text>
            </View>
          ))}

          {/* Button to save list to Firebase */}
          <TouchableOpacity onPress={saveListToFirebase} style={{ marginTop: 20, padding: 10, backgroundColor: 'blue' }}>
            <Text style={{ color: 'white' }}>Save List to Firebase</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  itemText: {
    fontSize: 18,
  },
  detailsText: {
    fontSize: 20,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

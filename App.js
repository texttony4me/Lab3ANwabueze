import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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

const TransactionsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {itemList.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => navigation.navigate('TransactionDetails', { item })} style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemText}>${item.price}</Text>
        </TouchableOpacity>
      ))}
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
  const totalPrice = itemList.reduce((acc, item) => acc + item.price, 0);
  const highestPrice = Math.max(...itemList.map(item => item.price));
  const lowestPrice = Math.min(...itemList.map(item => item.price));
  const averagePrice = totalPrice / itemList.length;

  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>Total Transactions: {itemList.length}</Text>
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
              iconName = focused ? 'stats-chart' : 'analytics';
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
});

import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [averages, setAverages] = useState({});
  const [screen, setScreen] = useState('Home');
  const [newItem, setNewItem] = useState({ name: '', course: '', price: '' });
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    calculateAverages();
  }, [menuItems]);

  const calculateAverages = () => {
    const courses = menuItems.reduce((acc, item) => {
      if (!acc[item.course]) acc[item.course] = { total: 0, count: 0 };
      acc[item.course].total += item.price;
      acc[item.course].count += 1;
      return acc;
    }, {});

    const newAverages = {};
    for (let course in courses) {
      newAverages[course] = (courses[course].total / courses[course].count).toFixed(2);
    }
    setAverages(newAverages);
  };

  const addItem = () => {
    if (newItem.name && newItem.course && newItem.price) {
      setMenuItems([...menuItems, { ...newItem, id: Date.now() }]);
      setNewItem({ name: '', course: '', price: '' });
    }
  };

  const removeItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const filteredItems = courseFilter
    ? menuItems.filter(item => item.course.toLowerCase() === courseFilter.toLowerCase())
    : menuItems;

  return (
    <View style={{ padding: 20 }}>
      {screen === 'Home' && (
        <View>
          <Text>Average Prices by Course:</Text>
          {Object.entries(averages).map(([course, avg]) => (
            <Text key={course}>{course}: ${avg}</Text>
          ))}

          <Text>Complete Menu:</Text>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text>{item.name} - R{item.price}</Text>
            )}
          />

          <Button title="Go to Add Menu Screen" onPress={() => setScreen('AddMenuItem')} />
          <Button title="Go to Filter Screen" onPress={() => setScreen('Filter')} />
        </View>
      )}

      {screen === 'AddMenu' && (
        <View>
          <Text>..welcome to myCAFE restutant</Text>
          <Text>Add Menu Item</Text>
          <TextInput
            placeholder="Name"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          />
          <TextInput
            placeholder="Course (e.g., Starter)"
            value={newItem.course}
            onChangeText={(text) => setNewItem({ ...newItem, course: text })}
          />
          <TextInput
            placeholder="Price"
            value={newItem.price}
            keyboardType="numeric"
            onChangeText={(text) => setNewItem({ ...newItem, price: parseFloat(text) })}
          />
          <Button title="Add Menu Item" onPress={addItem} />

          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{item.name} - R{item.price}</Text>
                <Button title="Remove" onPress={() => removeItem(item.id)} />
              </View>
            )}
          />

          <Button title="Back to Home" onPress={() => setScreen('Home')} />
        </View>
      )}

      {screen === 'Filter' && (
        <View>
          <Text>Filter Menu by Course</Text>
          <TextInput
            placeholder="Enter Course (e.g., Starter)"
            value={courseFilter}
            onChangeText={setCourseFilter}
          />
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text>{item.name} - R{item.price}</Text>
            )}
          />

          <Button title="Back to Home" onPress={() => setScreen('Home')} />
        </View>
      )}
    </View>
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignments:'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width:'80%',
    textAlign:'center',
  },
    buttonSpacing:{
      marginVertical: 10,
      width:'20%',
    },
  
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  menuText:{
    fontSize:16,
  },
  removeButton:{
    backgroundColor:'RED',
    paddingHorizontal: 10,
    borderRadius: 5,
  }
});

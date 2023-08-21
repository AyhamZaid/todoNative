import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { initDB, addTodo, getTodos, deleteTodo, updateTodo } from './database';

export default function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    initDB()
      .then(() => {
        loadTodos();
      })
      .catch((error) => {
        console.log('Error initializing database:', error);
      });

    return () => {
      closeDatabase();
    };
  }, []);

  const loadTodos = () => {
    getTodos()
      .then((result) => {
        setTodos(result);
      })
      .catch((error) => {
        console.log('Error loading todos:', error);
      });
  };

  const handleAddTodo = () => {
    addTodo(task)
      .then((insertId) => {
        setTask('');
        loadTodos();
      })
      .catch((error) => {
        console.log('Error adding todo:', error);
      });
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id)
      .then((rowsAffected) => {
        loadTodos();
      })
      .catch((error) => {
        console.log('Error deleting todo:', error);
      });
  };

  const handleToggleTodo = (id, completed) => {
    updateTodo(id, completed ? 0 : 1)
      .then((rowsAffected)=> {
        loadTodos();
      })
      .catch((error) => {
        console.log('Error updating todo:', error);
      });
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        onPress={() => handleToggleTodo(item.id, item.completed)}
      >
        <Text
          style={[
            styles.todoText,
            item.completed && styles.completedTodoText,
          ]}
        >
          {item.task}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTodo(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <Button title="Add" onPress={handleAddTodo} />
      </View>

      <FlatList
        style={styles.todoList}
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  todoList: {
    marginTop: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  todoText: {
    flex: 1,
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
  },
});
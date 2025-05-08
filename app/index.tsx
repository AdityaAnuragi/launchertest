import {Text, View, StyleSheet, TextInput, Button, Alert} from 'react-native'
import {useEffect, useState} from "react";
import {router} from "expo-router";

export default function Pin() {

  const [pin, setPin] = useState('');

  useEffect(() => {
    // router.replace("/locationTurnOn")
  }, []);

  function handleButtonPress() {
    // console.log("pin", pin);

    if (pin === "1234") {
      router.replace("/locationTurnOn")
    }

    else {
      Alert.alert("Incorrect credentials", "You have entered the wrong pin", undefined, {cancelable: true});
    }

  }

  return (
    <View  style={[styles.container, styles.borders]} >
      <Text style={styles.titleText} >Enter your PIN </Text>
      <TextInput value={pin} onChangeText={setPin} keyboardType="numeric" style={styles.input} />
      <Button title="Login" onPress={handleButtonPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    // padding: 10,
  },

  borders: {
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
  },

  container: {
    padding: 16,
    height: '100%',
  }
})
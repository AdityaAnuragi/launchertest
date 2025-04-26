import Index from "@/app/home";

import * as Location from 'expo-location';

import {Text, View, StyleSheet} from 'react-native'
import {useEffect, useState} from "react";
import {router} from "expo-router";
// import {setInterval} from "node:timers";

export default function Login() {

  const [isLocationOn, setLocationOn] = useState(false);

  // console.log('is location on?');

  async function extracted() {

    const result = await Location.hasServicesEnabledAsync()
    // if it was previously off, and now it has turned on then reroute
    if(!isLocationOn && result) {
      console.log("inside")
      router.replace("/home")
    }
    setLocationOn(result)
  }

  useEffect(() => {
    void extracted()
  }, []);

  useEffect(() => {
    const clearId = setInterval(() => {
      void extracted()
    }, 500)

    return () => {
      clearInterval(clearId)
    }

  }, []);

  return (
    <>
      <View style={[styles.container, styles.borders]}>
        {!isLocationOn && <Text>Make sure location is on</Text>}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  borders: {
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: 'white',
  },

  container: {
    height: '100%',
  }
})
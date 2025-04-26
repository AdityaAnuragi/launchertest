import {useStopWatch} from "@/customHooks/useStopWatch";
import {useEffect, useRef, useState} from "react";
import {PermissionsAndroid, Text, View, StyleSheet, TextInput, Button, Switch} from "react-native";

import WifiManager from "react-native-wifi-reborn"

export default function Index() {
  const [wifiInput, setWifiInput] = useState("NodeMCU")
  const [passwordInput, setPasswordInput] = useState("12345678")
  // const [isLocationOn, setIsLocationOn] = useState(false)
  // const [timeTaken, setTimeTaken] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [wifiName, setWifiName] = useState("")
  // const [isLocationOn, setIsLocationOn] = useState()
  const [_error, setError] = useState(false)
  const [reqTo, setReqTo] = useState("192.168.4.1/login")
  const [isHiddenNetwork, setIsHiddenNetwork] = useState(false)

  const [isTicking, timeElapsed, toggle] = useStopWatch(1)

  const grantedRef = useRef(false)

  // console.log("Nice")

  function makeReq() {
    fetch(reqTo).then(r => console.log(r))
  }

  useEffect(() => {
    (async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission is required for WiFi connections',
          message:
            'This app needs location permission as this is required  ' +
            'to scan for wifi networks.',
          buttonNegative: 'DENY',
          buttonPositive: 'ALLOW',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        grantedRef.current = true
      }
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   console.log("inside useEffect")
      //   const result = await WifiManager.getCurrentWifiSSID()
      //   setWifiName(result)
      // } else {
      //   setError(true)
      // }


    })()

  }, [])

  // function getCurrentWifi() {
  //   setIsLoading(true);
  //   (async () => {
  //     if (grantedRef.current) {
  //       console.log("inside useEffect")

  //       try {
  //         const result = await WifiManager.getCurrentWifiSSID()
  //         console.log(`The wifi name is ${result}`)
  //         setWifiName(result)
  //       }

  //       catch (e) {
  //         if (e instanceof Error) {
  //           console.log("Error detecting the current Wi-Fi")
  //           console.log(e.message)
  //         }
  //       }

  //       finally {
  //         setIsLoading(false)
  //       }

  //     } else {
  //       setError(true)
  //     }
  //   })()

  // }

  function handlePress() {
    console.log("Inside button handler")
    toggle();
    setIsLoading(true);
    // const initialTime = Date.now();
    (async () => {
      try {
        await WifiManager.connectToProtectedSSID(wifiInput.trim(), passwordInput.trim(), false, isHiddenNetwork);
        // setTimeTaken(Date.now() - initialTime);
        setWifiName(wifiInput.trim());

        // fetch(reqTo).then(r => console.log(r))

      } catch (e) {
        setError(true)
        console.log("Connection error")
        console.log(e)
      } finally {
        setIsLoading(false)
        toggle()
      }
    })()
  }


  // if (error) {
  //   return (
  //     <View
  //       style={styles.view}
  //     >
  //       <Text>An unexpected error has occurred</Text>
  //     </View>
  //   );
  // }

  return (
    <View
      style={[styles.view, /*styles.borders*/]}
    >
      {/*<Text style={[styles.text, styles.marginBottom]}>*/}
      {/*  Make sure location is turned on*/}
      {/*</Text>*/}

      <View style={[styles.viewInputs]}>

        <Text>Make req to</Text>
        <TextInput
          style={styles.input}
          value={reqTo}
          onChangeText={setReqTo}
        />

        <View style={[styles.marginTop, styles.horizontalCenter, styles.marginBottom]}>
          <Button
            onPress={makeReq}
            title={isLoading ? "Loading..." : "Request only"}
          />
        </View>

        <Text>Wifi name</Text>
        <TextInput
          style={styles.input}
          value={wifiInput}
          onChangeText={setWifiInput}
        />

        <Text>Password </Text>
        <TextInput
          style={styles.input}
          value={passwordInput}
          onChangeText={setPasswordInput}
          secureTextEntry
        />

        <Text style={styles.marginBottom} >
          Is it hidden?
        </Text>
        <Switch
          value={isHiddenNetwork}
          onValueChange={(newValue) => setIsHiddenNetwork(newValue) }
        />


      </View>

      {/*<View style={styles.viewInputs}>*/}
      {/*  <Text>Password </Text>*/}
      {/*  <TextInput*/}
      {/*    style={styles.input}*/}
      {/*    value={passwordInput}*/}
      {/*    onChangeText={setPasswordInput}*/}
      {/*    secureTextEntry*/}
      {/*  />*/}

      {/*</View>*/}

      <View style={styles.marginTop}>
        <Button
          onPress={handlePress}
          title={isLoading ? "Loading..." : "Connect only"}
        />

      </View>

      {/*<View style={styles.marginTop}>*/}
      {/*    <Button*/}
      {/*        onPress={toggle}*/}
      {/*        title={isTicking ? "Stop" : "Start"}*/}
      {/*    />*/}

      {/*</View>*/}

      {isTicking && <Text>Connecting...</Text>}
      <Text style={[styles.text, styles.marginTop]}>{`Time taken ${timeElapsed}`}</Text>

      <View style={styles.marginTop}>
        {/*<Text style={[styles.text, styles.marginTop]}>{`You are connected to: ${wifiName || 'No Wi-Fi connection detected'}`}</Text>*/}
        <Text style={[styles.text, styles.marginTop]}>{`You are connected to: ${wifiName}`}</Text>
      </View>

      {!!timeElapsed && <Text>{`Time taken to connect: ${timeElapsed}`}</Text>}

    </View>
  );
}

const viewInputsMarginLeftAndRight = 20

const styles = StyleSheet.create({
  input: {
    // flexGrow: 1,
    alignSelf: "stretch",
    height: 40,
    // minWidth: 180,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "lightblue",
    paddingTop: 50
  },

  viewInputs: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "stretch",

    marginLeft: viewInputsMarginLeftAndRight,
    marginRight: viewInputsMarginLeftAndRight,

  },

  button: {
    marginBottom: 10
  },

  text: {
    // marginTop: 10,
    fontSize: 20,
  },

  marginTop: {
    marginTop: 20
  },

  marginBottom: {
    marginBottom: 20
  },

  borders: {
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 6,
  },

  horizontalCenter: {
    marginLeft: "auto",
    marginRight: "auto"
  }

});
import {useStopWatch} from "@/customHooks/useStopWatch";
import {useEffect, useRef, useState} from "react";
import {PermissionsAndroid, Text, View, StyleSheet, TextInput, Button, Switch, Alert} from "react-native";

import WifiManager from "react-native-wifi-reborn"

import * as Location from 'expo-location';

export default function Index() {
  const [wifiInput, setWifiInput] = useState("47280F66713G48A")
  const [passwordInput, setPasswordInput] = useState("12345678")
  // const [isLocationOn, setIsLocationOn] = useState(false)
  // const [timeTaken, setTimeTaken] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [wifiName, setWifiName] = useState("")
  // const [isLocationOn, setIsLocationOn] = useState()
  const [error, setError] = useState(false)
  // const [reqTo, setReqTo] = useState("192.168.4.1/login")
  const [isHiddenNetwork, setIsHiddenNetwork] = useState(false)
  // const [data, setData] = useState("")
  const [success, setSuccess] = useState<SuccessStatus>({wifi: false, location: false})
  const [isLocationBeingFetched, setIsLocationBeingFetched] = useState(false)
  const [isWifiBeingTried, setIsWifiBeingTried] = useState(false)

  const [isTicking, _timeElapsed, _toggle] = useStopWatch(1)

  const grantedRef = useRef(false)

  console.log("Nice")

  // function makeReq() {
  //   console.log("inside")
  //   void fetch(reqTo)
  //     // .then(r => r.json())
  //     // .then(res => {
  //     //   setData(res.title)
  //     //   console.log(res)
  //     // })
  //     // .catch(err => {
  //     //   setData("asdf, error")
  //     //   console.log(err)
  //     // })
  // }

  useEffect(() => {
    (async () => {
      let granted = await PermissionsAndroid.request(
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

      granted = granted === PermissionsAndroid.RESULTS.GRANTED ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION) : "denied"
      granted = granted === PermissionsAndroid.RESULTS.GRANTED ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_STATE) : "denied"
      granted = granted === PermissionsAndroid.RESULTS.GRANTED ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CHANGE_NETWORK_STATE) : "denied"
      granted = granted === PermissionsAndroid.RESULTS.GRANTED ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.internet) : "denied"
      granted = granted === PermissionsAndroid.RESULTS.GRANTED ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE) : "denied"
      console.log(granted)
      console.log("is it working?")

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

  async function getCurrentLocation() {
    setIsLocationBeingFetched(true);
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync();

    const {latitude} = location.coords
    const {longitude} = location.coords

    console.log("get current location", latitude, longitude)

    if (latitude >= 13.114662715885975 && latitude <= 13.117499907647492 && longitude >= 77.63381859364652 && longitude <= 77.6374340448472) {
      setSuccess(prevState => {
        return {
          ...prevState,
          location: true
        }
      })
    } else {
      // Don't put this in production
      setSuccess(prevState => {
        return {
          ...prevState,
          location: true
        }
      })
    }
    setIsLocationBeingFetched(false)

  }

  // useEffect(() => {
  //   console.log("checking for Location and trying to connect")
  //
  //   void retry()
  //
  //   // void tryConnecting()
  //   // void getCurrentLocation();
  //
  //   // console.log(Location)
  // }, []);

  console.log("reload pls", success.wifi, success.location)

  useEffect(() => {
    console.log(`Wifi: ${success.wifi} location ${success.location}`);
    if (success.wifi && success.location) {
      console.log("Wifi connection and location verified successfully")
      Alert.alert("Attendance recorded", "Your attendance has been marked", undefined, {cancelable: true});
    }
  }, [success]);

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

  const tryConnecting = async () => {
    try {
      setIsWifiBeingTried(true)
      await WifiManager.connectToProtectedSSID(wifiInput.trim(), passwordInput.trim(), false, isHiddenNetwork);
      // setTimeTaken(Date.now() - initialTime);
      setWifiName(wifiInput.trim());
      console.log("about to set success")
      setSuccess(prevState => {
        return {
          ...prevState,
          wifi: true
        }
      })
      // fetch(reqTo).then(r => console.log(r))

    } catch (e) {
      setError(true)
      console.log("Connection error")
      console.log(e)
    } finally {
      setIsLoading(false)
      setIsWifiBeingTried(false)
      // toggle()
    }
  }

  async function retry() {
    console.log("Retry button");
    // (async () => {
    if (!success.wifi) {
      await tryConnecting()
    }

    if (!success.location) {
      await getCurrentLocation()
    }
    // })()
  }

  // function handlePress() {
  //   console.log("Inside button handler")
  //   // toggle();
  //   setIsLoading(true);
  //   // const initialTime = Date.now();
  //   void tryConnecting()
  // }


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

      <Text> Wifi: {isWifiBeingTried ? "Verifying wifi..." : success.wifi ? "Verified" : "not yet verified"} </Text>
      <Text>
        Location: {isLocationBeingFetched ? "Locating..." : success.location ? "Verified" : "not yet verified"}
      </Text>

      <View style={[styles.viewInputs]}>

        {/*<Text>Make req to</Text>*/}
        {/*<TextInput*/}
        {/*  style={styles.input}*/}
        {/*  value={reqTo}*/}
        {/*  onChangeText={setReqTo}*/}
        {/*/>*/}

        {/*<View style={[styles.marginTop, styles.horizontalCenter, styles.marginBottom]}>*/}
        {/*  <Button*/}
        {/*    onPress={makeReq}*/}
        {/*    title={isLoading ? "Loading..." : "Request only"}*/}
        {/*  />*/}
        {/*</View>*/}

        {/*<Text>{data}</Text>*/}

        {/*<Text>Wifi name</Text>*/}
        {/*<TextInput*/}
        {/*  style={styles.input}*/}
        {/*  value={wifiInput}*/}
        {/*  onChangeText={setWifiInput}*/}
        {/*/>*/}

        {/*<Text>Password </Text>*/}
        {/*<TextInput*/}
        {/*  style={styles.input}*/}
        {/*  value={passwordInput}*/}
        {/*  onChangeText={setPasswordInput}*/}
        {/*  secureTextEntry*/}
        {/*/>*/}

        <Text style={styles.marginBottom}>
          Is it hidden?
        </Text>
        <Switch
          value={isHiddenNetwork}
          onValueChange={(newValue) => setIsHiddenNetwork(newValue)}
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

      {/*<View style={styles.marginTop}>*/}
      {/*  <Button*/}
      {/*    onPress={handlePress}*/}
      {/*    title={isLoading ? "Loading..." : "Connect only"}*/}
      {/*  />*/}

      {/*</View>*/}

      {/*<View style={styles.marginTop}>*/}
      {/*    <Button*/}
      {/*        onPress={toggle}*/}
      {/*        title={isTicking ? "Stop" : "Start"}*/}
      {/*    />*/}

      {/*</View>*/}

      {/*{isTicking && <Text>Connecting...</Text>}*/}
      {/*<Text style={[styles.text, styles.marginTop]}>{`Time taken ${timeElapsed}`}</Text>*/}

      {/*<View style={styles.marginTop}>*/}
      {/*  /!*<Text style={[styles.text, styles.marginTop]}>{`You are connected to: ${wifiName || 'No Wi-Fi connection detected'}`}</Text>*!/*/}
      {/*  <Text style={[styles.text, styles.marginTop]}>{`You are connected to: ${wifiName}`}</Text>*/}
      {/*</View>*/}

      {/*{!!timeElapsed && <Text>{`Time taken to connect: ${timeElapsed}`}</Text>}*/}

      <Button title="Verify Now" onPress={retry}/>

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

type SuccessStatus = {
  wifi: boolean,
  location: boolean
}
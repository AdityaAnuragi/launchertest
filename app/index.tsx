import {useStopWatch} from "@/customHooks/useStopWatch";
import {useEffect, useRef, useState} from "react";
import {PermissionsAndroid, Text, View, StyleSheet, TextInput, Button} from "react-native";

import WifiManager from "react-native-wifi-reborn"

export default function Index() {
    const [wifiInput, setWifiInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    // const [isLocationOn, setIsLocationOn] = useState(false)
    const [timeTaken, setTimeTaken] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [wifiName, setWifiName] = useState("")
    // const [isLocationOn, setIsLocationOn] = useState()
    const [_error, setError] = useState(false)
    const [isTicking, timeElapsed, toggle] = useStopWatch(1)
    const grantedRef = useRef(false)

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
        toggle()
        setIsLoading(true)
        const initialTime = Date.now();
        (async () => {
            try {
                await WifiManager.connectToProtectedSSID(wifiInput.trim(), passwordInput.trim(), false, false);
                setTimeTaken(Date.now() - initialTime);
                setWifiName(wifiInput.trim());
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
            style={styles.view}
        >
            <Text style={[styles.text, styles.marginBottom]} >
                Make sure location is turned on
            </Text>

            <View style={styles.viewInputs}>
                <Text>Wifi name</Text>
                <TextInput
                    style={styles.input}
                    value={wifiInput}
                    onChangeText={setWifiInput}
                />

            </View>

            <View style={styles.viewInputs}>
                <Text>Password </Text>
                <TextInput
                    style={styles.input}
                    value={passwordInput}
                    onChangeText={setPasswordInput}
                    secureTextEntry
                />

            </View>

            <View style={styles.marginTop}>
                <Button
                    onPress={handlePress}
                    title={isLoading ? "Loading..." : "Connect"}
                />

            </View>

            {/*<View style={styles.marginTop}>*/}
            {/*    <Button*/}
            {/*        onPress={toggle}*/}
            {/*        title={isTicking ? "Stop" : "Start"}*/}
            {/*    />*/}

            {/*</View>*/}

            {isTicking && <Text>Connecting</Text>}
            <Text style={[styles.text, styles.marginTop]} >{`Time taken ${timeElapsed}`}</Text>

            <View style={styles.marginTop}>
                {/*<Text style={[styles.text, styles.marginTop]}>{`You are connected to: ${wifiName || 'No Wi-Fi connection detected'}`}</Text>*/}
                <Text style={[styles.text, styles.marginTop]}>{`You are connected to: ${wifiName}`}</Text>
            </View>

            {!!timeTaken && <Text>{`Time taken to connect: ${timeTaken}`}</Text>}

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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue"
    },

    viewInputs: {
        display: "flex",
        // flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        alignSelf: "stretch",

        marginLeft: viewInputsMarginLeftAndRight,
        marginRight: viewInputsMarginLeftAndRight,
        // borderColor: "red",
        // borderStyle: "solid",
        // borderWidth: 6,
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
    }

});
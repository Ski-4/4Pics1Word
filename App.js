import { StatusBar } from "expo-status-bar";
import { SUPABASE_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  ActivityIndicator,
  FlatList,
  Platform,
  Animated,
  Vibration,
} from "react-native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import Letter from "./components/Letter";
import Output from "./components/Output";
import Output1 from "./components/Output1";
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import { createClient } from "@supabase/supabase-js";
import { useRef, useState } from "react";
import { useEffect } from "react";

export default function App() {
  let [obj, setObj] = useState({
    data: {},
    index: 0,
    result: [],
    fetchIndex: 2,
    success: false,
    currTime: 3,
    pos: [],
    letterValid: [],
  });
  // let [obj.data, setobj.data] = useState({});
  // let [obj.index, setIndex] = useState(0);
  // let [obj.result, setResult] = useState("");
  // let [currTime, setCurrTime] = useState(5);
  // let [fetchIndex, setFetchIndex] = useState(2);

  // let [obj.success, setSuccess] = useState(false);

  let fadeAnim = useRef(new Animated.Value(0)).current;
  let shakeAnimation = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  function deleteResult() {
    if (obj.index <= 0) return;

    let temp = Array.from(obj.result);
    temp[obj.index - 1] = "*";
    let tempValid = obj.letterValid;
    tempValid[obj.pos[obj.index - 1]] = true;
    setObj((prevState) => {
      return {
        ...prevState,
        result: temp,
        index: obj.index - 1,
        letterValid: tempValid,
      };
    });
  }

  function updateTime(seconds) {
    if (seconds == 0) {
      setObj({
        data: {},
        index: 0,
        result: [],
        pos: [],
        letterValid: [],
        fetchIndex: obj.fetchIndex + 1,
        success: false,
        currTime: 3,
      });
      fadeAnim = new Animated.Value(0);
      return;
    }
    setTimeout(() => {
      setObj((prevState) => {
        return { ...prevState, currTime: seconds - 1 };
      });
      updateTime(seconds - 1);
    }, 1000);
  }

  function updateResult(val, index) {
    if (obj.index >= obj.result.length) return;
    let temp = Array.from(obj.result);
    temp[obj.index] = val;
    if (
      obj.index + 1 === obj.result.length &&
      temp.join("") === obj.data["ans"]
    ) {
      setObj((prevState) => {
        return {
          ...prevState,
          result: temp.join(""),
          index: obj.index + 1,
          success: true,
        };
      });
      updateTime(obj.currTime);
      return;
    }
    if (obj.index + 1 === obj.result.length) {
      setTimeout(() => {
        startShake();
        Vibration.vibrate();
      }, 200);
    }
    let tempPos = obj.pos;
    tempPos[obj.index] = index;
    let tempEnabled = obj.letterValid;
    tempEnabled[index] = false;
    setObj((prevState) => {
      return {
        ...prevState,
        result: temp,
        index: obj.index + 1,
        pos: tempPos,
        letterValid: tempEnabled,
      };
    });
  }

  async function getFunc() {
    const supabaseUrl = "https://dobkyfcqgyawfazdevcy.supabase.co";
    const supabaseAnonKey = SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage, // for example can use @react-native-async-storage/async-storage
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    let { data, error } = await supabase
      .from("List")
      .select("*")
      .eq("id", obj.fetchIndex);

    if (obj.data["ans"] !== undefined || data.length === 0) return;
    setObj((prevState) => {
      return {
        ...prevState,
        data: data[0],
        result: Array(data[0]["ans"].length).fill("*"),
        pos: Array(data[0]["ans"].length).fill(-1),
        letterValid: Array(data[0]["letters"].length).fill(true),
      };
    });
  }

  let startShake = () => {
    Animated.loop(
      // runs the animation array in sequence
      Animated.sequence([
        // shift element to the left by 2 units
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        // shift element to the right by 2 units
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        // bring the element back to its original position
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
      // loops the above animation config 2 times
      { iterations: 2 }
    ).start();
  };

  useEffect(() => {
    getFunc();
  }, [obj.success]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/bg.jpg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        {obj.data["ans"] == undefined ? (
          <ActivityIndicator
            style={{ flex: 1, justifyContent: "center" }}
            color="white"
            size="large"
          />
        ) : (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: obj.success === true ? "center" : undefined,
              }}
            >
              <View
                style={{
                  justifyContent:
                    obj.success === true ? "center" : "flex-start",
                  marginTop: obj.success === false ? 40 : 0,
                  marginBottom: obj.success === true ? 30 : 0,

                  maxWidth: 700,
                  paddingHorizontal: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      overflow: "hidden",
                      marginRight: 4,
                      borderColor: "#ffffff",
                      borderWidth: 3,
                    }}
                  >
                    <Image
                      style={{
                        flex: 1,
                        // width: "100%",
                        // height: undefined,
                      }}
                      resizeMode="cover"
                      source={{ uri: obj.data["image1"] }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      //   overflow: "hidden",
                      marginLeft: 4,
                      borderColor: "#ffffff",
                      borderWidth: 3,
                    }}
                  >
                    <Image
                      style={{
                        flex: 1,
                        // width: undefined,
                        // height: undefined,
                        resizeMode: "cover",
                      }}
                      source={{ uri: obj.data["image2"] }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      aspectRatio: 1,
                      marginRight: 4,
                      borderColor: "#ffffff",
                      borderWidth: 3,
                    }}
                  >
                    <Image
                      style={{
                        flex: 1,
                        // width: undefined,
                        // height: undefined,
                        // resizeMode: "cover",
                      }}
                      source={{ uri: obj.data["image3"] }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      overflow: "hidden",
                      marginLeft: 4,
                      borderColor: "#ffffff",
                      borderWidth: 3,
                    }}
                  >
                    <Image
                      style={{
                        flex: 1,
                        width: undefined,
                        height: undefined,
                        resizeMode: "cover",
                      }}
                      source={{ uri: obj.data["image4"] }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: obj.success === false ? 1 : undefined,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    Your Prediction
                  </Text>
                  <Animated.View
                    style={{
                      marginVertical: 8,
                      transform: [{ translateX: shakeAnimation }],
                      // backgroundColor: "red",
                    }}
                  >
                    <FlatList
                      style={{ flexGrow: 0 }}
                      data={obj.result}
                      horizontal={true}
                      renderItem={(item) =>
                        item.item === "*" ? (
                          <Output1 />
                        ) : (
                          <Output
                            text={item.item}
                            deleteResult={deleteResult}
                            success={obj.success}
                            displayCross={
                              (item.index === obj.index - 1) &
                              (obj.success === false)
                                ? true
                                : false
                            }
                          />
                        )
                      }
                    />
                  </Animated.View>
                </View>
              </View>
            </View>
            {obj.success === true ? (
              <Animated.View
                style={{
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "white",
                    textTransform: "uppercase",
                  }}
                >
                  Correct Answer
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.6)" }}>
                  Next Question in {obj.currTime}
                </Text>
              </Animated.View>
            ) : null}

            {obj.success === false ? (
              <View
                style={{
                  marginBottom: 50,
                }}
              >
                <FlatList
                  data={obj.data["letters"]}
                  numColumns={5}
                  renderItem={(item) => (
                    <Letter
                      text={item.item}
                      pos={item.index}
                      updateResult={updateResult}
                      enabled={obj.letterValid[item.index]}
                    />
                  )}
                  contentContainerStyle={{
                    alignSelf: "center",
                  }}
                />
              </View>
            ) : null}
          </>
        )}
      </ImageBackground>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    paddingTop: Platform.OS === "android" ? 24 : 0,
    width: "100%",
    flex: 1,
  },
});

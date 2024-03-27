import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Output = () => {
  return (
    <View
      style={{
        padding: 3,
        borderWidth: 2,
        borderColor: "white",
      }}
    >
      <LinearGradient
        colors={["#ffffff50", "#e0e0e050"]}
        style={{
          height: 50,
          width: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      ></LinearGradient>
    </View>
  );
};

export default Output;

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

const Letter = (props) => {
  return (
    <TouchableNativeFeedback
      useForeground={true}
      background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.25)", false)}
      disabled={!props.enabled}
      onPress={() => props.updateResult(props.text, props.pos)}
    >
      <LinearGradient
        colors={["#ffffff", "#d8d8d8", "#b2b1b1"]}
        style={{
          paddingVertical: 5,
          width: 48,
          elevation: 5,
          marginHorizontal: 5,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: 28,
            fontWeight: "800",
            color: props.enabled === true ? "#252525" : "#25252544",
          }}
        >
          {props.text}
        </Text>
      </LinearGradient>
    </TouchableNativeFeedback>
  );
};

export default Letter;

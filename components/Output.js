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
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Output = (props) => {
  return (
    <View
      style={{
        padding: 3,
        borderWidth: 2,
        borderColor: "white",
      }}
    >
      <TouchableNativeFeedback
        onPress={() => {
          if (!props.success) props.deleteResult();
        }}
      >
        <View
          // colors={["#ffffffa7", "#e0e0e0a7"]}
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          {props.displayCross === true ? (
            <View
              style={{
                size: 24,
                position: "absolute",
                top: 2,
                right: 2,
                backgroundColor: "#6b727b",
                borderRadius: 8,
              }}
            >
              <Entypo name="cross" size={12} color="white" />
            </View>
          ) : null}
          <Text
            style={{
              fontSize: 32,
              color: "#2d5879",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            {props.text}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default Output;

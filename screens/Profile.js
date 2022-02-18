import React, { useMemo } from "react";
import { Text, View } from "react-native";

export default function Profile({ navigation, route }) {
  useMemo(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route.params.username,
      }); // setOptions는 Screen의 options 설정을 의미힌다
    }
  }, []);
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white" }}>Someones Profile</Text>
    </View>
  );
}

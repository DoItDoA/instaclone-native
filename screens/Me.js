import React, { useMemo } from "react";
import { Text, View } from "react-native";
import useMe from "../hooks/useMe";

export default function Me({ navigation }) {
  const { data } = useMe();
  useMemo(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
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
      <Text style={{ color: "white" }}>Me</Text>
    </View>
  );
}

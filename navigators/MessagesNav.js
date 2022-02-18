import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Room from "../screens/Room";
import Rooms from "../screens/Rooms";

const Stack = createNativeStackNavigator();

export default function MessagesNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerBackTitleVisible: false,
        headerStyle: {
          borderBottomColor: "rgba(255, 255, 255, 0.3)",
          shadowColor: "rgba(255, 255, 255, 0.3)",
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen
        name="Rooms"
        component={Rooms}
        options={{ headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="Room"
        component={Room}
        options={{ headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}

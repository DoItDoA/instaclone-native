import React, { useEffect, useState } from "react";
import Photo from "../screens/Photo";
import Profile from "../screens/Profile";
import Feed from "../screens/Feed";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Me from "../screens/Me";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";

const Stack = createNativeStackNavigator();

export default function SharedStackNav({ screenName }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
        },
        headerTitleAlign: "center",
      }}
    >
      {screenName === "Feed" ? (
        <Stack.Screen
          name="StackFeed"
          component={Feed}
          options={{
            headerTitle: () => (
              <Image
                style={{
                  width: 200,
                  height: 80,
                }}
                resizeMode="contain"
                source={require("../assets/logo.png")}
              />
            ),
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name="StackSearch" component={Search} />
      ) : null}
      {screenName === "Notifications" ? (
        <Stack.Screen name="StackNotifications" component={Notifications} />
      ) : null}
      {screenName === "Me" ? (
        <Stack.Screen name="StackMe" component={Me} />
      ) : null}
      <Stack.Screen name="StackProfile" component={Profile} />
      <Stack.Screen name="StackPhoto" component={Photo} />
      <Stack.Screen name="StackLikes" component={Likes} />
      <Stack.Screen name="StackComments" component={Comments} />
    </Stack.Navigator>
  );
}

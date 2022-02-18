import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export default function UploadNav() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "black",
        },
        tabBarActiveTintColor: "white", // 선택 글자색
        tabBarIndicatorStyle: {
          backgroundColor: "white",
          top: 0,
        }, // 선택된 바 색
      }}
    >
      <Tab.Screen name="Select">
        {/* 자식 요소로 컴포넌트 사용할 시 함수형태로 반환한다 */}
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: "center",
              headerTintColor: "white",
              headerBackTitleVisible: false,
              headerLeft: ({ tintColor }) => (
                <Ionicons
                  color={tintColor}
                  name="close"
                  size={28}
                  onPress={() => navigation.navigate("Tabs")}
                />
              ), // 백 버튼을 아이콘으로 변경

              headerStyle: {
                backgroundColor: "black",
                shadowOpacity: 0.3,
              },
            }}
          >
            <Stack.Screen
              name="StackSelect"
              options={{ title: "사진 선택하기" }}
              component={SelectPhoto}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>
  );
}

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View } from "react-native";
import TabIcon from "../components/nav/TabIcon";
import SharedStackNav from "./SharedStackNav";
import useMe from "../hooks/useMe";

const Tabs = createBottomTabNavigator();

export default function TabsNav() {
  const { data } = useMe();
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white", // 탭의 메뉴 색
        headerShown: false,
        tabBarShowLabel: false, // 기본적으로 Screen의 name을 표시하는데 가려줌
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "rgba(255, 255, 255, 0.3)",
        },
      }}
    >
      <Tabs.Screen
        name="Feed"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName="home" color={color} focused={focused} />
          ), // color는 activeTintColor로부터 가져온다
        }}
      >
        {/* 자식 요소를 이용하려면 함수를 만들고 리턴해야한다 */}
        {() => <SharedStackNav screenName="Feed" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName="search" color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Search" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Camera"
        component={View}
        listeners={({ navigation }) => {
          return {
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Upload");
            },
          };
        }} // 카메라 아이콘 클릭시 tabPress가 작동하여 listeners가 읽어 실행
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName="camera" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName="heart" color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Notifications" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Me"
        options={{
          tabBarIcon: ({ focused, color }) =>
            data?.me?.avatar ? (
              <Image
                source={{ uri: data.me.avatar }}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  ...(focused && { borderColor: "white", borderWidth: 1 }),
                }}
              />
            ) : (
              <TabIcon iconName={"person"} color={color} focused={focused} />
            ),
        }}
      >
        {() => <SharedStackNav screenName="Me" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

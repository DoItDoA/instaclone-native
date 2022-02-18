import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/Welcome";
import LogIn from "../screens/LogIn";
import CreateAccount from "../screens/CreateAccount";

const Stack = createNativeStackNavigator();

// 리액트 라우터와 같다
export default function LoggedOutNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "",
        headerTransparent: true, // 헤더바 투명해지기
        headerTintColor: "white", // 헤더 컬러 변경
      }}
    >
      {/* 실행시 맨처음 컴포넌트 호출 */}
      <Stack.Screen
        name="Welcome"
        options={{
          headerShown: false,
        }} // 헤더 지우기
        component={Welcome}
      />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
}

/*
https://reactnavigation.org/docs/stack-navigator 참조

Stack.Navigator의 props -> 전체 적용 시킴
initialRouteName -> Stack.Navigator 중에서 제일 먼저 호출설정  ex)initialRouteName="LogIn" 설정시 Welcome이 아닌 Login부터 첫화면 호출
screenOptions={{ presentation: "modal" } 모달 방식으로 변경, screenOptions를 통해 여러 옵션 적용

Stack.Screen의 props
options={{ title: "로그인" }}
*/

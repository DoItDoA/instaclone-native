import AppLoading from "expo-app-loading"; // 로딩이나 새로고침시 화면 표시한다. 로딩시 이미지나,사운드,글자등 미리 로드한다
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // 기본적으로 설치되어있음
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import {
  DarkTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar, cache } from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar); // 로그인 여부 전역변수

  const preloadAssets = () => {
    const fontsToLoad = [Ionicons.font]; // 아이콘의 폰트들을 저장
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font)); // 로딩하는 동안 Ionicons.font를 입력하여 expo-font의 Font를 promise에 담아 미리 로드
    const imagesToLoad = [
      require("./assets/logo.png"), // 로고 이미지 불러오기
      // "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png",
    ]; // 때로는 이미지 파일, 떄로는 url 이미지를 사용한다
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image)); // 로딩하는 동안 logo나 url이미지를 입력하여 expo-asset의 Asset을 promise에 담아 미리 로드
    return Promise.all([...fontPromises, ...imagePromises]); // 프리로드는 항상 promise를 리턴(async, await를 쓰지않는다), Promise.all()은 promise의 배열을 넣도록 해준다
  };

  const preload = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }

    // 로그인 후 로드시 기존에 있던 캐시를 유지하여 로딩하지 않고 기존의 데이터를 바로 불러내게한다. 캐시를 이용하기 때문에 백엔드가 꺼져도 부를수 있다
    await persistCache({
      cache, // apollo로부터 받은 캐시를 유지하기위해 삽입
      storage: new AsyncStorageWrapper(AsyncStorage), // AsyncStorage의 래퍼클래스로 변경시킨다
    }); // apollo에서 제공해주는 cache를 저장해주고 유지해준다

    return preloadAssets();
  };

  if (loading) {
    return (
      <AppLoading
        startAsync={preload} // 로딩을 시작한다
        onError={console.warn} // 에러가 발생시 콘솔창에 경고문 띄움
        onFinish={onFinish} // 로딩이 끝날 시
      />
    );
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
      </NavigationContainer>
    </ApolloProvider>
  );
}

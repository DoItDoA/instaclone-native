import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../DismissKeyboard";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 0px 20px;
`; // flex-direction: column 기본으로 설정되어있다
// 웹과 달리 font-size는 해당 태그에서 직접 적용해야된다. 웹은 부모에서 적용하면 자식도 적용이 되지만 여기는 아님

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

export default function AuthLayout({ children }) {
  return (
    <DismissKeyboard>
      <Container>
        {/* 키보드가 올라올 때 입력창 가리지 않게 설정 */}
        <KeyboardAvoidingView
          style={{
            width: "100%",
          }}
          behavior="padding" // 키보드가 나타날시 행동, 안드로이드와 아이폰마다 차이가 있어서 "height, position, padding" 중 적당히 선택
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : -140} // 키보드와 입력창 간격 설정. os가 ios이면 50
        >
          <Logo
            resizeMode="contain"
            source={require("../../assets/logo.png")}
          />
          {children}
        </KeyboardAvoidingView>
      </Container>
    </DismissKeyboard>
  );
}

import React from "react";
import { TouchableOpacity } from "react-native"; // TouchableOpacity를 통해 터치할 수 있게 함
import styled from "styled-components/native";
import { colors } from "../colors";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 600;
  margin-top: 20px;
  text-align: center;
`;

export default function Welcome({ navigation }) {
  const goToCreateAccount = () => navigation.navigate("CreateAccount"); // navigate를 통해 LoggedOutNav.js의 name으로 이동
  const goToLogIn = () => navigation.navigate("LogIn");
  return (
    <AuthLayout>
      <AuthButton
        text="회원가입"
        disabled={false}
        onPress={goToCreateAccount}
      />
      <TouchableOpacity onPress={goToLogIn}>
        <LoginLink>로그인</LoginLink>
      </TouchableOpacity>
    </AuthLayout>
  );
}

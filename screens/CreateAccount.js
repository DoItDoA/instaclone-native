import React, { useRef } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import { gql, useMutation } from "@apollo/client";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

// LoggedOutNav.js를 통해 오면 navigation 기능이 props에 있다
export default function CreateAccount({ navigation }) {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const onCompleted = (data) => {
    const {
      createAccount: { ok },
    } = data;

    const { username, password } = getValues();

    if (ok) {
      navigation.navigate("LogIn", {
        username,
        password,
      }); // navigate 두번재 인자로 파라미터 전송
    }
  };
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const onValid = (data) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  useEffect(() => {
    register("firstName", { required: true });
    register("lastName", { required: true });
    register("username", { required: true });
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);

  return (
    <AuthLayout>
      <TextInput
        autoFocus={true}
        placeholder="이름"
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        returnKeyType="next" // 엔터키가 '다음'관련 글자로 바뀜
        onSubmitEditing={() => onNext(lastNameRef)} // 엔터키를 누를시 발생하는 이벤트
        onChangeText={(text) => setValue("firstName", text)}
      />
      <TextInput
        ref={lastNameRef}
        placeholder="성"
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        returnKeyType="next"
        onSubmitEditing={() => onNext(usernameRef)}
        onChangeText={(text) => setValue("lastName", text)}
      />
      <TextInput
        ref={usernameRef}
        placeholder="계정명"
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        returnKeyType="next"
        autoCapitalize="none" // 첫글자가 대문자가 안되게 함
        onSubmitEditing={() => onNext(emailRef)}
        onChangeText={(text) => setValue("username", text)}
      />
      <TextInput
        ref={emailRef}
        placeholder="이메일"
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        keyboardType="email-address" // 키보드에 @가 생김 , numeric하면 숫자입력부터 나옴. 그외 여러기능
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue("email", text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder="비밀번호"
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        secureTextEntry // 입력시 대문자로 시작되는데 소문자로 시작되게하고 입력을 가려준다
        returnKeyType="done" // 엔터키가 '완료' 관련 글자로 바뀜
        onChangeText={(text) => setValue("password", text)}
        onSubmitEditing={handleSubmit(onValid)}
      />
      <AuthButton
        text="가입하기"
        disabled={false}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}

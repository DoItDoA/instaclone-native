import { gql, useMutation } from "@apollo/client";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import { isLoggedInVar, logUserIn } from "../apollo";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

// route의 params를 통해 CreateAccount.js의 navigate 파라미터값을 가져온다
export default function Login({ route: { params } }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      password: params?.password,
      username: params?.username,
    },
  });
  const passwordRef = useRef();
  const onCompleted = async (data) => {
    const {
      login: { ok, token },
    } = data;

    if (ok) {
      await logUserIn(token);
    }
  };
  const [logInMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });
  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };
  const onValid = (data) => {
    if (!loading) {
      logInMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  useEffect(() => {
    register("username", {
      required: true,
    }); // onChangeText등 통해 값이 바뀔때마다 값을 여기에 저장
    register("password", {
      required: true,
    });
  }, [register]);

  return (
    <AuthLayout>
      <TextInput
        autoFocus={true}
        value={watch("username")}
        placeholder="계정명"
        returnKeyType="next"
        autoCapitalize="none"
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue("username", text)} // register에 text 저장
      />
      <TextInput
        value={watch("password")}
        ref={passwordRef}
        placeholder="비밀번호"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text) => setValue("password", text)}
      />
      <AuthButton
        text="로그인"
        loading={loading}
        disabled={!watch("username") || !watch("password")} // 둘중 하나라도 존재 안하면 비활성화
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}

// formState가 존재하니 웹처럼 꾸며보자

import {
  gql,
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import useMe from "../hooks/useMe";
import { Ionicons } from "@expo/vector-icons";

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
      read
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;

export default function Room({ route, navigation }) {
  const { data: meData } = useMe();
  const { register, setValue, handleSubmit, getValues, watch } = useForm();
  const [subscribed, setSubscribed] = useState(false);
  const updateSendMessage = (cache, result) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;

    if (ok && meData) {
      const { message } = getValues();
      setValue("message", "");
      const messageObj = {
        id,
        payload: message,
        user: {
          username: meData.me.username,
          avatar: meData.me.avatar,
        },
        read: true,
        __typename: "Message",
      };

      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: messageObj,
      });

      cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };

  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  }); // query를 작동(room의 메세지를 얻기)시킨 다음에 subscribe를 한다

  const client = useApolloClient();

  const updateQuery = (prevQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;

    if (message.id) {
      const incomingMessage = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: message,
      });

      client.cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev) {
            const existingMessage = prev.find(
              (aMessage) => aMessage.__ref === incomingMessage.__ref // prev안에 "__ref": "Message:숫자"로 이뤄져있다
            );
            if (existingMessage) {
              return prev;
            }
            return [...prev, incomingMessage];
          },
        },
      });
    }
  };

  useEffect(() => {
    if (data?.seeRoom && !subscribed) {
      subscribeToMore({
        document: ROOM_UPDATES, // 업데이트 대상
        variables: {
          id: route?.params?.id,
        }, // room의 메세지를 얻고나서 업데이트를 하기 위해서 subscribe를 한다
        updateQuery, // subscription에 새로운 업데이트가 있을 떄 호출이 되는 함수이다
      });
      setSubscribed(true);
    }
  }, [data, subscribed]);

  const onValid = ({ message }) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payload: message,
          roomId: route?.params?.id,
        },
      });
    }
  };

  useEffect(() => {
    register("message", { required: true });
  }, [register]);

  useMemo(() => {
    navigation.setOptions({
      title: `${route?.params?.talkingTo?.username}`,
    });
  }, []);

  const renderItem = ({ item: message }) => (
    <MessageContainer
      outGoing={message.user.username !== route?.params?.talkingTo?.username}
    >
      <Author>
        <Avatar source={{ uri: message.user.avatar }} />
      </Author>
      <Message>{message.payload}</Message>
    </MessageContainer>
  );

  const messages = [...(data?.seeRoom?.messages ?? [])]; // ?? 은 왼쪽항이 null이거나 undefined이면 오른쪽항 출력하고 아니면 왼쪽항 출력, 처음에는 messages가 없으니 빈배열로 나온다
  messages.reverse(); // 배열 순서 뒤집기

  return (
    <>
      {/* 키보드화면이 올라가면 화면이 일부 가려지는데 키보드화면을 피해서 화면이 위로 올라가게 함 */}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "blue",
          width: "100%",
        }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : -200}
      >
        <ScreenLayout loading={loading}>
          <FlatList
            inverted // 출력 방향을 반대로
            style={{ width: "100%", marginVertical: 10 }}
            ItemSeparatorComponent={() => <View style={{ height: 15 }}></View>}
            style={{ width: "100%" }}
            data={messages}
            showsVerticalScrollIndicator={false}
            keyExtractor={(message) => "" + message.id}
            renderItem={renderItem}
          />
          <InputContainer>
            <TextInput
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              placeholder="Write a message..."
              returnKeyLabel="Send Message"
              returnKeyType="send"
              onChangeText={(text) => setValue("message", text)}
              onSubmitEditing={handleSubmit(onValid)}
              value={watch("message")}
            />
            <SendButton
              onPress={handleSubmit(onValid)}
              disabled={!Boolean(watch("message"))}
            >
              <Ionicons
                name="send"
                color={
                  !Boolean(watch("message"))
                    ? "rgba(255, 255, 255, 0.5)"
                    : "white"
                }
                size={22}
              />
            </SendButton>
          </InputContainer>
        </ScreenLayout>
      </KeyboardAvoidingView>
    </>
  );
}

const MessageContainer = styled.View`
  padding: 0px 10px;
  flex-direction: ${(props) => (props.outGoing ? "row-reverse" : "row")};
  align-items: center;
`;
const Author = styled.View``;
const Avatar = styled.Image`
  height: 25px;
  width: 25px;
  border-radius: 25px;
`;

const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  overflow: hidden;
  border-radius: 10px;
  font-size: 16px;
  margin: 0px 10px;
`;
const TextInput = styled.TextInput`
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  color: white;
  border-radius: 1000px;
  width: 90%;
  margin-right: 10px;
`;

const InputContainer = styled.View`
  width: 95%;
  margin-bottom: 50px;
  margin-top: 25px;
  flex-direction: row;
  align-items: center;
`;

const SendButton = styled.TouchableOpacity``;

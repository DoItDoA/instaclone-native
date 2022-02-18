import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native"; // FlatList는 모든 데이터를 렌더링하지 않고 화면에 보여지는 부분만 렌더링한다
import { Ionicons } from "@expo/vector-icons";
import ScreenLayout from "../components/ScreenLayout";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import Photo from "../components/Photo";

const FEED_QUERY = gql`
  query seeFeed($offset: Int) {
    seeFeed(offset: $offset) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export default function Feed({ navigation }) {
  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const renderPhoto = ({ item: photo }) => {
    return <Photo {...photo} />;
  };
  const refresh = async () => {
    setRefreshing(true);
    await refetch(); // refetch는 쿼리를 다시 불러온다
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);

  const MessagesButton = () => (
    <TouchableOpacity
      style={{ marginRight: 5 }}
      onPress={() => navigation.navigate("Messages")}
    >
      <Ionicons name="paper-plane" color="white" size={30} />
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: MessagesButton,
    });
  }, []);
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.02} // 스크롤 맨 밑이라고 인식하게 만듬, 0은 맨밑과 거리가 0이고 똑같음 숫자가 높을수록 중간이 맨밑으로 인식
        onEndReached={
          () =>
            fetchMore({
              variables: {
                offset: data?.seeFeed?.length,
              },
            }) // fetchMore는 pagenation과 작동하여 더 많은 query 불러옴
        } // 스크롤 맨 밑에 도달했을 시 실행
        refreshing={refreshing} // true면 화면에 새로고침 표시 띄움
        onRefresh={refresh} // 화면을 당겼을 시 함수 실행
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false} // 스크롤바 표시 제거
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo.id} // map처럼 키값 삽입, ""는 string으로 변환하기 위해 삽입
        renderItem={renderPhoto} // 렌더링을 어떻게 표현할지 삽입
      />
    </ScreenLayout>
  );
}

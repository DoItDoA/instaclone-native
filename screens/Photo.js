import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";
import { PHOTO_FRAGMENT } from "../fragments";

const SEE_PHOTO = gql`
  query seePhoto($id: Int!) {
    seePhoto(id: $id) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
    }
  }
  ${PHOTO_FRAGMENT}
`;

export default function PhotoScreen({ route }) {
  const { data, loading, refetch } = useQuery(SEE_PHOTO, {
    variables: {
      id: route?.params?.photoId,
    },
  });
  const [refreshing, setRefreshing] = useState();
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <ScreenLayout loading={loading}>
      {/* ScrollView는 한번에 모든 데이터를 스크롤로 볼수 있게 한다 */}
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} /> // RefreshControl컴포넌트를 호출해야한다
        }
        style={{ backgroundColor: "black" }}
        contentContainerStyle={{
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Photo {...data?.seePhoto} />
      </ScrollView>
    </ScreenLayout>
  );
}

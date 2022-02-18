import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import { Image, useWindowDimensions, TouchableOpacity } from "react-native";
import { gql, useMutation } from "@apollo/client";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View``;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
const File = styled.Image``;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  color: white;
  margin-left: 5px;
`;
const Likes = styled.Text`
  color: white;
  margin: 7px 0px;
  font-weight: 600;
`;
const ExtraContainer = styled.View`
  padding: 10px;
`;

function Photo({ id, user, caption, file, isLiked, likes }) {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions(); // 스크린 창에 따라 자동으로 너비와 높이를 자동으로 조절해준다(기본적으로 꽉채움)
  const [imageHeight, setImageHeight] = useState(height - 450);
  useEffect(() => {
    Image.getSize(file, (width, height) => {
      setImageHeight(height / 3);
    }); // 이미지의 사이즈를 알아내는 메소드. 첫번째 인자는 해당이미지 uri을 넣고, 두번째는 이미지가 있을 시 너비와 높이 가져온다, 세번째는 없을 시 실행
  }, [file]);

  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });
  const goToProfile = () => {
    navigation.navigate("StackProfile", {
      username: user.username,
      id: user.id,
    });
  };
  return (
    <Container>
      <Header onPress={goToProfile}>
        <UserAvatar resizeMode="cover" source={{ uri: user.avatar }} />
        <Username>{user.username}</Username>
      </Header>
      <File
        resizeMode="cover"
        style={{
          width,
          height: imageHeight,
        }}
        source={{ uri: file }}
      />
      <ExtraContainer>
        <Actions>
          <Action onPress={toggleLikeMutation}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? "tomato" : "white"}
              size={22}
            />
          </Action>
          <Action onPress={goToProfile}>
            <Ionicons name="chatbubble-outline" color="white" size={22} />
          </Action>
        </Actions>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("StackLikes", {
              photoId: id,
            })
          }
        >
          <Likes>{`${likes} 좋아요`}</Likes>
        </TouchableOpacity>
        <Caption>
          <TouchableOpacity onPress={goToProfile}>
            <Username>{user.username}</Username>
          </TouchableOpacity>
          <CaptionText>{caption}</CaptionText>
        </Caption>
      </ExtraContainer>
    </Container>
  );
}

Photo.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }),
  caption: PropTypes.string,
  file: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number,
  commentNumber: PropTypes.number,
};
export default Photo;

// 좋아요 로딩 제거

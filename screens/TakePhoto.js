import { Camera } from "expo-camera";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, StatusBar, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import styled from "styled-components/native";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;

const Actions = styled.View`
  flex: 0.35;
  padding: 0px 50px;
  align-items: center;
  justify-content: space-around;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TakePhotoBtn = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50px;
`;

const SliderContainer = styled.View``;

const ActionsContainer = styled.View`
  flex-direction: row;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
`;

const PhotoActions = styled(Actions)`
  flex-direction: row;
`;

const PhotoAction = styled.TouchableOpacity`
  background-color: white;
  padding: 10px 25px;
  border-radius: 4px;
`;

const PhotoActionText = styled.Text`
  font-weight: 600;
`;

export default function TakePhoto({ navigation }) {
  const camera = useRef();
  const [takenPhoto, setTakenPhoto] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [ok, setOk] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off); // 사진찍을 때 손전등 기능
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front); // "back"쓰기보다는 Constants.Type으로 back 쓰는게 나중에 유지보수가 좋다
  const getPermissions = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync(); // 카메라 사용권한 요청
    setOk(granted);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const onCameraSwitch = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };
  const onZoomValueChange = (e) => {
    setZoom(e);
  };
  const onFlashChange = () => {
    if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on);
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      setFlashMode(Camera.Constants.FlashMode.auto);
    } else if (flashMode === Camera.Constants.FlashMode.auto) {
      setFlashMode(Camera.Constants.FlashMode.off);
    }
  };

  const goToUpload = async (save) => {
    if (save) {
      await MediaLibrary.saveToLibraryAsync(takenPhoto); // saveToLibraryAsync는 uri정보를 내폰에 저장, 정보 반환 안함
      // const asset = await MediaLibrary.createAssetAsync(uri); // createAssetAsync는 saveToLibraryAsync와 같지만 정보를 반환한다
    }
    navigation.navigate("UploadForm", {
      file: takenPhoto,
    });
  };

  const onUpload = () => {
    Alert.alert("사진을 저장하시겠습니까?", "저장 후 올리기 또는 올리기", [
      {
        text: "저장 후 올리기",
        onPress: () => goToUpload(true),
      },
      {
        text: "올리기",
        onPress: () => goToUpload(false),
      },
    ]); // 첫번째 인자:타이틀, 두번째:메세지, 세번째:버튼
  };

  const onCameraReady = () => setCameraReady(true);
  const takePhoto = async () => {
    if (camera.current && cameraReady) {
      const { uri } = await camera.current.takePictureAsync({
        quality: 1, // 압축 퀄리티 설정, 0~1까지
        exif: true, // 사진에 대한 정보를 포함한 메타데이터, 촬영 장소에 대한 정보등을 구하고 싶을 때 유용
        skipProcessing: true, // 사진 찍을 시 가로 회전 안되게함
      }); // 사진 찍기 기능
      setTakenPhoto(uri);
    }
  };
  const onDismiss = () => setTakenPhoto("");
  const isFocused = useIsFocused(); // 화면이 여길 볼 때 true 반환

  return (
    <>
      <Container>
        {/* isFocused로 구별 안하면 SelectPhoto 상태창은 무조건 안나옴. 즉 selectPhoto볼 때 카메라는 켜져있어 자원 낭비 */}
        {isFocused ? <StatusBar hidden={true} /> : null}
        {takenPhoto === "" ? (
          <Camera
            type={cameraType} // 카메라 전면, 후면 설정
            style={{ flex: 1 }}
            zoom={zoom} // 0~1까지 범위 정해져 있음
            flashMode={flashMode}
            ref={camera} // current 속성을 이용하여 Camera의 기능에 접근
            onCameraReady={onCameraReady} // 카메라가 사용가능한 상태인지 확인한다
          >
            <CloseButton onPress={() => navigation.navigate("Tabs")}>
              <Ionicons name="close" color="white" size={30} />
            </CloseButton>
          </Camera>
        ) : (
          // 사진을 찍었을 시 카메라 화면이 아닌 이미지 나오게 함
          <Image source={{ uri: takenPhoto }} style={{ flex: 1 }} />
        )}
        {takenPhoto === "" ? (
          <Actions>
            <SliderContainer>
              <Slider
                style={{ width: 200, height: 20 }}
                value={zoom}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF" // 값을 높일 때 바 색
                maximumTrackTintColor="rgba(255, 255, 255, 0.5)" // 기본 바 바탕색
                onValueChange={onZoomValueChange}
              />
            </SliderContainer>
            <ButtonsContainer>
              <TakePhotoBtn onPress={takePhoto} />
              <ActionsContainer>
                <TouchableOpacity
                  onPress={onFlashChange}
                  style={{ marginRight: 30 }}
                >
                  <Ionicons
                    size={30}
                    color="white"
                    name={
                      flashMode === Camera.Constants.FlashMode.off
                        ? "flash-off"
                        : flashMode === Camera.Constants.FlashMode.on
                        ? "flash"
                        : flashMode === Camera.Constants.FlashMode.auto
                        ? "eye"
                        : ""
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onCameraSwitch}>
                  <Ionicons
                    size={30}
                    color="white"
                    name={
                      cameraType === Camera.Constants.Type.front
                        ? "camera-reverse"
                        : "camera"
                    }
                  />
                </TouchableOpacity>
              </ActionsContainer>
            </ButtonsContainer>
          </Actions>
        ) : (
          // 사진을 찍었을 시 찍은 사진을 어떻게 할지 나오게 함
          <PhotoActions>
            <PhotoAction onPress={onDismiss}>
              <PhotoActionText>취소</PhotoActionText>
            </PhotoAction>
            <PhotoAction onPress={onUpload}>
              <PhotoActionText>올리기</PhotoActionText>
            </PhotoAction>
          </PhotoActions>
        )}
      </Container>
    </>
  );
}

// 카메라가 한번씩 안나옴 해결 해보기 React.memo 알아보기

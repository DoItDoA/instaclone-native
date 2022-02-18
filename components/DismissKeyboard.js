import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

export default function DismissKeyboard({ children }) {
  const dismissKeyboard = () => {
    Keyboard.dismiss(); // 키보드가 사라지게 함
  };
  return (
    <>
      {/* TouchableWithoutFeedback은 TouchableOpacity와 달리 터치해도 반응이 없지만 터치시 작동은 한다 */}
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={dismissKeyboard}
        disabled={Platform.OS === "web"}
      >
        {children}
      </TouchableWithoutFeedback>
    </>
  );
}

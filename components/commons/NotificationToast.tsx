// Component: NotificationToast.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface NotificationToastProps {
  title: string;
  body: string;
  onPress: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  title,
  body,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl shadow-md p-4 m-2 border border-gray-200"
    >
      <Text className="text-lg font-semibold text-black">{title}</Text>
      <Text className="text-sm text-gray-600 mt-1">{body}</Text>
    </TouchableOpacity>
  );
};

export default NotificationToast;

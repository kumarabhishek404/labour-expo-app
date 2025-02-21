import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef, ReactNode } from "react";

let toastRef: { show: (message: string, type: ToastType) => void } | null =
  null;

type ToastType = "success" | "error" | "info" | "default";

type ToastContainerProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  message,
  type,
  onClose,
}) => {
  const [translateY] = useState(new Animated.Value(-100));
  const [opacity] = useState(new Animated.Value(0));
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // ✅ Drop-down animation with bounce effect
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: getColor(type),
        },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✖</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getColor = (type: ToastType): string => {
  switch (type) {
    case "success":
      return "#4BB543";
    case "error":
      return "#FF4C4C";
    case "info":
      return "#3498DB";
    default:
      return "#333";
  }
};

type ToastInterface = {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const TOAST: ToastInterface = {
  show: (message, type = "info") => {
    if (toastRef) {
      toastRef.show(message, type);
    }
  },
  success: (message) => TOAST.show(message, "success"),
  error: (message) => TOAST.show(message, "error"),
  info: (message) => TOAST.show(message, "info"),
};

type ToastProviderProps = {
  children: ReactNode;
};

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastData, setToastData] = useState<{
    message: string;
    type: ToastType;
  }>({
    message: "",
    type: "default",
  });

  toastRef = {
    show: (message: string, type: ToastType) => setToastData({ message, type }),
  };

  const handleClose = () => {
    setToastData({ message: "", type: "default" });
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      {toastData.message ? (
        <ToastContainer {...toastData} onClose={handleClose} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    textAlign: "left",
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export { ToastProvider };
export default TOAST;

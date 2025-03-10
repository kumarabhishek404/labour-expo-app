import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect, useRef, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "default";

type ToastMessage = {
  id: number;
  message: string;
  type: ToastType;
};

let toastRef: { show: (message: string, type?: ToastType) => void } | null =
  null;

const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}> = ({ toasts, onRemove }) => {
  return (
    <View style={styles.toastWrapper} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </View>
  );
};

const ToastItem: React.FC<ToastMessage & { onClose: () => void }> = ({
  id,
  message,
  type,
  onClose,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<any>(null);

  useEffect(() => {
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
      pointerEvents="auto" // Allow clicks to pass through
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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  toastRef = {
    show: (message: string, type: ToastType = "info") => {
      const id = new Date().getTime(); // Unique ID for each toast
      setToasts((prev) => [{ id, message, type }, ...prev]); // Add new toast at the top
    },
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10000,
    pointerEvents: "box-none", // Ensures it doesn't block user interaction
  },
  toastContainer: {
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 10,
    marginBottom: 10, // Adds spacing between multiple toasts
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

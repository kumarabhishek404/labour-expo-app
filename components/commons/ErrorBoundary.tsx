import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <View style={styles.container}>
    <Text style={styles.title}>Something went wrong.</Text>
    <Text style={styles.error}>{error?.toString()}</Text>
    <Button title="Try Again" onPress={resetErrorBoundary} />
  </View>
);

// Wrap your App or any critical component
const AppWithErrorBoundary = ({ children }: any) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("App crash caught (Functional):", error, info);
        // Optionally send to crash logging service
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppWithErrorBoundary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});

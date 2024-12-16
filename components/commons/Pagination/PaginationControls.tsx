import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}) => (
  <View style={styles.paginationContainer}>
    <TouchableOpacity
      style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
      onPress={onPreviousPage}
      disabled={currentPage === 1}
    >
      <Text style={styles.pageButtonText}>Previous</Text>
    </TouchableOpacity>

    <View style={styles.pageNumbers}>
      <Text style={styles.pageText}>
        Page {currentPage} of {totalPages}
      </Text>
    </View>

    <TouchableOpacity
      style={[
        styles.pageButton,
        currentPage === totalPages && styles.disabledButton,
      ]}
      onPress={onNextPage}
      disabled={currentPage === totalPages}
    >
      <Text style={styles.pageButtonText}>Next</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageText: {
    fontSize: 14,
    color: "#333",
  },
});

export default PaginationControls;

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import Colors from "@/constants/Colors";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";
import Button from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import CashImage from "../../../assets/cash.png";
import MasterCardImage from "../../../assets/master-card.png";
import VisaCardImage from "../../../assets/visa-card.png";
import DebitCardImage from "../../../assets/debit-card.png";
import BhimUPIImage from "../../../assets/bhim-upi.png";

interface PaymentMethod {
  type: string;
  label: string;
  expiry?: string;
  isSelected: boolean;
  icon?: any; // Icon path for each payment method
}

interface Transaction {
  _id: string;
  description: string;
  date: string;
}

type RootStackParamList = {
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
};

const PaymentMethodsScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>("cash");

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      type: "cash",
      label: "Cash Payment",
      isSelected: true,
      icon: CashImage, // Replace with the actual path of the icon
    },
    {
      type: "card",
      label: "MasterCard ****5967",
      expiry: "09/25",
      isSelected: false,
      icon: MasterCardImage, // Replace with the actual path of the icon
    },
    {
      type: "visa",
      label: "Visa ****3802",
      expiry: "10/27",
      isSelected: false,
      icon: VisaCardImage, // Replace with the actual path of the icon
    },
    {
      type: "debit",
      label: "Debit ****1969",
      expiry: "10/27",
      isSelected: false,
      icon: DebitCardImage, // Replace with the actual path of the icon
    },
    {
      type: "upi",
      label: "UPI ****1234",
      isSelected: false,
      icon: BhimUPIImage, // Replace with the actual path of the icon
    },
  ]);

  const transactionHistory: Transaction[] = [
    { _id: "1", description: "Paid $50 via Mastercard", date: "09/01/2024" },
    { _id: "2", description: "Paid $75 via UPI", date: "08/28/2024" },
    { _id: "3", description: "Paid $100 in Cash", date: "08/15/2024" },
    { _id: "4", description: "Paid $100 in Cash", date: "08/15/2024" },
    { _id: "5", description: "Paid $100 in Cash", date: "08/15/2024" },
    { _id: "6", description: "Paid $100 in Cash", date: "08/15/2024" },
  ];

  //   const selectPaymentMethod = (type: string) => {
  //     const updatedMethods = paymentMethods.map(method => ({
  //       ...method,
  //       isSelected: method.type === type,
  //     }));
  //     setSelectedMethod(type);
  //   };

  const selectPaymentMethod = (type: string) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isSelected: method.type === type,
    }));
    setPaymentMethods(updatedMethods);
    setSelectedMethod(type);
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity
      style={[styles.paymentOption, item.isSelected && styles.selectedPayment]}
      onPress={() => selectPaymentMethod(item.type)}
    >
      <View style={styles.paymentRow}>
        <Image source={item.icon} style={styles.paymentIcon} />
        <View>
          <CustomHeading>{item.label}</CustomHeading>
          {item.expiry && (
            <CustomText textAlign="left">Expires {item.expiry}</CustomText>
          )}
        </View>
      </View>
      {item.isSelected && (
        <Ionicons name="checkmark-circle" size={24} color="green" />
      )}
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <CustomHeading textAlign="left">{item.description}</CustomHeading>
      <CustomText textAlign="left">{item.date}</CustomText>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Payment Settings" left="back" />,
        }}
      />
      <ScrollView
        style={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeading
          textAlign="left"
          baseFont={20}
          style={{ marginBottom: 10 }}
        >
          Payment methods
        </CustomHeading>

        <FlatList
          scrollEnabled={false}
          data={paymentMethods}
          renderItem={renderPaymentMethod}
          keyExtractor={(item) => item.type}
        />

        <Button
          isPrimary={true}
          title="Add Payment Method"
          onPress={() => router.push("/screens/payments/addPaymentMethod")}
        />

        <CustomHeading
          textAlign="left"
          baseFont={20}
          style={{ marginBottom: 10, marginTop: 20 }}
        >
          Transaction History
        </CustomHeading>
        <FlatList
          scrollEnabled={false}
          data={transactionHistory}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 0,
  },
  scrollViewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paymentOption: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  selectedPayment: {
    borderColor: Colors?.primary,
    borderWidth: 2,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  paymentLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  expiry: {
    fontSize: 12,
    color: "#888",
  },
  addPaymentButton: {
    backgroundColor: Colors?.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addPaymentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  transactionItem: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
  },
  transactionDate: {
    fontSize: 12,
    color: "#555",
  },
});

export default PaymentMethodsScreen;

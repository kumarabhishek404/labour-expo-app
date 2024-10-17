import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Step1 from "../../../assets/step1.jpg";
import { useAtom, useSetAtom } from "jotai";
import { AddServiceAtom, AddServiceInProcess } from "@/app/AtomStore/user";
import TextInputComponent from "@/components/TextInputWithIcon";
import Button from "@/components/Button";
import { toast } from "@/app/hooks/toast";
import Stepper from "./stepper";
import { ADDSERVICESTEPS } from "@/constants";
import moment from "moment";
import { isEmptyObject } from "@/constants/functions";

interface FinalScreenProps {
  setStep: any;
  title: string;
  setTitle: any;
  description: string;
  setDescription: any;
  address: string;
  setAddress: any;
  location: object;
  setLocation: any;
  startDate: Date;
  setStartDate: any;
  endDate: Date;
  setEndDate: any;
  requirements: Array<any>;
  setRequirements: any;
  images: Array<string>;
  setImages: any;
  handleOnSubmit: any;
}

const FinalScreen: React.FC<FinalScreenProps> = ({
  setStep,
  title,
  description,
  address,
  location,
  startDate,
  endDate,
  requirements,
  images,
  handleOnSubmit,
}: FinalScreenProps) => {
  const handleFinish = () => {
    handleOnSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles?.formContainer}>
          {/* <Image source={Step1} style={styles.image} /> */}
          <Text style={styles?.headerText}>
            Check all the details which you have filled
          </Text>
          <View style={{ marginVertical: 30 }}>
            <Stepper currentStep={5} steps={ADDSERVICESTEPS} />
          </View>
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.value}>{title}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.value}>{description}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{address}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>
                {!isEmptyObject(location) ? (
                  JSON?.stringify(location)
                ) : (
                  <Text style={styles.placeholderText}>
                    Location not fetched
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Start Date</Text>
              <Text style={styles.value}>
                {moment(startDate)?.format("Do MMM YYYY")}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>End Date</Text>
              <Text style={styles.value}>
                {moment(endDate)?.format("Do MMM YYYY")}
              </Text>
            </View>

            <View style={[styles.row, { flexDirection: "column" }]}>
              <Text style={[styles.label, { marginBottom: 10 }]}>
                Requirements
              </Text>
              <View style={styles.requirmentContainer}>
                {requirements &&
                  requirements?.map((requirement: any, index: number) => {
                    return (
                      <View style={styles.card} key={index}>
                        <View style={styles.header}>
                          <View style={{ flexDirection: "column" }}>
                            <Text style={styles.title}>
                              {requirement?.name}
                            </Text>
                            <Text style={styles.subTitle}>shuttering</Text>
                          </View>
                          <Text style={styles.price}>
                            ₹ {requirement?.payPerDay} Per Day
                          </Text>
                        </View>

                        <View style={styles.details}>
                          <Text style={styles.detailLabel}>Count</Text>
                          <Text style={styles.detailLabel}>Food</Text>
                          <Text style={styles.detailLabel}>Living</Text>
                          <Text style={styles.detailLabel}>ESI / PF</Text>
                        </View>

                        <View
                          style={[
                            styles.values,
                            requirements?.length - 1 !== index &&
                              styles?.divider,
                          ]}
                        >
                          <Text style={styles.requirementValue}>
                            {requirement?.totalRequired}
                          </Text>
                          <Text style={styles.requirementValue}>
                            {requirement?.foodProvided ? "Yes" : "No"}
                          </Text>
                          <Text style={styles.requirementValue}>
                            {requirement?.shelterProvider ? "Yes" : "No"}
                          </Text>
                          <Text style={styles.requirementValue}>No</Text>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Images</Text>
              <View style={styles.value}>
                <View style={styles.imageContainer}>
                  {images &&
                    images?.map((imgUri: any, index: number) => (
                      <View key={index} style={styles.imagesContainer}>
                        <Image
                          key={index}
                          source={{ uri: imgUri }}
                          style={styles.uploadedImage}
                        />
                      </View>
                    ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles?.buttonContainer}>
          <Button isPrimary={false} title="Back" onPress={() => setStep(4)} />
          <Button
            isPrimary={true}
            title="Submit All Details"
            onPress={handleFinish}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "white",
  },
  box: {
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  customHeader: {
    width: "100%",
    paddingHorizontal: 20,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
    color: "green",
    textAlign: "center",
  },
  formContainer: {},
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#555",
    width: "40%",
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#000",
    width: "60%",
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa9a9",
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: "#6200ea",
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  requirmentContainer: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#e1e8e5",
  },
  card: {
    backgroundColor: "#e1e8e5",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  viewButton: {
    width: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors?.black,
    textTransform: "capitalize",
    marginRight: 10,
  },
  price: {
    flex: 1,
    fontSize: 16,
    color: Colors?.black,
    textAlign: "right",
  },
  subTitle: {
    fontSize: 14,
    color: Colors?.primary,
    textAlign: "left",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#4F4F4F",
    fontWeight: "600",
  },
  values: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#4F4F4F",
  },
  requirementValue: {
    fontSize: 16,
    color: "#000",
  },

  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // marginTop: 10,
  },
  uploadedImage: {
    width: 70,
    height: 70,
    // margin: 10,
    borderRadius: 8,
  },
  imagesContainer: {
    marginRight: 10,
  },
});

export default FinalScreen;

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import moment from "moment";
import { isEmptyObject } from "@/constants/functions";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Stepper from "@/components/commons/Stepper";
import { ADDSERVICESTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";
import ButtonComp from "@/components/inputs/Button";

interface FinalScreenProps {
  setStep: any;
  type: string;
  subType: string;
  description: string;
  address: string;
  location: object;
  startDate: Date;
  duration: number;
  requirements: Array<any>;
  facilities: any;
  images: Array<string>;
  handleOnSubmit: any;
}

const FinalScreen: React.FC<FinalScreenProps> = ({
  setStep,
  type,
  subType,
  description,
  address,
  location,
  startDate,
  duration,
  requirements,
  facilities,
  images,
  handleOnSubmit,
}: FinalScreenProps) => {
  const handleFinish = () => {
    handleOnSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View>
          <View style={styles.row}>
            <CustomHeading color={Colors?.inputLabel} fontWeight="500">
              {t("workType")}
            </CustomHeading>
            <CustomText
              style={[styles.value, { textTransform: "capitalize" }]}
              textAlign="left"
            >
              {t(type)}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomHeading color={Colors?.inputLabel} fontWeight="500">
              {t("workSubType")}
            </CustomHeading>
            <CustomText
              style={[styles.value, { textTransform: "capitalize" }]}
              textAlign="left"
            >
              {t(subType)}
            </CustomText>
          </View>

          {description && (
            <View style={styles.row}>
              <CustomHeading color={Colors?.inputLabel} fontWeight="500">
                {t("workDescription")}
              </CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {description}
              </CustomText>
            </View>
          )}

          <View style={[styles.row, { flexDirection: "column", gap: 5 }]}>
            <CustomHeading color={Colors?.inputLabel} fontWeight="500">
              {t("facilities")}
            </CustomHeading>
            <View style={styles.facilitiesContainer}>
              <View style={styles.card}>
                <View style={styles.details}>
                  <CustomHeading
                    baseFont={14}
                    color={Colors?.white}
                    style={styles?.facilitiesLabel}
                  >
                    {t("travelling")}
                  </CustomHeading>
                  <CustomHeading baseFont={14} style={styles?.facilitiesLabel}>
                    {t("food")}
                  </CustomHeading>
                  <CustomHeading baseFont={14} style={styles?.facilitiesLabel}>
                    {t("living")}
                  </CustomHeading>
                  <CustomHeading baseFont={14} style={styles?.facilitiesLabel}>
                    {t("esi_pf")}
                  </CustomHeading>
                </View>

                <View style={[styles.values]}>
                  <CustomHeading baseFont={14} style={styles?.facilitiesValues}>
                    {facilities?.travelling ? "Yes" : "No"}
                  </CustomHeading>
                  <CustomHeading baseFont={14} style={styles?.facilitiesValues}>
                    {facilities?.food ? "Yes" : "No"}
                  </CustomHeading>
                  <CustomHeading baseFont={14} style={styles?.facilitiesValues}>
                    {facilities?.living ? "Yes" : "No"}
                  </CustomHeading>
                  <CustomHeading
                    baseFont={14}
                    color={Colors?.tertieryButton}
                    style={styles?.facilitiesValues}
                  >
                    {facilities?.esi_pf ? "Yes" : "No"}
                  </CustomHeading>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.row, { flexDirection: "column", gap: 5 }]}>
            <CustomHeading color={Colors?.inputLabel} fontWeight="500">
              {t("workRequirements")}
            </CustomHeading>
            <View style={styles.requirmentContainer}>
              {requirements &&
                requirements?.map((requirement: any, index: number) => {
                  return (
                    <View style={styles.card} key={index}>
                      <View style={styles.header}>
                        <View style={{ flexDirection: "column" }}>
                          <CustomHeading
                            style={{ textTransform: "capitalize" }}
                          >
                            {t(requirement?.name)}
                          </CustomHeading>
                        </View>
                        <CustomHeading>
                          ₹ {requirement?.payPerDay} {t("perDay")}
                        </CustomHeading>
                      </View>

                      <View style={styles.details}>
                        <CustomHeading
                          baseFont={14}
                          color={Colors?.tertieryButton}
                          style={styles?.label}
                        >
                          {t("count")}
                        </CustomHeading>
                        <CustomHeading
                          baseFont={14}
                          color={Colors?.tertieryButton}
                          style={styles?.label}
                        >
                          {t("living")}
                        </CustomHeading>
                        <CustomHeading
                          baseFont={14}
                          color={Colors?.tertieryButton}
                          style={styles?.label}
                        >
                          {t("esi_pf")}
                        </CustomHeading>
                      </View>

                      <View
                        style={[
                          styles.values,
                          requirements?.length - 1 !== index && styles?.divider,
                        ]}
                      >
                        <CustomHeading
                          baseFont={14}
                          color={Colors?.tertieryButton}
                          style={styles?.item}
                        >
                          {requirement?.count}
                        </CustomHeading>
                        <CustomHeading
                          baseFont={14}
                          color={Colors?.tertieryButton}
                          style={styles?.item}
                        >
                          {requirement?.living ? "Yes" : "No"}
                        </CustomHeading>
                        <CustomHeading
                          baseFont={14}
                          color={Colors?.tertieryButton}
                          style={styles?.item}
                        >
                          {requirement?.esi_pf ? "Yes" : "No"}
                        </CustomHeading>
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>

          <View style={styles.row}>
            <CustomHeading color={Colors?.inputLabel} fontWeight="500">
              {t("address")}
            </CustomHeading>
            <CustomText style={styles.value} textAlign="left">
              {address}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomHeading color={Colors?.inputLabel} fontWeight="500">
              {t("startDate")}
            </CustomHeading>
            <CustomText style={styles.value} textAlign="left">
              {moment(startDate)?.format("Do MMM YYYY")}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomHeading color={Colors?.inputLabel} fontWeight="500">
              {t("duration")}
            </CustomHeading>
            <CustomText style={styles.value} textAlign="left">
              {duration} {t("days")}
            </CustomText>
          </View>

          {images && images?.length > 0 && (
            <View style={[styles.row, { flexDirection: "column", gap: 5 }]}>
              <CustomHeading color={Colors?.inputLabel} fontWeight="500">
                {t("workImages")}
              </CustomHeading>
              <View
                style={[
                  styles.value,
                  { width: "100%", paddingBottom: 0, paddingRight: 0 },
                ]}
              >
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
          )}
          {/* </View> */}
        </View>

        <View style={styles?.buttonContainer}>
          <ButtonComp
            isPrimary={true}
            title={t("back")}
            onPress={() => setStep(3)}
            bgColor={Colors?.danger}
            borderColor={Colors?.danger}
            style={{ width: "35%" }}
          />
          <ButtonComp
            isPrimary={true}
            title={t("submitAllDetails")}
            onPress={handleFinish}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  box: {
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 10,
  },
  value: {
    width: "60%",
    backgroundColor: Colors?.white,
    borderColor: Colors?.secondary,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  requirmentContainer: {
    width: "100%",
    backgroundColor: Colors?.fourth,
    borderRadius: 8,
  },
  facilitiesContainer: {
    width: "100%",
    backgroundColor: Colors?.tertieryButton,
    borderRadius: 8,
  },
  card: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  values: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    width: "20%",
    textAlign: "left",
    color: Colors?.tertieryButton,
  },
  facilitiesValues: {
    width: "20%",
    textAlign: "left",
    color: Colors?.white,
  },
  facilitiesLabel: {
    width: "20%",
    textAlign: "left",
    color: Colors?.white,
  },
  item: {
    width: "20%",
    textAlign: "left",
    color: Colors?.primary,
  },
  divider: {
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#4F4F4F",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  uploadedImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  imagesContainer: {
    marginRight: 10,
    marginBottom: 10,
  },
});

export default FinalScreen;

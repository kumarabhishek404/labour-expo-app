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

interface FinalScreenProps {
  setStep: any;
  type: string;
  setType: any;
  subType: string;
  setSubType: any;
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
  type,
  subType,
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

  console.log("tye - ", type);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View>
          <CustomHeading>{t("checkServiceDetails")}</CustomHeading>
          <View style={{ marginVertical: 30 }}>
            <Stepper currentStep={5} steps={ADDSERVICESTEPS} />
          </View>
          <View>
            <View style={styles.row}>
              <CustomHeading>{t("workType")}</CustomHeading>
              <CustomText
                style={[styles.value, { textTransform: "capitalize" }]}
                textAlign="left"
              >
                {t(type)}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>{t("workSubType")}</CustomHeading>
              <CustomText
                style={[styles.value, { textTransform: "capitalize" }]}
                textAlign="left"
              >
                {t(subType)}
              </CustomText>
            </View>

            {description && (
              <View style={styles.row}>
                <CustomHeading>{t("workDescription")}</CustomHeading>
                <CustomText style={styles.value} textAlign="left">
                  {description}
                </CustomText>
              </View>
            )}

            <View style={[styles.row, { flexDirection: "column", gap: 5 }]}>
              <CustomHeading>{t("workRequirements")}</CustomHeading>
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
                            color={Colors?.secondaryText}
                          >
                            {t("count")}
                          </CustomHeading>
                          <CustomHeading
                            baseFont={14}
                            color={Colors?.secondaryText}
                          >
                            {t("food")}
                          </CustomHeading>
                          <CustomHeading
                            baseFont={14}
                            color={Colors?.secondaryText}
                          >
                            {t("living")}
                          </CustomHeading>
                          <CustomHeading
                            baseFont={14}
                            color={Colors?.secondaryText}
                          >
                            {t("esi/pf")}
                          </CustomHeading>
                        </View>

                        <View
                          style={[
                            styles.values,
                            requirements?.length - 1 !== index &&
                              styles?.divider,
                          ]}
                        >
                          <CustomText>{requirement?.count}</CustomText>
                          <CustomText>
                            {requirement?.food ? "Yes" : "No"}
                          </CustomText>
                          <CustomText>
                            {requirement?.shelterProvider ? "Yes" : "No"}
                          </CustomText>
                          <CustomText>No</CustomText>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>

            <View style={styles.row}>
              <CustomHeading>{t("address")}</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {address}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>{t("location")}</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {isEmptyObject(location) ? (
                  JSON?.stringify(location)
                ) : (
                  <CustomText>{t("locationNotFound")}</CustomText>
                )}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>{t("startDate")}</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {moment(startDate)?.format("Do MMM YYYY")}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>{t("endDate")}</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {moment(endDate)?.format("Do MMM YYYY")}
              </CustomText>
            </View>

            {images && images?.length > 0 && (
              <View style={[styles.row, { flexDirection: "column", gap: 5 }]}>
                <CustomHeading>{t("workImages")}</CustomHeading>
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
          </View>
        </View>

        <View style={styles?.buttonContainer}>
          <Button
            isPrimary={false}
            title={t("back")}
            onPress={() => setStep(3)}
          />
          <Button
            isPrimary={true}
            title={t("submitAllDetails")}
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
    backgroundColor: "white",
  },
  box: {
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
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
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 8,
  },
  requirmentContainer: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#e1e8e5",
  },
  card: {
    width: "100%",
    backgroundColor: "#e1e8e5",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
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

// import React from "react";
// import { View, StyleSheet, Image } from "react-native";
// import Button from "@/components/inputs/Button";
// import Stepper from "@/app/(tabs)/addService/stepper";
// import { ADDSERVICESTEPS, REGISTERSTEPS } from "@/constants";
// import { Controller, useForm } from "react-hook-form";
// import Step4 from "../../../assets/step4.jpg";
// import ImageUpload from "@/components/inputs/ImagePicker";
// import { AddServiceAtom } from "@/app/AtomStore/user";
// import { useAtom, useAtomValue } from "jotai";
// import { toast } from "@/app/hooks/toast";

// interface FourthScreenProps {
//   setStep: any;
//   images: string;
//   setImages: any;
// }

// const FourthScreen: React.FC<FourthScreenProps> = ({
//   setStep,
//   images,
//   setImages,
// }: FourthScreenProps) => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       images: images,
//     },
//   });
//   const onSubmit = (data: any) => {
//     if(data?.images && data?.images?.length > 3) {
//       toast?.error("You can not upload more than 3 images")
//     }
//     else {
//       setImages(data?.images);
//       setStep(3);
//     }
//   };

//   return (
//     <View style={styles?.container}>
//       <Image source={Step4} style={styles.image} />
//       <View style={{ marginVertical: 30 }}>
//         <Stepper currentStep={4} steps={ADDSERVICESTEPS} />
//       </View>

//       <View style={{ flexDirection: "column", gap: 15 }}>
//         <Controller
//           control={control}
//           name="images"
//           defaultValue=""
//           rules={{
//             required: "Please upload at least one image",
//           }}
//           render={({ field: { onChange, onBlur, value } }) => (
//             <ImageUpload
//               name="images"
//               images={value}
//               setImages={onChange}
//               onBlur={onBlur}
//               errors={errors}
//             />
//           )}
//         />
//       </View>
//       <View style={styles?.buttonContainer}>
//         <Button isPrimary={false} title="Back" onPress={() => setStep(3)} />
//         <Button
//           isPrimary={true}
//           title="Save and View"
//           onPress={handleSubmit(onSubmit)}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     height: "100%",
//     backgroundColor: "white",
//   },
//   image: {
//     width: "100%",
//     height: 260,
//     resizeMode: "cover",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 20,
//   },
// });

// export default FourthScreen;

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


interface FinalScreenProps {
  setStep: any;
  type: string;
  setType: any;
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
        <View>
          <CustomHeading>
            Check all the details which you have filled
          </CustomHeading>
          <View style={{ marginVertical: 30 }}>
            <Stepper currentStep={5} steps={ADDSERVICESTEPS} />
          </View>
          <View>
            <View style={styles.row}>
              <CustomHeading>Title</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {type}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>Description</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {description}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>Address</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {address}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>Location</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {!isEmptyObject(location) ? (
                  JSON?.stringify(location)
                ) : (
                  <CustomText>Location not fetched</CustomText>
                )}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>Start Date</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {moment(startDate)?.format("Do MMM YYYY")}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomHeading>End Date</CustomHeading>
              <CustomText style={styles.value} textAlign="left">
                {moment(endDate)?.format("Do MMM YYYY")}
              </CustomText>
            </View>

            <View style={[styles.row, { flexDirection: "column", gap: 5 }]}>
              <CustomHeading>Requirements</CustomHeading>
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
                              {requirement?.name}
                            </CustomHeading>
                          </View>
                          <CustomHeading>
                            ₹ {requirement?.payPerDay} Per Day
                          </CustomHeading>
                        </View>

                        <View style={styles.details}>
                          <CustomHeading
                            fontSize={14}
                            color={Colors?.secondaryText}
                          >
                            Count
                          </CustomHeading>
                          <CustomHeading
                            fontSize={14}
                            color={Colors?.secondaryText}
                          >
                            Food
                          </CustomHeading>
                          <CustomHeading
                            fontSize={14}
                            color={Colors?.secondaryText}
                          >
                            Living
                          </CustomHeading>
                          <CustomHeading
                            fontSize={14}
                            color={Colors?.secondaryText}
                          >
                            ESI / PF
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

            <View style={[styles.row, { flexDirection: "column", gap: 5 }]}>
              <CustomHeading>Images</CustomHeading>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  value: {
    width: "60%",
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 8,
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
    width: "100%",
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

// import React, { useState } from "react";
// import { View, StyleSheet, Image } from "react-native";
// import Button from "@/components/inputs/Button";
// import Stepper from "@/app/(tabs)/addService/stepper";
// import { ADDSERVICESTEPS } from "@/constants";
// import { Controller, useForm } from "react-hook-form";
// import Step3 from "../../../assets/step3.jpg";
// import WorkRequirment from "@/components/inputs/WorkRequirements";

// interface ThirdScreenProps {
//   setStep: any;
//   requirements: any;
//   setRequirements: any;
// }

// const ThirdScreen: React.FC<ThirdScreenProps> = ({
//   setStep,
//   requirements,
//   setRequirements,
// }: ThirdScreenProps) => {
//   const {
//     control,
//     watch,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       requirements: requirements,
//     },
//   });

//   const [errorField, setErrorField] = useState({});

//   const onSubmit = (data: any) => {
//     setRequirements(data?.requirements);
//     setStep(4);
//   };

//   return (
//     <View style={styles?.container}>
//       <Image source={Step3} style={styles.image} />
//       <View style={{ marginVertical: 30 }}>
//         <Stepper currentStep={3} steps={ADDSERVICESTEPS} />
//       </View>
//       <View style={{ flexDirection: "column", gap: 15 }}>
//         <Controller
//           control={control}
//           name="requirements"
//           defaultValue=""
//           rules={{
//             required: "Requirements is required",
//             validate: (value) => {
//               if (!value || value.length === 0) {
//                 return "At least one requirement is needed";
//               }

//               for (let i = 0; i < value.length; i++) {
//                 const item = value[i];
//                 if (!item?.name) {
//                   setErrorField({
//                     index: i,
//                     name: "dropdown",
//                   });
//                   return `Requirement #${i + 1}: Select a worker`;
//                 }
//                 if (!item?.payPerDay) {
//                   setErrorField({
//                     index: i,
//                     name: "price",
//                   });
//                   return `Requirement #${i + 1}: Pay per day is required`;
//                 }
//                 if (isNaN(parseInt(item?.payPerDay))) {
//                   setErrorField({
//                     index: i,
//                     name: "price",
//                   });
//                   return `Requirement #${
//                     i + 1
//                   }: Pay per day should be in number`;
//                 }
//                 if (item?.payPerDay === 0 || !item?.payPerDay) {
//                   setErrorField({
//                     index: i,
//                     name: "price",
//                   });
//                   return `Requirement #${
//                     i + 1
//                   }: Pay per day must be greater than 0`;
//                 }
//                 if (item?.count === 0 || !item?.count) {
//                   setErrorField({
//                     index: i,
//                     name: "counter",
//                   });
//                   return `Requirement #${
//                     i + 1
//                   }: Total required must be greater than 0`;
//                 }
//               }
//               setErrorField({
//                 index: -1,
//                 name: "",
//               });
//               return true;
//             },
//           }}
//           render={({ field: { onChange, onBlur, value } }) => (
//             <WorkRequirment
//               name="requirements"
//               requirements={value}
//               setRequirements={onChange}
//               onBlur={onBlur}
//               errors={errors}
//               errorField={errorField}
//             />
//           )}
//         />
//       </View>
//       <View style={styles?.buttonContainer}>
//         <Button isPrimary={false} title="Back" onPress={() => setStep(2)} />
//         <Button
//           isPrimary={true}
//           title="Save and Next"
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

// export default ThirdScreen;

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Button from "@/components/inputs/Button";
import Stepper from "@/app/(tabs)/addService/stepper";
import { ADDSERVICESTEPS, REGISTERSTEPS } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import Step4 from "../../../assets/step4.jpg";
import ImageUpload from "@/components/inputs/ImagePicker";
import { AddServiceAtom } from "@/app/AtomStore/user";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "@/app/hooks/toast";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface ThirdScreenProps {
  setStep: any;
  images: string;
  setImages: any;
  description: string;
  setDescription: any;
}

const ThirdScreen: React.FC<ThirdScreenProps> = ({
  setStep,
  images,
  setImages,
  description,
  setDescription,
}: ThirdScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      images: images,
      description: description,
    },
  });
  const onSubmit = (data: any) => {
    console.log("data?.images?.length--", data?.images?.length);

    if (data?.images && data?.images?.length > 3) {
      toast?.error("You can not upload more than 3 images");
    } else {
      setDescription(data?.description);
      if (data?.images && data?.images?.length > 0) setImages(data?.images);
      setStep(4);
    }
  };

  return (
    <View style={styles?.container}>
      <Image source={Step4} style={styles.image} />
      <View style={{ marginVertical: 30 }}>
        <Stepper currentStep={4} steps={ADDSERVICESTEPS} />
      </View>

      <View style={{ flexDirection: "column", gap: 10 }}>
        <Controller
          control={control}
          name="images"
          defaultValue=""
          // rules={{
          //   required: "Please upload at least one image",
          // }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ImageUpload
              name="images"
              images={value}
              setImages={onChange}
              onBlur={onBlur}
              errors={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          defaultValue=""
          // rules={{
          //   required: "Work description is required",
          // }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextAreaInputComponent
              label="Work Description"
              name="description"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter your work description"
              containerStyle={errors?.description && styles.errorInput}
              errors={errors}
              icon={
                <Ionicons
                  name={"mail-outline"}
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, paddingRight: 10 }}
                />
              }
            />
          )}
        />
      </View>
      <View style={styles?.buttonContainer}>
        <Button isPrimary={false} title="Back" onPress={() => setStep(2)} />
        <Button
          isPrimary={true}
          title="Save and View"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});

export default ThirdScreen;

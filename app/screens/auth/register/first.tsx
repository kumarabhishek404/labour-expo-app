import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Link,
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import Colors from "@/constants/Colors";
import { useAtom, useAtomValue } from "jotai";
import {
  AddServiceAtom,
  AddServiceInProcess,
  UserAtom,
} from "@/app/AtomStore/user";
import TextInputComponent from "@/components/TextInputWithIcon";
import Button from "@/components/Button";
import { toast } from "@/app/hooks/toast";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import Stepper from "@/app/(tabs)/addService/stepper";
import { REGISTERSTEPS } from "@/constants";
import AvatarComponent from "@/components/Avatar";
import { uploadFile } from "@/app/api/user";
import { Controller, useForm } from "react-hook-form";

interface FirstScreenProps {
  setStep: any;
  // avatar: string;
  setAvatar: any;
  firstName: string;
  setFirstName: any;
  lastName: string;
  setLastName: any;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  setStep,
  // avatar,
  setAvatar,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}: FirstScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
    },
  });

  const global = useGlobalSearchParams();
  const userDetails = useAtomValue(UserAtom);
  const [isAddService, setIsAddService] = useAtom(AddServiceInProcess);
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const [title, setTitle] = useState<string>(addService?.name ?? "");
  const [description, setDescription] = useState<string>(
    addService?.description ?? ""
  );

  useEffect(() => {
    setTitle(addService?.name ?? "");
    setDescription(addService?.description ?? "");
  }, [addService]);

  const handleNext = () => {
    setStep(2);
    // if (title && description) {
    //   setAddService({
    //     ...addService,
    //     name: title,
    //     description: description,
    //   });
    //   setIsAddService(true);
    //   router?.push("/(tabs)/addService/second");
    // } else {
    //   toast.error("Please fill all the input fields");
    // }
  };

  const onSubmit = (data: any) => {
    setFirstName(data?.firstName);
    setLastName(data?.lastName);
    setStep(2);
  };

  // const handleUploadAvatar = async () => {
  //   try {
  //     const formData: any = new FormData();
  //     // const imageUri: any = images;
  //     const avatarFile = avatar.split("/").pop();
  //     formData.append("avatar", {
  //       uri: avatar,
  //       type: "image/jpeg",
  //       name: avatarFile,
  //     });
  //     const response = await uploadFile(formData);
  //     console.log("Response from avatar image uploading - ", response);
  //   } catch (err: any) {
  //     console.log("Error while uploading avatar image - ", err);
  //   }
  // };

  return (
    <>
      <View style={{ marginBottom: 20 }}>
        <Stepper currentStep={1} steps={REGISTERSTEPS} />
      </View>

      <Controller
        control={control}
        name="firstName"
        defaultValue=""
        rules={{
          required: false,
          // required: "First Name is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputComponent
            label="First Name"
            name="firstName"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter your First Name"
            containerStyle={errors?.firstName && styles.errorInput}
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

      <Controller
        control={control}
        name="lastName"
        defaultValue=""
        rules={{
          required: false,
          // required: "Last Name is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputComponent
            label="Last Name"
            name="lastName"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter your Last Name"
            containerStyle={errors?.lastName && styles.errorInput}
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

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={styles.loginButtonWrapper}
      >
        <Text style={styles.loginText}>Save and Next</Text>
      </TouchableOpacity>
      {/* <Text style={styles.continueText}>or continue with</Text>
      <TouchableOpacity style={styles.googleButtonContainer}>
        <Image
          source={require("../../../../assets/images/google.png")}
          style={styles.googleImage}
        />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity> */}
      <View style={styles.footerContainer}>
        <Text style={styles.accountText}>Already have an account!</Text>
        <Link href="/screens/auth/login" asChild>
          <TouchableOpacity>
            <Text style={styles.signupText}>Log In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 40,
  },

  label: {
    marginVertical: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: Colors?.primary,
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },

  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    // fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  signupButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    // marginTop: 20,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    // fontFamily: fonts.Regular,
    color: Colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: Colors.primary,
    // fontFamily: fonts.Regular,
  },
  signupText: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default FirstScreen;

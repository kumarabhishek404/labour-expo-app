import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import Loader from "@/components/commons/Loader";
import { register } from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import FirstScreen from "./first";
import { Feather } from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import { AddServiceAtom, AddServiceInProcess } from "@/app/AtomStore/user";
import SecondScreen from "./second";
import moment from "moment";
import ThirdScreen from "./third";
import FourthScreen from "./fourth";
import { addNewService, editService } from "@/app/api/services";
import { toast } from "@/app/hooks/toast";
import FinalScreen from "./final";

const SignupScreen = () => {
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const [isAddService, setIsAddService] = useAtom(AddServiceInProcess);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(addService?.name ?? "");
  const [description, setDescription] = useState(addService?.description ?? "");

  const [address, setAddress] = useState(addService?.address ?? "");
  const [location, setLocation] = useState<any>(addService?.location ?? {});
  const [startDate, setStartDate] = useState(
    moment(addService?.startDate).toDate() ?? new Date()
  );
  const [endDate, setEndDate] = useState(
    moment(addService?.endDate).toDate() ?? new Date()
  );

  const [requirements, setRequirements]: any = useState(
    addService?.requirements || [
      {
        name: "",
        count: 0,
        payPerDay: 0,
        food: false,
        shelter: false,
        pf: false,
        insurance: false,
      },
    ]
  );

  const [images, setImages]: any = useState(
    addService?.coverImage ? [addService?.coverImage] : []
  );

  const mutationAddService = useMutation({
    mutationKey: ["addService"],
    mutationFn: () => (addService?._id ? handleEditSubmit() : handleSubmit()),
    onSuccess: () => {
      toast?.success(
        addService?._id
          ? "Service updated successfully!"
          : "Service posted successfully!"
      );
      setAddService({});
      setIsAddService(false);
      setTitle("");
      setDescription("");
      setAddress("");
      setLocation("");
      setStartDate(new Date());
      setEndDate(new Date());
      setRequirements(
        addService?.requirements || [
          {
            name: "",
            count: 0,
            payPerDay: 0,
            food: false,
            shelter: false,
            pf: false,
            insurance: false,
          },
        ]
      );
      setImages([]);
      setStep(1);
      router?.push("/(tabs)/bookings");
    },
    onError: (err: any) => {
      console.error("Error while posting the service - ", err);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleSubmit = async () => {
    const formData: any = new FormData();
    // const imageUri: any = images[0];
    // const imageName = imageUri.split("/").pop();
    // formData.append("coverImage", {
    //   uri: imageUri,
    //   type: "image/jpeg",
    //   name: imageName,
    // });

    images.forEach((imageUri: string, index: number) => {
      const imageName = imageUri.split("/").pop();
      formData.append("images", {
        uri: imageUri,
        type: "image/jpeg",
        name: imageName,
      });
    });

    const jobData = {
      location: {
        latitude: 27.1767,
        longitude: 78.0081,
        latitudeDelta: 2,
        longitudeDelta: 2,
      },
    };

    formData.append("name", title);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("location", JSON.stringify(location || jobData?.location));
    formData.append("city", "Jalesar");
    formData.append("state", "Uttar Predesh");
    formData.append("pinCode", "207302");
    formData.append("startDate", moment(startDate).format("YYYY-MM-DD"));
    formData.append("endDate", moment(endDate).format("YYYY-MM-DD"));
    formData.append("requirements", JSON.stringify(requirements));

    console.log("form Data --", formData);

    const response: any = await addNewService(formData);
    return response?.data;
  };

  const handleEditSubmit = async () => {
    const formData: any = new FormData();
    // const imageUri: any = images[0];
    // const imageName = imageUri.split("/").pop();
    // formData.append("coverImage", {
    //   uri: imageUri,
    //   type: "image/jpeg",
    //   name: imageName,
    // });

    images.forEach((imageUri: string, index: number) => {
      const imageName = imageUri.split("/").pop();
      formData.append("images", {
        uri: imageUri,
        type: "image/jpeg",
        name: imageName,
      });
    });

    const jobData = {
      location: {
        latitude: 27.1767,
        longitude: 78.0081,
        latitudeDelta: 2,
        longitudeDelta: 2,
      },
    };

    formData.append("name", title);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("location", JSON.stringify(location || jobData?.location));
    formData.append("city", "Jalesar");
    formData.append("state", "Uttar Predesh");
    formData.append("pinCode", "207302");
    formData.append("startDate", moment(startDate).format("YYYY-MM-DD"));
    formData.append("endDate", moment(endDate).format("YYYY-MM-DD"));
    formData.append("requirements", JSON.stringify(requirements));

    console.log("form Data --", formData);

    const response: any = await editService(formData);
    return response?.data;
    // let payload = {
    //   _id: addService?._id,
    //   name: title,
    //   description: description,
    //   startDate: startDate,
    //   endDate: endDate,
    //   location: location,
    //   city: "city",
    //   state: "state",
    //   pinCode: "pinCode",
    //   address: address,
    //   requirements: requirements,
    //   images: images,
    // };

    // console.log("payload- --", payload);

    // const response: any = await editService(payload);
    // return response?.data;
  };

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return (
          <FirstScreen
            setStep={setStep}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
        );
      case 2:
        return (
          <SecondScreen
            setStep={setStep}
            address={address}
            setAddress={setAddress}
            location={location}
            setLocation={setLocation}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        );
      case 3:
        return (
          <ThirdScreen
            setStep={setStep}
            requirements={requirements}
            setRequirements={setRequirements}
          />
        );

      case 4:
        return (
          <FourthScreen
            setStep={setStep}
            images={images}
            setImages={setImages}
          />
        );

      case 5:
        return (
          <FinalScreen
            setStep={setStep}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            address={address}
            setAddress={setAddress}
            location={location}
            setLocation={setLocation}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            requirements={requirements}
            setRequirements={setRequirements}
            images={images}
            setImages={setImages}
            handleOnSubmit={
              addService?._id
                ? (data: any) => mutationAddService?.mutate(data)
                : (data: any) => mutationAddService?.mutate(data)
            }
          />
        );

      default:
        break;
    }
  };

  return (
    <ScrollView style={styles?.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (step === 1) setIsAddService(false);
                router.back();
              }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Loader loading={mutationAddService?.isPending} />
      <View style={styles.container}>
        {step < 5 && (
          <View style={styles?.customHeader}>
            <TouchableOpacity
              onPress={() => {
                if (step > 2) {
                  setStep(step - 1);
                } else if (step > 1) {
                  setStep(step - 1);
                  setIsAddService(false);
                } else {
                  router?.back();
                }
              }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
            <Text style={styles?.headerText}>
              {addService?._id ? "Edit Service" : "Add Service"}
            </Text>
          </View>
        )}
        <View style={styles.formContainer}>
          <View style={styles?.inputContainer}>{renderFormComponents()}</View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  customHeader: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
    marginLeft: 20,
  },
  formContainer: {
    // paddingVertical: 20,
  },
  inputContainer: {
    // height: 400,
  },
});

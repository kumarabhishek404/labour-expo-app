import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import Loader from "@/components/commons/Loader";
import { useMutation } from "@tanstack/react-query";
import FirstScreen from "./first";
import { Feather } from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import {
  AddServiceAtom,
  AddServiceInProcess,
  UserAtom,
} from "@/app/AtomStore/user";
import SecondScreen from "./second";
import moment from "moment";
import ThirdScreen from "./third";
import FourthScreen from "./fourth";
import { addNewService, editService } from "@/app/api/services";
import { toast } from "@/app/hooks/toast";
import FinalScreen from "./final";
import CustomHeading from "@/components/commons/CustomHeading";
import Header from "@/components/commons/Header";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import { useRefreshUser } from "@/app/hooks/useRefreshUser";
import { add } from "lodash";

const AddServiceScreen = () => {
  const { refreshUser } = useRefreshUser();
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const [isAddService, setIsAddService] = useAtom(AddServiceInProcess);
  const [step, setStep] = useState(1);
  const [type, setType] = useState(addService?.type ?? "");
  const [subType, setSubType] = useState(addService?.subType ?? "");
  const [description, setDescription] = useState(addService?.description ?? "");

  const [address, setAddress] = useState(addService?.address ?? "");
  const [location, setLocation] = useState<any>(addService?.location ?? {});
  const [startDate, setStartDate] = useState(
    moment(addService?.startDate).toDate() ?? new Date()
  );
  const [endDate, setEndDate] = useState(
    moment(addService?.endDate).toDate() ?? new Date()
  );

  console.log("addService --", addService?.type, addService?.subType);

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

  const [images, setImages]: any = useState(addService?.images ?? []);

  const mutationAddService = useMutation({
    mutationKey: [addService?._id ? "editService" : "addService"],
    mutationFn: () =>
      addService?._id ? handleEditSubmit(addService?._id) : handleSubmit(),
    onSuccess: () => {
      refreshUser();
      toast?.success(
        addService?._id
          ? t("serviceUpdatedSuccessfully")
          : t("servicePostedSuccessfully")
      );
      setAddService({});
      setIsAddService(false);
      setType("");
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
      router?.push("/(tabs)/second");
    },
    onError: (err: any) => {
      console.error("Error details:", {
        message: err?.response?.data?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        error: err,
      });

      toast.error(
        err?.response?.data?.message ||
          "Failed to update service. Please try again."
      );
    },
  });

  const handleSubmit = async () => {
    if (!type || !address || !startDate || !endDate || !requirements) {
      throw new Error("Required fields are missing");
    }

    const formData: any = new FormData();

    images.forEach((imageUri: string, index: number) => {
      if (imageUri.startsWith("http")) return;

      const imageName = imageUri.split("/").pop();
      formData.append("images", {
        uri: imageUri,
        type: "image/jpeg",
        name: imageName || `image_${index}.jpg`,
      });
    });

    formData.append("type", type);
    formData.append("subType", subType);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("location", JSON.stringify(location || {}));
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

  const handleEditSubmit = async (id: any) => {
    try {
      if (!id) {
        throw new Error("Service ID is required for editing");
      }

      console.log("Submitting service update with data:", {
        id,
        type,
        description,
        address,
        requirements,
        imageCount: images.length,
      });

      const formData: any = new FormData();

      images.forEach((imageUri: string, index: number) => {
        if (imageUri.startsWith("http")) return;

        const imageName = imageUri.split("/").pop();
        formData.append("images", {
          uri: imageUri,
          type: "image/jpeg",
          name: imageName || `image_${index}.jpg`,
        });
      });

      const existingImages = images.filter((img: string) =>
        img.startsWith("http")
      );
      if (existingImages.length) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      formData.append("serviceId", id);
      formData.append("type", type);
      formData.append("subType", subType);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("location", JSON.stringify(location || {}));
      formData.append("city", "Jalesar");
      formData.append("state", "Uttar Predesh");
      formData.append("pinCode", "207302");
      formData.append("startDate", moment(startDate).format("YYYY-MM-DD"));
      formData.append("endDate", moment(endDate).format("YYYY-MM-DD"));
      formData.append("requirements", JSON.stringify(requirements));

      console.log("form Data --", formData);

      const response: any = await editService(formData);

      if (!response?.data) {
        throw new Error("No data received from server");
      }

      return response?.data;
    } catch (error: any) {
      console.error("Error in handleEditSubmit:", error);
      throw error; // Re-throw to be handled by mutation
    }
  };

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return (
          <FirstScreen
            setStep={setStep}
            type={type}
            setType={setType}
            subType={subType}
            setSubType={setSubType}
            requirements={requirements}
            setRequirements={setRequirements}
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
            images={images}
            setImages={setImages}
            description={description}
            setDescription={setDescription}
          />
        );

      // case 3:
      //   return (
      //     <FourthScreen
      //       setStep={setStep}
      //       images={images}
      //       setImages={setImages}
      //     />
      //   );

      case 4:
        return (
          <FinalScreen
            setStep={setStep}
            type={type}
            setType={setType}
            subType={subType}
            setSubType={setSubType}
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
          headerTransparent: false,
          headerShown: true,
          header: () => (
            <CustomHeader
              title={addService?._id ? t("editService") : t("addService")}
              left="back"
              onLeftAction={() => {
                if (step > 2) {
                  setStep(step - 1);
                } else if (step > 1) {
                  setStep(step - 1);
                  setIsAddService(false);
                } else {
                  router?.back();
                }
              }}
            />
          ),
        }}
      />
      <Loader loading={mutationAddService?.isPending} />
      <View style={styles.container}>
        {/* {step < 5 && (
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
            <CustomHeading fontSize={18}>
              {addService?._id ? "Edit Service" : "Add Service"}
            </CustomHeading>
          </View>
        )} */}
        <View>{renderFormComponents()}</View>
      </View>
    </ScrollView>
  );
};

export default AddServiceScreen;

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
});

import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import Loader from "@/components/commons/Loaders/Loader";
import { useMutation } from "@tanstack/react-query";
import FirstScreen from "./first";
import { useAtom, useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import moment from "moment";
import TOAST from "@/app/hooks/toast";
import FinalScreen from "./final";
import { t } from "@/utils/translationHelper";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Stepper from "@/components/commons/Stepper";
import { ADDSERVICESTEPS } from "@/constants";
import EMPLOYER from "@/app/api/employer";
import CustomHeading from "@/components/commons/CustomHeading";
import TopHeaderLinks from "@/components/commons/TopHeaderLinks";
import ThirdScreen from "./third";
import SecondScreen from "./second";
import ButtonComp from "@/components/inputs/Button";

const AddServiceScreen = () => {
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [addService, setAddService] = useAtom(Atoms?.AddServiceAtom);
  const [addServiceStep, setAddServiceStep] = useAtom(
    Atoms?.AddServiceStepAtom
  );
  const [step, setStep] = useState(1);
  const [type, setType] = useState(addService?.type ?? "");
  const [subType, setSubType] = useState(addService?.subType ?? "");
  const [description, setDescription] = useState(addService?.description ?? "");
  const [address, setAddress] = useState(addService?.address ?? "");
  const [location, setLocation] = useState<any>(addService?.location ?? {});
  const [startDate, setStartDate] = useState(
    moment(addService?.startDate).toDate() ?? new Date()
  );
  const [duration, setDuration] = useState(addService?.duration ?? 0);

  const [requirements, setRequirements]: any = useState(
    addService?.requirements || [
      {
        name: "",
        count: 0,
        payPerDay: 0,
        food: false,
        living: false,
        esi_pf: false,
      },
    ]
  );
  const [facilities, setFacilities] = useState({
    food: addService?.facilities?.food || false,
    living: addService?.facilities?.living || false,
    esi_pf: addService?.facilities?.esi_pf || false,
    travelling: addService?.facilities?.travelling || false,
  });

  const [images, setImages]: any = useState(addService?.images ?? []);

  const mutationAddService = useMutation({
    mutationKey: [addService?._id ? "editService" : "addService"],
    mutationFn: () =>
      addService?._id ? handleEditSubmit(addService?._id) : handleSubmit(),
    onSuccess: () => {
      refreshUser();
      TOAST?.success(
        addService?._id
          ? t("serviceUpdatedSuccessfully")
          : t("servicePostedSuccessfully")
      );
      setAddService({});
      setType("");
      setSubType("");
      setDescription("");
      setAddress("");
      setLocation("");
      setStartDate(new Date());
      setDuration(0);
      setRequirements(
        addService?.requirements || [
          {
            name: "",
            count: 0,
            payPerDay: 0,
            food: false,
            living: false,
            esi_pf: false,
          },
        ]
      );
      setImages([]);
      setStep(1);
      setAddServiceStep(1);
      router?.push({
        pathname: "/screens/service",
        params: {
          title: "My All Services and Bookings",
          type: "myServices",
        },
      });
    },
    onError: (err: any) => {
      console.error("Error details:", {
        message: err?.response?.data?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        error: err,
      });

      TOAST?.error(
        err?.response?.data?.message ||
          "Failed to update service. Please try again."
      );
    },
  });

  useEffect(() => {
    setStep(1);
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      handleBackAction();
      return true; // Prevent default back navigation
    };

    // Add event listener for back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Cleanup the event listener on unmount
    return () => backHandler.remove();
  }, [step, setStep]);

  const handleSubmit = async () => {
    if (!type || !address || !startDate || !requirements) {
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
    formData.append("startDate", moment(startDate).format("YYYY-MM-DD"));
    formData.append("duration", duration);
    formData.append("requirements", JSON.stringify(requirements));
    formData.append("facilities", JSON.stringify(facilities));

    const response: any = await EMPLOYER?.addNewService(formData);
    return response?.data;
  };

  const handleBackAction = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (router?.canGoBack()) {
      router?.back();
    } else {
      BackHandler?.exitApp();
    }
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
      formData.append("startDate", moment(startDate).format("YYYY-MM-DD"));
      formData.append("duration", duration);
      formData.append("requirements", JSON.stringify(requirements));
      formData.append("facilities", JSON.stringify(facilities));

      const response: any = await EMPLOYER?.editService(formData);

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
            images={images}
            setImages={setImages}
            requirements={requirements}
            setRequirements={setRequirements}
          />
        );
      case 2:
        return (
          <SecondScreen
            setStep={setStep}
            requirements={requirements}
            setRequirements={setRequirements}
            facilities={facilities}
            setFacilities={setFacilities}
            type={type}
            subType={subType}
          />
        );
      case 3:
        return (
          <ThirdScreen
            setStep={setStep}
            address={address}
            setAddress={setAddress}
            location={location}
            setLocation={setLocation}
            startDate={startDate}
            setStartDate={setStartDate}
            duration={duration}
            setDuration={setDuration}
            description={description}
            setDescription={setDescription}
          />
        );

      case 4:
        return (
          <FinalScreen
            setStep={setStep}
            type={type}
            subType={subType}
            description={description}
            address={address}
            location={location}
            startDate={startDate}
            duration={duration}
            requirements={requirements}
            images={images}
            facilities={facilities}
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

  const ClickBookedWorker = () =>
    router?.push({
      pathname: "/screens/bookings",
      params: {
        title: "My Booked Workers",
        type: "booked",
        searchCategory: JSON.stringify({ name: "", skill: "" }),
      },
    });

  const ClickMyAllServices = () =>
    router?.push({
      pathname: "/screens/service",
      params: { title: "My All Services and Bookings", type: "myServices" },
    });

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: Colors?.secondaryBackground,
          minHeight: "100%",
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-start", gap: 20 }}>
          <View style={styles.header}>
            <Stepper currentStep={step} steps={ADDSERVICESTEPS} />
          </View>
          {step === 1 && (
            <TopHeaderLinks
              title={["BOOKED WORKERS", "MY ALL SERVICES"]}
              onPress={[ClickBookedWorker, ClickMyAllServices]}
              icon={[
                <Ionicons
                  key={0}
                  name="people"
                  size={22}
                  color={Colors.primary}
                />,
                <MaterialIcons
                  key={1}
                  name="work"
                  size={22}
                  color={Colors.primary}
                  style={{ marginLeft: 8 }}
                />,
              ]}
            />
          )}

          <View style={[styles.searchContainer, styles.shadowBox]}>
            <CustomHeading
              textAlign="left"
              baseFont={22}
              style={{ marginBottom: 20, paddingBottom: 10 }}
              color={Colors?.heading}
            >
              {step === 1 && "Select Work Type and Sub Type"}
              {step === 2 && "Add Requirments workers"}
              {step === 3 && "Address, Start Date and Duration"}
              {step === 4 && "Check all the details And Submit"}
            </CustomHeading>
            <Loader loading={mutationAddService?.isPending} />
            <View>{renderFormComponents()}</View>
          </View>
          <View></View>
        </View>
      </ScrollView>
    </>
  );
};

export default AddServiceScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: Colors?.background,
    padding: 20,
    position: "relative",
  },
  tab: {
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 10,
    marginHorizontal: 10,
  },
  activeTab: {
    backgroundColor: "yellow",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },
  searchContainer: {
    backgroundColor: Colors?.background,
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  shadowBox: {
    shadowColor: "#000", // Subtle black shadow
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.1, // Light shadow for elegance
    shadowRadius: 6, // Smooth blur effect
    elevation: 4, // Works for Android
  },
  input: {
    height: 53,
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    height: 53,
  },
  dropDownContainer: {
    borderColor: "#ddd",
    borderRadius: 10,
    position: "absolute",
  },
  searchButton: {
    backgroundColor: "yellow",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  cardScroll: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  cardPrice: {
    fontSize: 14,
    color: "gray",
  },
  bottomOption: {
    width: "100%",
    textAlign: "right",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  loaderStyle: {
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingBottom: 10,
  },
});

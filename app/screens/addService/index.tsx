import {
  Alert,
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import Colors from "@/constants/Colors";
import { router, useFocusEffect, useNavigation } from "expo-router";
import Loader from "@/components/commons/Loaders/Loader";
import { useMutation } from "@tanstack/react-query";
import FirstScreen from "./first";
import { useAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import moment from "moment";
import TOAST from "@/app/hooks/toast";
import FinalScreen from "./final";
import { t } from "@/utils/translationHelper";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import EMPLOYER from "@/app/api/employer";
import CustomHeading from "@/components/commons/CustomHeading";
import ThirdScreen from "./third";
import SecondScreen from "./second";
import IconButtonGroup from "@/components/commons/IconGroupButtons";
import myServices from "../../../assets/myServices.png";
import bookedWorkers from "../../../assets/bookedWorkers.png";
import GradientWrapper from "../../../components/commons/GradientWrapper";

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
  const [isFormDirty, setIsFormDirty] = useState(false);
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
          title: "titleMyAllServicesAndBookings",
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

  const [prevType, setPrevType] = useState(type);
  const navigation = useNavigation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevSubType, setPrevSubType] = useState(subType);
  const contentRef = useRef<View>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    if (prevType !== type || prevSubType !== subType) {
      setRequirements([
        {
          name: "",
          count: 0,
          payPerDay: 0,
          food: false,
          living: false,
          esi_pf: false,
        },
      ]);

      setFacilities({
        food: false,
        living: false,
        esi_pf: false,
        travelling: false,
      });

      setPrevType(type);
      setPrevSubType(subType);
    }
  }, [type, subType]);

  useEffect(() => {
    setStep(1);
  }, []);

  useEffect(() => {
    const beforeRemoveListener = (e: any) => {
      if (isFormDirty && !isNavigating) {
        e.preventDefault(); // Prevent default navigation

        Alert.alert(t("leaveWithoutSaving"), t("areYouWantLeave"), [
          { text: t("stay"), style: "cancel" },
          {
            text: t("leave"),
            style: "destructive",
            onPress: () => {
              setIsNavigating(true);
              navigation.dispatch(e.data.action); // Allow navigation
            },
          },
        ]);
      }
    };

    // Attach event listener
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      beforeRemoveListener
    );

    // Cleanup function to remove listener
    return () => {
      unsubscribe(); // Correct way to remove listener
    };
  }, [isFormDirty, isNavigating, navigation, router]);

  // Reset step count only when coming back to this screen
  useFocusEffect(
    React.useCallback(() => {
      return () => setStep(1); // Reset when leaving the screen
    }, [])
  );

  // Handle back button (Allow normal back navigation)
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (step > 1) {
          setStep((prevStep) => prevStep - 1);
          return true; // Prevent default back behavior
        }
        return false; // Allow back navigation
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [step])
  );

  useEffect(() => {
    if (type || subType || description) {
      setIsFormDirty(true);
    }
  }, [type, subType, description]);

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

    console.log("Formdare---", formData);

    const response: any = await EMPLOYER?.addNewService(formData);
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
        title: "titleMyBookedWorkers",
        type: "booked",
        searchCategory: JSON.stringify({ name: "", skill: "" }),
      },
    });

  const ClickMyAllServices = () =>
    router?.push({
      pathname: "/screens/service",
      params: { title: "titleMyAllServicesAndBookings", type: "myServices" },
    });

  const buttons = [
    {
      icon: bookedWorkers,
      label: t("bookedWorkers"),
      onPress: ClickBookedWorker,
    },
    {
      icon: myServices,
      label: t("myServices"),
      onPress: ClickMyAllServices,
    },
  ];

  const onContentLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  }, []);

  const shouldShowScroll =
    contentHeight > screenHeight - (step === 4 ? 0 : 230);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <IconButtonGroup buttons={buttons} />
      </View>
      <GradientWrapper
        height={Dimensions.get("window").height - (step === 4 ? 0 : 230)}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollViewContent,
            shouldShowScroll ? {} : { flexGrow: 1 }, // Allow content to grow if no scroll needed
          ]}
          showsVerticalScrollIndicator={shouldShowScroll}
        >
          <View
            style={[styles.searchContainer, styles.shadowBox]}
            onLayout={onContentLayout}
            ref={contentRef}
          >
            <CustomHeading
              textAlign="left"
              baseFont={22}
              style={styles?.boxHeader}
              color={Colors?.primary}
            >
              {step === 1 && t("step1")}
              {step === 2 && t("step2")}
              {step === 3 && t("step3")}
              {step === 4 && t("step4")}
            </CustomHeading>
            <Loader loading={mutationAddService?.isPending} />
            <View>{renderFormComponents()}</View>
          </View>
        </ScrollView>
      </GradientWrapper>
    </View>
  );
};

export default AddServiceScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 80, // Add some padding at the bottom if needed
  },
  header: {
    backgroundColor: Colors?.primary,
    paddingBottom: 20,
    position: "relative",
  },

  searchContainer: {
    backgroundColor: Colors?.white,
    padding: 15,
    marginHorizontal: 15,
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
  boxHeader: {
    marginBottom: 10,
    paddingBottom: 10,
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

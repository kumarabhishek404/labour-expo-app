import EMPLOYER from "@/app/api/employer";
import Atoms from "@/app/AtomStore";
import TOAST from "@/app/hooks/toast";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import Loader from "@/components/commons/Loaders/Loader";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useFocusEffect, useNavigation } from "expo-router";
import { useAtom } from "jotai";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import bookedWorkers from "../../../assets/bookedWorkers.png";
import myServices from "../../../assets/myServices.png";
import GradientWrapper from "../../../components/commons/GradientWrapper";
import FinalScreen from "./final";
import SelectWorkCategoryStep from "./SelectWorkCategory";
import SelectWorkSubCategoryStep from "./SelectWorkSubCategory";
import AddRequirementsStep from "./SelectWorkerSalary";
import SelectFacilitiesStep from "./SelectFacilities";
import SelectLocationAndDateStep from "./SelectLocation&Date";
import SelectDurationAndDescriptionStep from "./SetDuration&Description";
import FormProgressBar from "@/components/commons/FormProgress";
import UploadWorkImagesStep from "./UploadImagesStep";
import { getLatLongFromAddress } from "@/constants/functions";

const AddServiceScreen = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [addService, setAddService] = useAtom(Atoms?.AddServiceAtom);
  const [addServiceStep, setAddServiceStep] = useAtom(
    Atoms?.AddServiceStepAtom,
  );
  const [step, setStep] = useState(1);
  const [type, setType] = useState(addService?.type ?? "");
  const [subType, setSubType] = useState(addService?.subType ?? "");
  const [description, setDescription] = useState(addService?.description ?? "");
  const [address, setAddress] = useState(addService?.address ?? "");
  const [location, setLocation] = useState<any>(addService?.location ?? {});
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  };

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const pollingRef = useRef<any>(null);

  console.log("address----", address);

  console.log("location----", location);

  const [startDate, setStartDate] = useState(
    addService?.startDate
      ? moment(addService.startDate).toDate()
      : getTomorrow(),
  );
  const [duration, setDuration] = useState(addService?.duration ?? 0);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [requirements, setRequirements]: any = useState(
    addService?.requirements || [],
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
    onSuccess: (data: any) => {
      const serviceId = data?.data?._id || data?._id;

      // ✅ Start polling BEFORE reset
      if (serviceId) {
        startPolling(serviceId);
      }

      refreshUser();

      TOAST?.success(
        addService?._id
          ? t("serviceUpdatedSuccessfully")
          : t("servicePostedSuccessfully"),
      );

      setAddService({});
      setType("");
      setSubType("");
      setDescription("");
      setAddress("");
      setLocation("");
      setStartDate(getTomorrow());
      setDuration(0);
      setRequirements([]);
      setImages([]);
      setStep(1);
      setAddServiceStep(1);

      router?.push({
        pathname: "/(tabs)/third",
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
          "Failed to update service. Please try again.",
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
    Dimensions.get("window").height,
  );

  useEffect(() => {
    if (prevType !== type || prevSubType !== subType) {
      setRequirements([]);

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
      beforeRemoveListener,
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
    }, []),
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

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );

      return () => subscription.remove();
    }, [step]),
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

    const finalLocation = await ensureLocation(location, address);

    formData.append("type", type);
    formData.append("subType", subType);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("geoLocation", JSON.stringify(finalLocation));
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
        img.startsWith("http"),
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

  const onSubmit = (images: any) => {
    if (images && images?.length > 3) {
      TOAST?.error("You can not upload more than 3 images");
    } else {
      if (images && images?.length > 0) setImages(images);
      setStep(8);
    }
  };

  const getUploadStatus = async (serviceId: string) => {
    try {
      const res: any = await EMPLOYER.getServiceUploadStatus(serviceId);
      return res;
    } catch (err) {
      console.log("Status API error:", err);
    }
  };

  const startPolling = (serviceId: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const res = await getUploadStatus(serviceId);

        const status = res?.status;
        const progress = res?.progress;

        setUploadStatus(status);
        setUploadProgress(progress || 0);

        // ✅ When upload completes
        if (progress === 100 || status === "COMPLETED") {
          clearInterval(pollingRef.current);
          pollingRef.current = null;

          // 🔥 Silent refresh (NO loader)
          queryClient.invalidateQueries({
            queryKey: ["myWorkRequests"],
            refetchType: "inactive", // prevents aggressive refetch
          });

          // OR (even smoother)
          queryClient.refetchQueries({
            queryKey: ["myWorkRequests"],
            type: "inactive", // no UI flicker
          });
        }

        if (status === "FAILED") {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 2000);
  };

  const ensureLocation = async (location: any, address: string) => {
    try {
      // ✅ Case 1: Already has coordinates
      if (location?.coordinates?.length === 2) {
        return location;
      }

      // ❌ No address → can't proceed
      if (!address) return null;

      // ✅ Fetch from address
      const coords = await getLatLongFromAddress(address);

      if (!coords) return null;

      // ✅ Convert to GeoJSON (IMPORTANT)
      return {
        type: "Point",
        coordinates: [coords.longitude, coords.latitude],
      };
    } catch (err) {
      console.log("ensureLocation error:", err);
      return null;
    }
  };

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return (
          <SelectWorkCategoryStep
            defaultType={type}
            onBack={() => router.back()}
            onNext={(selectedType) => {
              setType(selectedType);
              setStep(2);
            }}
          />
        );
      case 2:
        return (
          <SelectWorkSubCategoryStep
            type={type}
            defaultSubType={subType}
            onBack={() => setStep(1)}
            onNext={(selectedSubType) => {
              setSubType(selectedSubType);
              setStep(3);
            }}
          />
        );

      case 3:
        return (
          <AddRequirementsStep
            type={type}
            subType={subType}
            defaultRequirements={requirements}
            onBack={() => setStep(2)}
            onNext={(data) => {
              setRequirements(data);
              setStep(4);
            }}
          />
        );

      case 4:
        return (
          <SelectLocationAndDateStep
            address={address}
            setAddress={setAddress}
            location={location}
            setLocation={setLocation}
            startDate={startDate}
            setStartDate={setStartDate}
            onBack={() => setStep(3)}
            onNext={() => {
              setStep(5);
            }}
          />
        );

      case 5:
        return (
          <SelectDurationAndDescriptionStep
            duration={duration}
            setDuration={setDuration}
            description={description}
            setDescription={setDescription}
            onBack={() => setStep(4)}
            onNext={() => {
              setStep(6);
            }}
          />
        );

      case 6:
        return (
          <SelectFacilitiesStep
            facilities={facilities}
            setFacilities={setFacilities}
            onBack={() => setStep(5)}
            onNext={() => setStep(7)}
          />
        );

      case 7:
        return (
          <UploadWorkImagesStep
            defaultImages={images}
            onBack={() => setStep(6)}
            onSubmitFinal={onSubmit}
          />
        );

      case 8:
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
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ flex: 1 }}>
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
            <FormProgressBar currentStep={step} />
            <View
              style={[styles.searchContainer, styles.shadowBox]}
              onLayout={onContentLayout}
              ref={contentRef}
            >
              <Loader loading={mutationAddService?.isPending} />
              <View>{renderFormComponents()}</View>
            </View>
          </ScrollView>
        </GradientWrapper>
      </View>
    </>
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
    marginTop: 10,
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

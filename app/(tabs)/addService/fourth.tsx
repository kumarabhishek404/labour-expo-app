import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import Step4 from "../../../assets/step4.jpg";
import ImageUpload from "@/components/ImagePicker";
import { router } from "expo-router";
import Animated from "react-native-reanimated";
import Button from "@/components/Button";
import { AddServiceAtom } from "@/app/AtomStore/user";
import { useAtom } from "jotai";
import { toast } from "@/app/hooks/toast";
import { addNewService } from "@/app/api/services";
import Loader from "@/components/Loader";
import Stepper from "./stepper";

interface WorkImagesProps {}
const { width } = Dimensions.get("window");

interface ImageAsset {
  uri: string;
}

const WorkImages: React.FC<WorkImagesProps> = () => {
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const [images, setImages]: any = useState<ImageAsset[]>([
    addService?.coverImage,
  ]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("add Service -----", addService?.coverImage);

  const handleSubmit = async () => {
    if (images && images?.length > 0) {
      setIsLoading(true);
      const formData: any = new FormData();
      const imageUri: any = images[0];
      const imageName = imageUri.split("/").pop();
      formData.append("coverImage", {
        uri: imageUri,
        type: "image/jpeg",
        name: imageName,
      });

      const jobData = {
        location: {
          latitude: 433.54545,
          longitude: 34.0043,
        },
        startDate: "2024-10-5",
        endDate: "2024-12-30",
      };

      formData.append("name", addService?.name);
      formData.append("description", addService?.description);
      formData.append("location", JSON.stringify(addService.location));
      formData.append("startDate", jobData?.startDate);
      formData.append("endDate", jobData?.endDate);
      formData.append("city", addService.city || "Jalesar");
      formData.append("state", addService.state || "Uttar Predesh");
      formData.append("pinCode", addService.pinCode || "207302");
      formData.append("address", addService?.address || "");
      formData.append("requirements", JSON.stringify(addService.requirements));

      console.log("payloadddd---", formData);

      try {
        const response: any = await addNewService(formData);
        console.log("Response Data ---", response?.data);
        if (response?.success) {
          setIsLoading(false);
          toast?.success("Form submittnew ed successfully!");
          router?.push("/addService/final");
        } else {
          setIsLoading(false);
          toast?.error("Failed to submit form.");
        }
      } catch (error: any) {
        console.log("error?.response?.data?.message--", error);
        setIsLoading(false);
        // toast.error("Error submitting form:", error?.response?.data?.message);
      }
    } else {
      toast.error("Please fill all the input fields");
    }
  };

  return (
    <>
      <Loader loading={isLoading} />
      <View style={styles.container}>
        <View style={styles?.customHeader}>
          <Text style={styles?.headerText}>Add Service</Text>
        </View>

        <Image source={Step4} style={styles.image} />
        <Stepper currentStep={4} />

        <View style={styles?.formContainer}>
          <ImageUpload images={images} setImages={setImages} />

          <ScrollView horizontal style={styles.imagePreview}></ScrollView>
        </View>
      </View>

      <Animated.View style={styles.footer}>
        <Button isPrimary={false} title="Back" onPress={() => router.back()} />
        <Button isPrimary={true} title="Post Service" onPress={handleSubmit} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    paddingHorizontal: 20,
  },
  headerText: {
    // textAlign: 'center',
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    marginBottom: 20,
  },
  label: { marginVertical: 10 },
  uploadBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  uploadText: { color: "#fff", fontSize: 16 },
  imagePreview: { flexDirection: "row", marginTop: 20 },
  imagePreviewItem: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    backgroundColor: Colors?.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },
});

export default WorkImages;

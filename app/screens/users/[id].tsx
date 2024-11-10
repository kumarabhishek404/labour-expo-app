import { Dimensions, Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Stack,
  useFocusEffect,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import ViewMap from "@/components/commons/ViewMap";
import { getWorkerById } from "../../api/workers";
import { getMediatorById } from "@/app/api/mediator";
import { getEmployerById } from "@/app/api/employer";
import { useQuery } from "@tanstack/react-query";
import profileImage from "../../../assets/images/placeholder-person.jpg";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import UserInfoComponent from "@/components/commons/UserInfoBox";
import CoverImage from "../../../assets/banner-placeholder.jpg";
import SkillSelector from "@/components/commons/SkillSelector";
import { MEDIATORTYPES, WORKERTYPES } from "@/constants";
import WorkInformation from "@/components/commons/WorkInformation";
import WallletInformation from "@/components/commons/WalletInformation";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import ButtonContainer from "./buttons";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const Worker = () => {
  const userDetails = useAtomValue(UserAtom);
  const { id } = useLocalSearchParams();
  const [worker, setWorker]: any = useState({});
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [isWorkerBooked, setIsWorkerBooked] = useState(
    worker?.bookedBy || false
  );
  const [isWorkerLiked, setIsWorkerLiked] = useState(
    worker?.likedBy?.includes(userDetails?._id) || false
  );

  const { role, title } = useGlobalSearchParams();

  const {
    isLoading,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [
      role === "workers"
        ? "workerDetails"
        : role === "mediators"
        ? "mediatorDetails"
        : "empoyerDetails",
    ],
    queryFn: () =>
      role === "workers"
        ? getWorkerDetailsById(id)
        : role === "mediators"
        ? getMediatorDetailsById(id)
        : getEmployerDetailsById(id),
    retry: 0,
    enabled: !!id,
  });

  const getWorkerDetailsById = async (id: any) => {
    try {
      const response = await getWorkerById(id);
      return response;
    } catch (err) {
      router.back();
      console.log("error while getting details of worker");
    }
  };

  const getMediatorDetailsById = async (id: any) => {
    try {
      const response = await getMediatorById(id);
      return response;
    } catch (err) {
      router.back();
      console.log("error while getting details of mediator");
    }
  };

  const getEmployerDetailsById = async (id: any) => {
    try {
      const response = await getEmployerById(id);
      return response;
    } catch (err) {
      router.back();
      console.log("error while getting details of employer");
    }
  };

  useEffect(() => {
    setIsWorkerLiked(worker?.likedBy?.includes(userDetails?._id) || false);
    setIsWorkerBooked(worker?.bookedBy?.includes(userDetails?._id) || false);
  }, [worker]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setWorker(response?.data);
      return () => unsubscribe;
    }, [response])
  );

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title={title || "Details"} left="back" right="like" />
          ),
        }}
      />
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Animated.Image
            source={
              worker?.coverImage ? { uri: worker?.coverImage } : CoverImage
            }
            style={[styles.image, imageAnimatedStyle]}
          />
          <View style={styles.contentWrapper}>
            <Image
              source={
                worker?.profilePicture
                  ? { uri: worker?.profilePicture }
                  : profileImage
              }
              style={styles.workerImage}
            />
            <CustomHeading textAlign="left" fontSize={20}>
              {worker?.firstName} {worker?.lastName}
            </CustomHeading>

            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={Colors.primary}
              />
              <CustomText>{worker?.address || "Address not found"}</CustomText>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={styles?.highlightBox}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                </View>
                <View>
                  <CustomText textAlign="left">Price</CustomText>
                  <CustomHeading fontSize={14} textAlign="left">
                    {worker?.duration || 0} Rs / Day
                  </CustomHeading>
                </View>
              </View>
              <View style={styles?.highlightBox}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="star" size={18} color={Colors.primary} />
                </View>
                <View>
                  <CustomText textAlign="left">Rating</CustomText>
                  <CustomHeading fontSize={14} textAlign="left">
                    {worker?.rating || 0}
                  </CustomHeading>
                </View>
              </View>
            </View>

            <CustomText>{worker?.description}</CustomText>

            <SkillSelector
              canAddSkills={false}
              isShowLabel={true}
              style={styles?.skillsContainer}
              userSkills={worker?.skills}
              availableSkills={
                userDetails?.rol === "WORKER" ? WORKERTYPES : MEDIATORTYPES
              }
            />

            <UserInfoComponent user={worker} style={{ marginHorizontal: 0 }} />

            <WallletInformation type="earnings" wallet={worker} />

            <WorkInformation information={worker} />
          </View>
        </Animated.ScrollView>
      </View>

      <ButtonContainer
        isLoading={isLoading || isRefetching}
        worker={worker}
        refetch={refetch}
        isWorkerBooked={isWorkerBooked}
        isWorkerLiked={isWorkerLiked}
      />
    </>
  );
};

export default Worker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
    backgroundColor: Colors.primary,
  },
  contentWrapper: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  workerImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
    position: "absolute",
    right: 22,
    top: -130,
  },
  listingLocationWrapper: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 10,
    alignItems: "center",
    gap: 6,
  },
  highlightWrapper: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
    columnGap: 2,
  },
  highlightBox: {
    width: "48%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  highlightIcon: {
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    alignItems: "center",
  },
  highlightTxt: {
    fontSize: 12,
    color: "#999",
  },
  highlightTxtVal: {
    fontSize: 14,
    fontWeight: "600",
  },
  row: {
    paddingTop: 0,
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: "#d4d4d4",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  skillsContainer: {
    padding: 12,
    flexDirection: "column",
    marginBottom: 5,
    backgroundColor: "#ddd",
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
});

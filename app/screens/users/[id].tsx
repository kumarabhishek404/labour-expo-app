import { Dimensions, Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
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
import { t } from "@/utils/translationHelper";
import Button from "@/components/inputs/Button";
import UserReviews from "@/components/commons/UserReviews";
import { getUserById } from "@/app/api/user";
import ServiceInformation from "@/components/commons/ServiceInformation";
import ProfilePicture from "@/components/commons/ProfilePicture";
import WorkHistory from "@/components/commons/WorkHistory";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const User = () => {
  const userDetails = useAtomValue(UserAtom);
  const { id } = useLocalSearchParams();
  const [user, setUser]: any = useState({});
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [isUserBooked, setIsUserBooked] = useState(user?.bookedBy || false);
  const [isUserLiked, setIsUserLiked] = useState(
    user?.likedBy?.includes(userDetails?._id)
  );
  const [isUserRequested, setIsUserRequested] = useState(
    user?.requestedBy?.includes(userDetails?._id)
  );
  const [isInYourTeam, setIsInYourTeam] = useState(
    user?.employedBy?.includes(userDetails?._id)
  );
  const reviewsSectionRef = useRef<View>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [reviewsPosition, setReviewsPosition] = useState(0);

  const { role, title } = useGlobalSearchParams();

  const {
    isLoading,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userDetails", id],
    queryFn: () => getUserById(id),
    retry: 0,
    enabled: !!id,
  });

  useEffect(() => {
    setIsUserLiked(user?.likedBy?.includes(userDetails?._id));
    setIsUserBooked(user?.bookedBy?.includes(userDetails?._id));
    setIsUserRequested(user?.requestedBy?.includes(userDetails?._id));
    setIsInYourTeam(user?.employedBy?.includes(userDetails?._id));
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setUser(response?.data);
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

  const scrollToReviews = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: reviewsPosition, animated: true });
    }
  };

  const handleReviewAction = () => {
    if (hasUserReviewed) {
      scrollToReviews();
    } else {
      router?.push({
        pathname: "/screens/reviews/addReview/[id]",
        params: {
          id: user?._id,
          role: "workers",
          type: "add",
          data: undefined,
        },
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={Array.isArray(title) ? title[0] : title}
              left="back"
            />
          ),
        }}
      />
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Animated.Image
            source={user?.coverImage ? { uri: user?.coverImage } : CoverImage}
            style={[styles.image, imageAnimatedStyle]}
          />
          <View style={styles.contentWrapper}>
            <ProfilePicture
              uri={user?.profilePicture}
              style={styles.workerImage}
            />
            <CustomHeading textAlign="left" fontSize={20}>
              {user?.firstName} {user?.lastName}
            </CustomHeading>

            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={Colors.primary}
              />
              <CustomText>{user?.address || "Address not found"}</CustomText>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={[styles?.highlightBox, { width: "42%" }]}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                </View>
                <View>
                  <CustomText textAlign="left">{t("price")}</CustomText>
                  <CustomHeading fontSize={14} textAlign="left">
                    {user?.duration || 0} Rs / {t("perDay")}
                  </CustomHeading>
                </View>
              </View>
              <View style={[styles?.highlightBox, { width: "58%" }]}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="star" size={18} color={Colors.primary} />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <CustomText textAlign="left">{t("rating")}</CustomText>
                    <CustomHeading fontSize={14} textAlign="left">
                      {user?.rating?.average || 0}
                    </CustomHeading>
                  </View>
                  <Button
                    isPrimary={true}
                    title={hasUserReviewed ? t("viewReview") : t("addReview")}
                    onPress={handleReviewAction}
                    style={{
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                      backgroundColor: "#fa6400",
                      borderColor: "#fa6400",
                    }}
                    textStyle={{ fontSize: 12 }}
                  />
                </View>
              </View>
            </View>

            <CustomText>{user?.description}</CustomText>

            {role !== "employers" && (
              <SkillSelector
                canAddSkills={false}
                isShowLabel={true}
                style={styles?.skillsContainer}
                userSkills={user?.skills}
                availableSkills={
                  user?.role === "WORKER" ? WORKERTYPES : MEDIATORTYPES
                }
              />
            )}

            <UserInfoComponent user={user} style={{ marginHorizontal: 0 }} />

            <WallletInformation
              type={
                user?.role === "EMPLOYER"
                  ? "spents"
                  : user?.role === "WORKER"
                  ? "earnings"
                  : "both"
              }
              wallet={user?.wallet}
            />

            {user?.role === "EMPLOYER" ? (
              <ServiceInformation information={user?.serviceDetails} />
            ) : user?.role === "WORKER" ? (
              <WorkInformation information={user?.workDetails} />
            ) : (
              <View style={{ flexDirection: "column", gap: 20 }}>
                <WorkInformation information={user?.workDetails} />
                <ServiceInformation information={user?.serviceDetails} />
              </View>
            )}

            {user?.role !== "EMPLOYER" && (
              <WorkHistory workHistory={user?.workHistory} />
            )}

            <UserReviews
              ref={reviewsSectionRef}
              onLayout={(event) => {
                const { y } = event.nativeEvent.layout;
                setReviewsPosition(y);
              }}
              setHasUserReviewed={setHasUserReviewed}
              workerId={id as string}
            />
          </View>
        </Animated.ScrollView>
      </View>

      <ButtonContainer
        isLoading={isLoading || isRefetching}
        user={user}
        refetch={refetch}
        isUserBooked={isUserBooked}
        isUserLiked={isUserLiked}
        isUserRequested={isUserRequested}
        isInYourTeam={isInYourTeam}
      />
    </>
  );
};

export default User;

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

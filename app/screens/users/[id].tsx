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
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import UserInfoComponent from "@/components/commons/UserInfoBox";
import CoverImage from "../../../assets/banner-placeholder.jpg";
import SkillSelector from "@/components/commons/SkillSelector";
import { WORKERTYPES } from "@/constants";
import WorkInformation from "@/components/commons/WorkInformation";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import ButtonContainer from "./buttons";
import { t } from "@/utils/translationHelper";
import Button from "@/components/inputs/Button";
import UserReviews from "@/components/commons/UserReviews";
import USER from "@/app/api/user";
import ServiceInformation from "@/components/commons/ServiceInformation";
import ProfilePicture from "@/components/commons/ProfilePicture";
import WorkHistory from "@/components/commons/WorkHistory";
import TeamDetails from "../team/teamDetails";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const User = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const { id } = useLocalSearchParams();
  const [user, setUser]: any = useState({});
  const router = useRouter();
  const firstTimeRef = React.useRef(true);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [isUserBooked, setIsUserBooked] = useState(user?.bookedBy || false);
  const [isUserLiked, setIsUserLiked] = useState(
    user?.likedBy?.includes(userDetails?._id)
  );
  const [isUserRequestedToJoinTeam, setIsUserRequestedToJoinTeam] = useState(
    user?.teamJoiningRequestBy?.includes(userDetails?._id)
  );
  const [isInYourTeam, setIsInYourTeam] = useState(
    user?.employedBy?._id === userDetails?._id
  );
  const [isWorkerBookingRequested, setIsWorkerBookingRequested] = useState(
    user?.bookingRequestBy?.includes(userDetails?._id)
  );
  const [isWorkerBooked, setIsWorkerBooked] = useState(
    user?.bookedBy?.find((item: any) => item?.employer === userDetails?._id) ||
      false
  );
  const reviewsSectionRef = useRef<View>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [reviewsPosition, setReviewsPosition] = useState(0);

  const { role, title } = useGlobalSearchParams();

  const {
    isLoading,
    isError,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userDetails", id],
    queryFn: async () => await USER?.getUserDetails(id),
    retry: false,
    enabled: !!id,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    setIsUserLiked(user?.likedBy?.includes(userDetails?._id));
    setIsUserBooked(user?.bookedBy?.includes(userDetails?._id));
    setIsUserRequestedToJoinTeam(
      user?.teamJoiningRequestBy?.includes(userDetails?._id)
    );
    setIsInYourTeam(user?.employedBy?._id === userDetails?._id);
    setIsWorkerBookingRequested(
      user?.bookingRequestBy?.includes(userDetails?._id)
    );
    setIsWorkerBooked(
      user?.bookedBy?.find(
        (item: any) => item?.employer === userDetails?._id
      ) || false
    );
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      setUser(response?.data);
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
          contentContainerStyle={{
            paddingBottom: 150,
            backgroundColor: Colors?.fourth,
          }}
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
            <CustomHeading textAlign="left" baseFont={20}>
              {user?.name}
            </CustomHeading>

            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={Colors.primary}
              />
              <CustomText textAlign="left">
                {user?.address || t("addressNotFound")}
              </CustomText>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={[styles?.highlightBox]}>
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
                    <CustomHeading baseFont={14} textAlign="left">
                      {user?.rating?.average || 0}
                    </CustomHeading>
                  </View>
                  <Button
                    isPrimary={true}
                    title={hasUserReviewed ? t("viewReview") : t("addReview")}
                    onPress={handleReviewAction}
                    style={{
                      minHeight: 30,
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

            {user?.employedBy && (
              <TeamDetails
                type={user?.role}
                mediator={user}
                isInYourTeam={isInYourTeam}
              />
            )}

            <CustomText>{user?.description}</CustomText>

            <SkillSelector
              canAddSkills={false}
              isShowLabel={true}
              style={styles?.skillsContainer}
              tagTextStyle={styles?.skillTagText}
              userSkills={user?.skills}
              availableSkills={WORKERTYPES}
            />

            <UserInfoComponent user={user} style={{ marginHorizontal: 0, marginTop: 4 }} />

            <ServiceInformation information={user?.serviceDetails} />
            <WorkInformation information={user?.workDetails} />

            <WorkHistory workHistory={user?.workHistory} />

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
        isLoading={isLoading}
        user={user}
        refetch={refetch}
        isUserBooked={isUserBooked}
        isUserLiked={isUserLiked}
        isUserRequestedToJoinTeam={isUserRequestedToJoinTeam}
        isInYourTeam={isInYourTeam}
        isWorkerBookingRequested={isWorkerBookingRequested}
        isWorkerBooked={isWorkerBooked}
      />
    </>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
    backgroundColor: Colors.primary,
  },
  contentWrapper: {
    padding: 20,
    backgroundColor: Colors.fourth,
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
    backgroundColor: Colors?.background,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.tertiery,
  },
});

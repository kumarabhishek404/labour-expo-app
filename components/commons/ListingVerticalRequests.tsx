import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import { getTimeAgo } from "@/constants/functions";
import CustomHeading from "./CustomHeading";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";
import { MEDIATORTYPES, WORKERTYPES } from "@/constants";
import CustomText from "./CustomText";
import Button from "../inputs/Button";

type Props = {
  listings: any[];
  category: string;
  loadMore: any;
  isFetchingNextPage: boolean;
  onCancelRequest?: any;
  onAcceptRequest?: any;
  onRejectRequest?: any;
};

type RenderItemTypes = {
  item: {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    receiver: {
      _id: string;
      firstName: string;
      lastName: string;
      coverImage: string;
      profilePicture: string;
      email: string;
      location: any;
      skills: string[];
      rating: string;
      reviews: string;
      price: string;
    };
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
      coverImage: string;
      profilePicture: string;
      email: string;
      location: any;
      skills: string[];
      rating: string;
      reviews: string;
      price: string;
      address: string;
    };
  };
};

const ListingVerticalRequests = ({
  listings,
  category,
  loadMore,
  isFetchingNextPage,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
}: Props) => {
  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => {
    const sender = item?.sender;

    console.log("sender--", sender);

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: `/screens/users/${sender?._id}`,
            params: { role: "workers", title: "Workers", type: "all" },
          })
        }
        style={styles.card}
      >
        <View style={styles.requestContainer}>
          <Image
            source={
              sender?.coverImage || sender?.profilePicture
                ? { uri: sender?.coverImage || sender?.profilePicture }
                : coverImage
            }
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <CustomHeading textAlign="left">
              {sender?.firstName} {sender?.lastName}
            </CustomHeading>
            <RatingAndReviews
              rating={sender?.rating || 4.5}
              reviews={sender?.reviews || 400}
            />
            <SkillSelector
              canAddSkills={false}
              isShowLabel={false}
              style={styles?.skillsContainer}
              tagStyle={styles?.skillTag}
              tagTextStyle={styles?.skillTagText}
              userSkills={sender?.skills}
              availableSkills={MEDIATORTYPES}
              count={2}
            />
            <CustomText textAlign="left">{sender?.address}</CustomText>
          </View>
          <View style={styles.etaContainer}>
            <CustomText>{getTimeAgo(item?.createdAt)}</CustomText>
          </View>
        </View>

        <View
          style={
            category === "sentRequests"
              ? styles.actionContainer
              : styles?.sentActionContainer
          }
        >
          {category === "sentRequests" && (
            <Button
              isPrimary={false}
              title="Cancel"
              onPress={() => onCancelRequest(item?._id)}
            />
          )}
          {category === "recievedRequests" && (
            <>
              <Button
                isPrimary={false}
                title="Reject"
                onPress={() => onRejectRequest(item?._id)}
              />
              <Button
                isPrimary={true}
                title="Accept"
                onPress={() => onAcceptRequest(item?._id)}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: RenderItemTypes) => <RenderItem item={item} />;

  return (
    <View style={{ marginBottom: 30 }}>
      <FlatList
        data={listings ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={debounce(loadMore, 300)} // Trigger load more when user scrolls to bottom
        onEndReachedThreshold={0.9}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator
              size="large"
              color={Colors?.primary}
              style={styles.loaderStyle}
            />
          ) : null
        }
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 110 }}
      />
    </View>
  );
};

export default ListingVerticalRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "relative",
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  requestContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  skillsContainer: {
    paddingVertical: 0,
  },
  skillTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  skillTagText: {
    fontSize: 12,
    color: Colors.primary,
  },
  etaContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  sentActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

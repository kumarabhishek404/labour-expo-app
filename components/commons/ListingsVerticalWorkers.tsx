import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useRef } from "react";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";
import CustomHeading from "./CustomHeading";
import ShowDistance from "./ShowDistance";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import ShowAddress from "./ShowAddress";

const ListingsVerticalWorkers = ({
  availableInterest,
  listings,
  loadMore,
  isFetchingNextPage,
  refreshControl,
  type,
}: any) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const onEndReachedCalledDuringMomentum = useRef(false);

  const RenderItem = React.memo(
    ({ item, type, userDetails, availableInterest }: any) => {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screens/users/[id]",
                params: {
                  id: item?._id,
                  role: type,
                  title: "workerDetails",
                },
              })
            }
          >
            <View style={styles.item}>
              <Image
                source={
                  item?.profilePicture
                    ? { uri: item.profilePicture }
                    : coverImage
                }
                style={styles.avatar}
              />

              <View style={styles.cardContent}>
                <CustomHeading textAlign="left">{item?.name}</CustomHeading>

                <ShowAddress address={item?.address} numberOfLines={1} />

                <SkillSelector
                  canAddSkills={false}
                  isShowLabel={false}
                  style={styles.skillsContainer}
                  tagStyle={styles.skillTag}
                  tagTextStyle={styles.skillTagText}
                  userSkills={item?.skills}
                  availableSkills={availableInterest}
                  count={3}
                />

                <View style={styles.bottomRow}>
                  <RatingAndReviews
                    rating={item?.rating?.average}
                    reviews={item?.rating?.count}
                  />

                  <ShowDistance
                    address={item?.address}
                    loggedInUserLocation={userDetails?.geoLocation}
                    targetLocation={item?.geoLocation}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
  );

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: any) => (
    <RenderItem
      item={item}
      type={type}
      userDetails={userDetails}
      availableInterest={availableInterest}
    />
  );

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      loadMore();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };

  const handleMomentum = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };

  return (
    <View>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={handleMomentum}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="large" color={Colors?.primary} />
          ) : null
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        refreshControl={refreshControl}
      />
    </View>
  );
};

export default ListingsVerticalWorkers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 100,
    minHeight: 100,
    maxHeight: 230,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  placeholderImage: {
    backgroundColor: "#f2f2f2",
  },
  liked: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 20,
  },
  itemInfo: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },

  item: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  avatar: {
    width: 60,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },

  cardContent: {
    flex: 1,
  },

  skillsContainer: {
    marginTop: 6,
    flexDirection: "row",
  },

  skillTag: {
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },

  skillTagText: {
    fontSize: 11,
    color: Colors.tertiery,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

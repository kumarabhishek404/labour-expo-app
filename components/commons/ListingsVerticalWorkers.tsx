import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo } from "react";
import Colors from "@/constants/Colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, router, useGlobalSearchParams } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
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

  const RenderItem = React.memo(({ item }: any) => {
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
                  ? { uri: item?.profilePicture }
                  : coverImage
              }
              style={styles.image}
            />
            {item && item?.isBookmarked && (
              <View style={styles.liked}>
                <Ionicons name="heart" size={16} color={Colors.white} />
              </View>
            )}

            <View style={styles.itemInfo}>
              <CustomHeading textAlign="left">{item?.name}</CustomHeading>
              <SkillSelector
                canAddSkills={false}
                isShowLabel={false}
                style={styles?.skillsContainer}
                tagStyle={styles?.skillTag}
                tagTextStyle={styles?.skillTagText}
                userSkills={item?.skills}
                availableSkills={availableInterest}
                count={2}
              />

              <ShowAddress address={item?.address} numberOfLines={1} />
              <View style={styles.ratingPriceContainer}>
                <RatingAndReviews
                  rating={item?.rating?.average}
                  reviews={item?.rating?.count}
                />
                <ShowDistance
                  loggedInUserLocation={userDetails?.location}
                  targetLocation={item?.location}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: any) => <RenderItem item={item} />;

  const debouncedLoadMore = useMemo(() => debounce(loadMore, 300), [loadMore]);

  return (
    <View>
      <FlatList
        data={listings ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={debouncedLoadMore}
        onEndReachedThreshold={0.2}
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
          length: 100,
          offset: 100 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 160, marginBottom: 100 }}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListingsVerticalWorkers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: Colors.white,
    // padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "relative",
    marginBottom: 20,
  },
  image: {
    width: 100,
    minHeight: 100,
    // maxHeight: 150,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
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
  skillsContainer: {
    marginTop: 5,
  },
  skillTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 0,
  },
  skillTagText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.tertiery,
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
});

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
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, router, useGlobalSearchParams } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

const ListingsVerticalWorkers = ({
  availableInterest,
  listings,
  loadMore,
  isFetchingNextPage,
  refreshControl,
  type,
}: any) => {
  const RenderItem = React.memo(({ item }: any) => {
    console.log("role", type);
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/screens/users/[id]",
              params: {
                id: item?._id,
                role: type,
                title: `${t(type)} ${t("details")}`,
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
              <View>
                <SkillSelector
                  canAddSkills={false}
                  isShowLabel={false}
                  style={styles?.skillsContainer}
                  tagStyle={styles?.skillTag}
                  userSkills={item?.skills}
                  availableSkills={availableInterest}
                  count={5}
                />

                <CustomHeading textAlign="left">
                  {item?.firstName} {item?.middleName} {item?.lastName}
                </CustomHeading>

                <CustomText textAlign="left">{item?.address}</CustomText>
              </View>
              <View style={styles.ratingPriceContainer}>
                <RatingAndReviews
                  rating={item?.rating?.average}
                  reviews={item?.rating?.count}
                />
                <View style={styles.priceContainer}>
                  <CustomHeading>
                    <FontAwesome name="rupee" size={14} />{" "}
                    {item?.price || "350"}/Day
                  </CustomHeading>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: any) => <RenderItem item={item} />;

  return (
    <View style={{ marginBottom: 110 }}>
      <FlatList
        data={listings ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={debounce(loadMore, 300)}
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
          length: 100,
          offset: 100 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 110 }}
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
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "relative",
    marginBottom: 10,
  },
  image: {
    width: 80,
    minHeight: 100,
    maxHeight: 150,
    borderRadius: 8,
    marginRight: 15,
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
    flexDirection: "column",
    justifyContent: "space-between",
  },
  skillsContainer: {
    paddingVertical: 0,
  },
  skillTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 0,
    marginBottom: 5,
  },
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

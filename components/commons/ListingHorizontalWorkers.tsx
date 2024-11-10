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
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

type Props = {
  availableInterest: any;
  listings: any[];
  category: string;
  isFetchingNextPage: boolean;
  loadMore: any;
};

type RenderItemTypes = {
  item: {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    coverImage: string;
    address: string;
    profilePicture: string;
    skills: string[];
    rating: number;
    reviews: number;
    price: string;
    isBookmarked: boolean;
  };
};

const ListingHorizontalWorkers = ({
  availableInterest,
  listings,
  category,
  loadMore,
  isFetchingNextPage,
}: Props) => {
  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => {
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: `/screens/users/${item?._id}`,
            params: {
              role: "workers",
              title: t("workerDetails"),
              type: "details",
            },
          })
        }
      >
        <View style={styles.item}>
          <Image
            source={
              item?.profilePicture ? { uri: item?.profilePicture } : coverImage
            }
            style={styles.image}
          />
          {item?.isBookmarked && (
            <View style={styles.bookmark}>
              <Ionicons name="heart" size={30} color={Colors.white} />
            </View>
          )}

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

          <CustomHeading textAlign="left">
            {item?.firstName} {item?.middleName} {item?.lastName}
          </CustomHeading>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <FontAwesome5
                name="map-marker-alt"
                size={12}
                color={Colors.primary}
              />
              <CustomText>{item?.address || t("addressNotFound")}</CustomText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <RatingAndReviews
                rating={item?.rating || 4.5}
                reviews={item?.reviews || 400}
              />
              <View style={styles.priceContainer}>
                <CustomHeading>
                  <FontAwesome name="rupee" size={14} /> {item?.price}/
                  {t("perDay")}
                </CustomHeading>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const renderItem = ({ item }: RenderItemTypes) => <RenderItem item={item} />;

  return (
    <View>
      <FlatList
        data={listings ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={debounce(loadMore, 300)} // Trigger load more when user scrolls to bottom
        onEndReachedThreshold={0.9}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator
              size="large"
              color={Colors?.primary}
              style={styles.loaderStyle}
            />
          ) : null
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
      />
    </View>
  );
};

export default ListingHorizontalWorkers;

const styles = StyleSheet.create({
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginRight: 20,
    width: 220,
    height: "auto",
    maxHeight: "auto",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  bookmark: {
    position: "absolute",
    top: 185,
    right: 30,
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
  },
  itemAddressTxt: {
    fontSize: 12,
    marginLeft: 5,
  },
  loaderStyle: {
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingBottom: 10,
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
  priceContainer: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
});
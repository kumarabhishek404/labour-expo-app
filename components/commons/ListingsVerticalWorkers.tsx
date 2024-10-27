import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import { getWorkLabel } from "@/constants/functions";
import { MEDIATORTYPES } from "@/constants";

type Props = {
  type: String;
  listings: any[];
  loadMore: any;
  isFetchingNextPage: boolean;
  refreshControl: any;
};

type RenderItemTypes = {
  item: {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    coverImage: string;
    location: any;
    address: string;
    profilePicture: string;
    skills: string[];
    role: string;
    isActive: boolean;
    isBookmarked: boolean;
    rating: string;
    reviews: string;
    price: string;
  };
};

const ListingsVerticalWorkers = ({
  type,
  listings,
  loadMore,
  isFetchingNextPage,
  refreshControl,
}: Props) => {
  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => {
    return (
      <View style={styles.container}>
        <Link href={`/screens/${type}/${item?._id}`} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image
                source={
                  item?.coverImage || item?.profilePicture
                    ? { uri: item?.coverImage || item?.profilePicture }
                    : coverImage
                }
                style={styles.image}
              />
              {item && item?.isBookmarked && (
                <View style={styles.liked}>
                  <Ionicons
                    name="heart-outline"
                    size={16}
                    color={Colors.white}
                  />
                  <Text style={styles.likedText}>Liked</Text>
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item?.firstName} {item?.middleName} {item?.lastName}
                </Text>
                <View style={styles.locationBox}>
                  <Text style={styles.itemLabel}>Skills</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {item?.skills &&
                      item?.skills?.length > 0 &&
                      item?.skills?.map((skill: any, index: number) => (
                        <Text key={skill} style={styles.itemValue}>
                          {getWorkLabel(MEDIATORTYPES, skill)}
                          {item?.skills?.length - index > 1 && ", "}
                        </Text>
                      ))}
                  </View>
                </View>
                <View style={styles.locationBox}>
                  <Text style={styles.itemLabel}>Address</Text>
                  <Text style={styles.itemValue}>{item?.address}</Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Text style={styles.itemLabel}>Rating</Text>
                  <Text style={styles.itemValue}>{item?.rating || "4.3"}</Text>
                  <Text style={styles.itemReviews}>
                    ({item?.reviews || "400"})
                  </Text>
                </View>

                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Text style={styles.itemLabel}>Price</Text>
                  <Text style={styles.itemValue}>
                    <FontAwesome name="rupee" size={14} />{" "}
                    {item?.price || "350"}/Day
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    );
  });

  const renderItem = ({ item }: RenderItemTypes) => <RenderItem item={item} />;

  return (
    <View style={{ marginBottom: 110 }}>
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
        refreshControl={refreshControl}
      />
    </View>
  );
};

export default ListingsVerticalWorkers;

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
  itemInfo: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
    paddingLeft: 10,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "700",
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fa6400",
    marginRight: 5,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "30%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  liked: {
    position: "absolute",
    top: 140,
    left: 55,
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  locationBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemLocationTxt: {
    fontSize: 12,
  },
  itemPriceTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  itemRating: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginLeft: 5,
  },
  itemReviews: {
    fontSize: 14,
    color: "#999",
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
});

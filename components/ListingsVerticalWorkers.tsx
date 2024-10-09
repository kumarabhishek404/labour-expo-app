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
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import coverImage from "../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";

type Props = {
  listings: any[];
  category: string;
  loadMore: any;
  isFetchingNextPage: boolean;
};

type RenderItemTypes = {
  item: {
    _id: string;
    firstName: string;
    lastName: string;
    coverImage: string;
    location: any;
    avatar: string;
    skills: string[];
    rating: string;
    reviews: string;
    price: string;
  };
};

const ListingsVerticalWorkers = ({
  listings,
  category,
  loadMore,
  isFetchingNextPage,
}: Props) => {
  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => {
    return (
      <View style={styles.container}>
        <Link href={`/screens/worker/${item?._id}`} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image
                source={
                  item?.coverImage || item?.avatar
                    ? { uri: item?.coverImage || item?.avatar }
                    : coverImage
                }
                style={styles.image}
              />
              <View style={styles.bookmark}>
                <Ionicons name="heart-outline" size={20} color={Colors.white} />
              </View>
              <View style={styles.itemInfo}>
                <Text
                  style={styles.itemTxt}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item?.firstName} {item?.lastName}
                </Text>
                <View style={styles.locationBox}>
                  <FontAwesome5
                    name="hammer"
                    size={18}
                    color={Colors.primary}
                  />
                  <Text style={styles.itemLocationTxt}>{item?.skills}</Text>
                </View>
                <View style={styles.locationBox}>
                  <FontAwesome5
                    name="map-marker-alt"
                    size={18}
                    color={Colors.primary}
                  />
                  <Text style={styles.itemLocationTxt}>
                    {item?.location?.latitude}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="star" size={20} color={Colors.primary} />
                  <Text style={styles.itemRating}>{item?.rating}</Text>
                  <Text style={styles.itemReviews}>({item?.reviews})</Text>
                </View>
                <View>
                  <Text style={styles.itemPriceTxt}>${item?.price}/Day</Text>
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
    <View style={{ marginBottom: 90 }}>
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

export default ListingsVerticalWorkers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "relative",
  },
  itemInfo: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    paddingLeft: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  bookmark: {
    position: "absolute",
    top: 140,
    left: 130,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.white,
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
    gap: 10,
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
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingBottom: 10,
  },
});

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
import { WorkerType } from "@/types/type";
import { debounce } from "lodash";

type Props = {
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
    location: any;
    avatar: string;
    skills: string[];
    rating: string;
    reviews: string;
    price: string;
    isBookmarked: boolean;
  };
};

const ListingHorizontalWorkers = ({
  listings,
  category,
  loadMore,
  isFetchingNextPage,
}: Props) => {
  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => {
    return (
      <Link href={`/screens/worker/${item?._id}`} asChild>
        <TouchableOpacity>
          <View style={styles.item}>
            {/* <Image source={{ uri: item?.coverImage }} style={styles.image} /> */}
            <Image
              source={item?.avatar ? { uri: item?.avatar } : coverImage}
              style={styles.image}
            />
            {item?.isBookmarked && (
              <View style={styles.bookmark}>
                <Ionicons name="heart" size={30} color={Colors.white} />
              </View>
            )}
            <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">
              {item?.firstName} {item?.middleName} {item?.lastName}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={18}
                  color={Colors.primary}
                />
                <Text style={styles.itemLocationTxt}>{item?.location}</Text>
              </View>
              <Text style={styles.itemPriceTxt}>${item?.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
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
    borderRadius: 10,
    marginRight: 20,
    width: 220,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
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
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
  },
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  loaderStyle: {
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingBottom: 10,
  },
});

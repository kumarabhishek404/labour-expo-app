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
import { ServiceType } from "@/types/type";
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
    coverImage: string;
    name: string;
    location: any;
    price: string;
    address: string;
  };
  index: number
};

const ListingHorizontalServices = ({
  listings,
  category,
  isFetchingNextPage,
  loadMore,
}: Props) => {
  const RenderItem: any = React.memo(({ item, index }: RenderItemTypes) => {
    const isLastItem = index === listings.length - 1;
    
    return (
      <Link href={`/screens/service/${item?._id}`} asChild>
        <TouchableOpacity>
          <View style={[styles.item, isLastItem && styles.lastElement]}>
            {/* <Image source={{ uri: item?.coverImage }} style={styles.image} /> */}
            <Image
              source={item?.coverImage ? { uri: item?.coverImage } : coverImage}
              style={styles.image}
            />
            <View style={styles.bookmark}>
              <Ionicons
                name="bookmark-outline"
                size={20}
                color={Colors.white}
              />
            </View>
            <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">
              {item?.name}
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
                <Text style={styles.itemLocationTxt}>
                  {item?.address}
                </Text>
              </View>
              <Text style={styles.itemPriceTxt}>${item?.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  });

  const renderItem = ({ item, index }: RenderItemTypes) => <RenderItem item={item} index={index} />;

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
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" style={styles.loaderStyle} color={Colors?.primary} />
            </View>
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

export default ListingHorizontalServices;

const styles = StyleSheet.create({
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginRight: 20,
    width: 220,
  },
  lastElement: {
    marginRight: 0,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 30,
  },
  bookmark: {
    position: "absolute",
    top: 185,
    right: 30,
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
    marginBottom: 10,
  },
  itemLocationTxt: {
    width: "70%",
    fontSize: 12,
    marginLeft: 5,
  },
  itemPriceTxt: {
    width: "20%",
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  loaderStyle: {
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  footerLoader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    // height: 250, // Adjust to match the size of your list items
  },
});

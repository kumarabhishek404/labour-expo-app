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
import React, {
  MemoExoticComponent,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import debounce from "lodash/debounce";
import Colors from "@/constants/Colors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import coverImage from "../assets/images/placeholder-cover.jpg";
import { ServiceType } from "@/types/type";

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
  };
};

const ListingsVerticalServices = ({
  listings,
  category,
  loadMore,
  isFetchingNextPage,
}: Props) => {
  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => {
    return (
      <View style={styles.container}>
        <Link href={`/screens/service/${item._id}`} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image
                source={
                  item?.coverImage ? { uri: item?.coverImage } : coverImage
                }
                style={styles.image}
              />
              <View style={styles.bookmark}>
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color={Colors.white}
                />
              </View>
              <Text
                style={styles.itemTxt}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5
                    name="map-marker-alt"
                    size={18}
                    color={Colors.primary}
                  />
                  <Text style={styles.itemLocationTxt}>
                    {item.location?.latitude}
                  </Text>
                </View>
                <Text style={styles.itemPriceTxt}>${item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
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
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 180 }}
      />
    </View>
  );
};

export default ListingsVerticalServices;

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
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
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

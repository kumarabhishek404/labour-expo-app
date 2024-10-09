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
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import coverImage from "../assets/images/placeholder-cover.jpg";
import { ServiceType } from "@/types/type";
import { dateDifference } from "@/constants/functions";
import { AddServiceAtom } from "@/app/AtomStore/user";
import { useSetAtom } from "jotai";

type Props = {
  listings: any[];
  category: string;
  isFetchingNextPage: boolean;
  isMyService?: boolean;
  loadMore: () => void;
  onDelete?: any;
};

type RenderItemTypes = {
  item: {
    _id: string;
    coverImage: string;
    duration: string;
    name: string;
    location: any;
    price: string;
    address: string;
    startDate: Date;
    endDate: Date;
  };
};

const ListingsVerticalServices = ({
  listings,
  category,
  isFetchingNextPage,
  isMyService,
  loadMore,
  onDelete,
}: Props) => {
  const setAddService = useSetAtom(AddServiceAtom);

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
                <View
                  style={{
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  <View
                    style={{
                      width: "80%",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome5
                      name="map-marker-alt"
                      size={18}
                      color={Colors.primary}
                    />
                    <Text style={styles.itemLocationTxt}>{item?.address}</Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Entypo name="calendar" size={18} color={Colors.primary} />
                    <Text style={styles.itemLocationTxt}>12 July, 2024</Text>
                  </View>
                </View>

                <View style={styles?.actionContainer}>
                  <Text style={styles.itemPriceTxt}>
                    {item?.duration ||
                      dateDifference(item?.startDate, item?.endDate)}
                  </Text>
                  {isMyService ? (
                    <></>
                    // <TouchableOpacity
                    //   onPress={() => {
                    //     let URL = `/screens/service/${[item._id]}`
                    //     router?.push({
                    //       pathname: JSON?.stringify(URL),
                    //     });
                    //     // setAddService(item);
                    //   }}
                    //   style={styles?.deleteButton}
                    // >
                    //   <Text style={styles?.deleteText}>Edit</Text>
                    // </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles?.deleteButton}>
                      <Text style={styles?.deleteText}>Apply</Text>
                    </TouchableOpacity>
                  )}
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
  actionContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: Colors?.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 10,
  },
  deleteText: {
    color: Colors?.white,
    textAlign: "center",
    fontWeight: "600",
  },
});

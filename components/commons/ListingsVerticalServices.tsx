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
import React from "react";
import debounce from "lodash/debounce";
import Colors from "@/constants/Colors";
import { Entypo, FontAwesome5, Fontisto, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { ServiceType } from "@/types/type";
import { dateDifference, getTimeAgo } from "@/constants/functions";
import { AddServiceAtom, UserAtom } from "@/app/AtomStore/user";
import { useAtomValue, useSetAtom } from "jotai";
import moment from "moment";
import ImageSlider from "./ImageSlider";

type Props = {
  listings: any[];
  category: string;
  isFetchingNextPage: boolean;
  isMyService?: boolean;
  loadMore: () => void;
  onDelete?: any;
  refreshControl: any;
};

type RenderItemTypes = {
  item: {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    coverImage: string;
    images: Array<String>;
    duration: string;
    name: string;
    location: any;
    price: string;
    address: string;
    startDate: Date;
    endDate: Date;
    appliedBy: Array<string>;
    selected: Array<string>;
  };
};

const ListingsVerticalServices = ({
  listings,
  category,
  isFetchingNextPage,
  isMyService,
  loadMore,
  onDelete,
  refreshControl
}: Props) => {
  const userDetails = useAtomValue(UserAtom);

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
              {item?.selected?.includes(userDetails?._id) && (
                <View
                  style={[
                    styles.applicants,
                    { backgroundColor: Colors?.tertiery },
                  ]}
                >
                  <Ionicons name="happy" size={20} color={Colors.white} />
                  <Text style={styles?.applicantsLabel}>Selected</Text>
                </View>
              )}

              {item?.appliedBy &&
                item?.appliedBy?.length > 0 &&
                !item?.appliedBy?.includes(userDetails?._id) && (
                  <View style={styles.applicants}>
                    <Fontisto name="persons" size={18} color={Colors.white} />
                    <Text style={styles?.applicantsValue}>
                      {item?.appliedBy?.length}
                    </Text>
                    <Text style={styles?.applicantsLabel}>Proposals</Text>
                  </View>
                )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "70%", flexDirection: "column" }}>
                  <Text style={styles.itemTxt}>{item.name}</Text>
                </View>
                <Text style={styles.itemPriceTxt}>
                  {item?.duration ||
                    getTimeAgo(item?.createdAt || "2024-10-13")}
                </Text>
              </View>
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
                    <Text style={styles.itemLocationTxt}>
                      {moment(item?.startDate, "YYYY-MM-DD")?.format(
                        "Do MMMM YYYY"
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles?.actionContainer}>
                  <Text style={styles.itemPriceTxt}>
                    {item?.duration ||
                      dateDifference(item?.startDate, item?.endDate)}
                  </Text>

                  <Text style={styles.itemDistanceAway}>Just 2 Kms</Text>
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
    <View style={{ marginBottom: 30 }}>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item, index) => index?.toString()}
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
        windowSize={15}
        removeClippedSubviews={false}
        contentContainerStyle={{ paddingBottom: 180 }}
        refreshControl={refreshControl}
      />
    </View>
  );
};

export default ListingsVerticalServices;

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
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 30,
  },
  applicants: {
    position: "absolute",
    top: 185,
    right: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  applicantsLabel: {
    color: Colors?.white,
    fontSize: 16,
    fontWeight: "600",
  },
  applicantsValue: {
    color: Colors?.white,
    fontSize: 20,
    fontWeight: "600",
  },
  itemTxt: {
    width: "100%",
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    // marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 100,
    padding: 2,
    // marginVertical: 10,
    borderRadius: 30,
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "#d6ecdd",
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
  itemDistanceAway: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  actionContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  deleteButton: {
    backgroundColor: Colors?.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteText: {
    color: Colors?.white,
    textAlign: "center",
    fontWeight: "600",
  },
});

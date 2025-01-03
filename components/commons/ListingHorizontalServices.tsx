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
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import Requirements from "./Requirements";
import { dateDifference, getTimeAgo } from "@/constants/functions";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

type Props = {
  listings: any[];
  category: string;
  isFetchingNextPage: boolean;
  loadMore: any;
};

type RenderItemTypes = {
  item: {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    coverImage: string;
    images: Array<string>;
    duration: string;
    type: string;
    subType: string;
    location: any;
    price: string;
    address: string;
    startDate: Date;
    endDate: Date;
    appliedBy: Array<string>;
    selected: Array<string>;
    requirements: any;
  };
  index: number;
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
      <Link key={index} href={`/screens/service/${item?._id}`} asChild>
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

            <Requirements type="highlights" requirements={item?.requirements} />

            <CustomHeading textAlign="left">
              {t(item?.type)} - {t(item?.subType)}
            </CustomHeading>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 5,
              }}
            >
              <View
                style={{
                  width: "60%",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 5,
                }}
              >
                <FontAwesome5
                  name="map-marker-alt"
                  size={14}
                  color={Colors.primary}
                />
                <CustomText textAlign="left">{item?.address}</CustomText>
              </View>
              <View
                style={{
                  width: "40%",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <CustomText>
                  {item?.duration || getTimeAgo(item?.createdAt)}
                </CustomText>
                <CustomText>
                  {item?.duration ||
                    dateDifference(item?.startDate, item?.endDate)}
                </CustomText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item, index }: RenderItemTypes) => (
    <RenderItem item={item} index={index} />
  );

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
              <ActivityIndicator
                size="large"
                style={styles.loaderStyle}
                color={Colors?.primary}
              />
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
    width: 250,
  },
  lastElement: {
    marginRight: 0,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  bookmark: {
    position: "absolute",
    top: 170,
    right: 0,
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
    // width: "70%",
    fontSize: 12,
    marginLeft: 5,
  },
  itemPriceTxt: {
    // width: "20%",
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
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    // height: 250, // Adjust to match the size of your list items
  },
});

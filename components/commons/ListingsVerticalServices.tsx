import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
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
import {
  calculateDistance,
  dateDifference,
  getTimeAgo,
} from "@/constants/functions";
import Atoms from "@/app/AtomStore";
import { useAtomValue, useSetAtom } from "jotai";
import moment from "moment";
import ImageSlider from "./ImageSlider";
import Requirements from "./Requirements";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import ListingsServices from "./ListingServices";
import ListingsBookings from "./ListingBookings";

type Props = {
  listings: any[];
  isFetchingNextPage: boolean;
  loadMore: () => void;
  refreshControl: any;
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
    employer: any;
  };
};

const ListingsVerticalServices = ({
  listings,
  isFetchingNextPage,
  loadMore,
  refreshControl,
}: Props) => {
  const RenderItem = React?.memo(({ item }: any) => {
    if (item?.bookingType === "direct") {
      return <ListingsBookings item={item} />;
    }
    return <ListingsServices item={item} />;
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: RenderItemTypes) => <RenderItem item={item} />;

  return (
    <View style={{ marginBottom: 30 }}>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item, index) => index?.toString()}
        onEndReached={debounce(loadMore, 200)}
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
        contentContainerStyle={{ paddingBottom: 230 }}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListingsVerticalServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    position: "relative",
  },
  tag: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: Colors?.tertiery,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopRightRadius: 8,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    // marginBottom: 30,
  },
  applicants: {
    position: "absolute",
    top: 173,
    right: 0,
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
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  itemDistanceAway: {
    // flex: 1,
    // width: 80,
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
    width: "30%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 0,
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

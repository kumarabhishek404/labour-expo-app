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
import coverImage from "../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import { getTimeAgo } from "@/constants/functions";

type Props = {
  listings: any[];
  category: string;
  loadMore: any;
  isFetchingNextPage: boolean;
  onCancelRequest?: any;
  onAcceptRequest?: any;
  onRejectRequest?: any;
};

type RenderItemTypes = {
  item: {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    receiver: {
      _id: string;
      firstName: string;
      lastName: string;
      coverImage: string;
      avatar: string;
      email: String;
      location: any;
      skills: string[];
      rating: string;
      reviews: string;
      price: string;
    };
    sender: {
      _id: String;
      firstName: string;
      lastName: string;
      coverImage: string;
      avatar: string;
      email: String;
      location: any;
      skills: string[];
      rating: string;
      reviews: string;
      price: string;
    };
  };
};

const ListingVerticalRequests = ({
  listings,
  category,
  loadMore,
  isFetchingNextPage,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
}: Props) => {
  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => {
    console.log("Itemss---", item);
    const reciever = item?.receiver;

    return (
      <Link href={`/screens/worker/${reciever?._id}`} asChild>
        <TouchableOpacity style={styles.card}>
          {/* Request Information */}
          <View style={styles.requestContainer}>
            <Image
              source={
                reciever?.coverImage || reciever?.avatar
                  ? { uri: reciever?.coverImage || reciever?.avatar }
                  : coverImage
              }
              style={styles.profileImage}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.userName}>
                {reciever?.firstName} {reciever?.lastName}
              </Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={14} color="gold" />
                <FontAwesome name="star" size={14} color="gold" />
                <FontAwesome name="star" size={14} color="gold" />
                <FontAwesome name="star" size={14} color="gold" />
                <FontAwesome name="star-o" size={14} color="gold" />
              </View>
              <Text style={styles.serviceText}>Skills: AC Repair</Text>
              <Text style={styles.priceText}>Price Per Hour: USD 30</Text>
              <Text style={styles.locationText}>
                PX8X+V4 New York, United States {"\n"}
                #457, 2nd Floor
              </Text>
            </View>
            <View style={styles.etaContainer}>
              {/* <Text style={styles.etaTitle}>ETA</Text> */}
              <Text style={styles.etaTime}>{getTimeAgo(item?.createdAt)}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View
            style={
              category === "sentRequests"
                ? styles.actionContainer
                : styles?.sentActionContainer
            }
          >
            {category === "sentRequests" && (
              <TouchableOpacity
                onPress={() => onCancelRequest(item?._id)}
                style={styles.declineButton}
              >
                <Text style={styles.declineText}>Cancel</Text>
              </TouchableOpacity>
            )}
            {category === "recievedRequests" && (
              <>
                <TouchableOpacity
                  onPress={() => onRejectRequest(item?._id)}
                  style={styles.declineButton}
                >
                  <Text style={styles.declineText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onAcceptRequest(item?._id)}
                  style={styles.acceptButton}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
              </>
            )}
            {/* <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity> */}
          </View>
        </TouchableOpacity>
      </Link>
      //   <View style={styles.container}>
      //     <Link href={`/screens/worker/${reciever?._id}`} asChild>
      //       <TouchableOpacity>
      //         <View style={styles.item}>
      //           <Image
      //             source={
      //               reciever?.coverImage || reciever?.avatar
      //                 ? { uri: reciever?.coverImage || reciever?.avatar }
      //                 : coverImage
      //             }
      //             style={styles.image}
      //           />
      //           <View style={styles.bookmark}>
      //             <Ionicons name="heart-outline" size={20} color={Colors.white} />
      //           </View>
      //           <View style={styles.itemInfo}>
      //             <Text
      //               style={styles.itemTxt}
      //               numberOfLines={1}
      //               ellipsizeMode="tail"
      //             >
      //               {reciever?.firstName} {reciever?.lastName}
      //             </Text>
      //             <View style={styles.locationBox}>
      //               <FontAwesome5
      //                 name="hammer"
      //                 size={18}
      //                 color={Colors.primary}
      //               />
      //               <Text style={styles.itemLocationTxt}>{reciever?.skills}</Text>
      //             </View>
      //             <View style={styles.locationBox}>
      //               <FontAwesome5
      //                 name="map-marker-alt"
      //                 size={18}
      //                 color={Colors.primary}
      //               />
      //               <Text style={styles.itemLocationTxt}>
      //                 {reciever?.location?.latitude}
      //               </Text>
      //             </View>
      //             <View style={{ flexDirection: "row", alignItems: "center" }}>
      //               <Ionicons name="star" size={20} color={Colors.primary} />
      //               <Text style={styles.itemRating}>{reciever?.rating}</Text>
      //               <Text style={styles.itemReviews}>({reciever?.reviews})</Text>
      //             </View>
      //             <View>
      //               <Text style={styles.itemPriceTxt}>
      //                 ${reciever?.price}/Day
      //               </Text>
      //             </View>
      //           </View>
      //         </View>
      //       </TouchableOpacity>
      //     </Link>
      //   </View>
    );
  });

  const renderItem = ({ item }: RenderItemTypes) => <RenderItem item={item} />;

  return (
    <View style={{ marginBottom: 30 }}>
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

export default ListingVerticalRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    paddingLeft: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
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
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },

  //   Request Card
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  requestContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  serviceText: {
    fontSize: 14,
    marginTop: 5,
  },
  priceText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  locationText: {
    fontSize: 13,
    color: "#888",
    marginTop: 5,
  },
  etaContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  etaTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  etaTime: {
    fontSize: 14,
    // color: "#888",
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  sentActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  declineButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  declineText: {
    fontSize: 14,
    color: "#000",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptText: {
    fontSize: 14,
    color: "#FFF",
  },
  counterContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 5,
    marginLeft: 10,
  },
  counterText: {
    fontSize: 12,
    color: "#FF0000",
  },
});

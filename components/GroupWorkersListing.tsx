import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { GroupType } from "@/types/groupType";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import profileImage from "../assets/images/placeholder-person.jpg";
import { Link } from "expo-router";

const GroupWorkersListing = ({ listings, category }: { listings: GroupType[], category: string }) => {
  const userDetails = useAtomValue(UserAtom);
  const renderItem: ListRenderItem<GroupType> = ({ item }) => {
    return (
      <Link href={`/screens/worker/${item?._id}`} asChild>
        <TouchableOpacity>
          <View style={styles.item}>
            <Image
              source={
                item?.profileImage ? { uri: item?.profileImage } : profileImage
              }
              style={styles.image}
            />
            <View>
              <Text style={styles.itemTxt}>
                {item.firstName} {item.lastName}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="star" size={20} color={Colors.primary} />
                <Text style={styles.itemRating}>{item.rating || "4.6"} </Text>
                <Text style={styles.itemReviews}>
                  ({item.reviews || "450"})
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={styles.title}>
        {userDetails?.role === "Labour"
          ? "Top Rated Employers"
          : "Top Rated Workers"}
      </Text>
      <FlatList
        data={listings}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default GroupWorkersListing;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
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
});

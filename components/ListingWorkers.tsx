import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ListingType } from "@/types/listingType";
import Colors from "@/constants/Colors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

type Props = {
  listings: any[];
  category: string;
};

const ListingsWorkers = ({ listings, category }: Props) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Update Listing");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const renderItems: ListRenderItem<ListingType> = ({ item }) => {
    return (
      <View style={styles.container}>
        <Link href={`/worker/${item.id}`} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.bookmark}>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color={Colors.white}
                  />
                </View>
              <View style={styles.itemInfo}>
                <Text
                  style={styles.itemTxt}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <View style={styles.locationBox}>
                  <FontAwesome5
                    name="hammer"
                    size={18}
                    color={Colors.primaryColor}
                  />
                  <Text style={styles.itemLocationTxt}>{item.skills}</Text>
                  </View>
                <View style={styles.locationBox}>
                  <FontAwesome5
                    name="map-marker-alt"
                    size={18}
                    color={Colors.primaryColor}
                  />
                  <Text style={styles.itemLocationTxt}>{item.location}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Ionicons name="star" size={20} color={Colors.primaryColor} />
                    <Text style={styles.itemRating}>{item.rating}</Text>
                    <Text style={styles.itemReviews}>({item.reviews})</Text>
                </View>
                <View>
                  <Text style={styles.itemPriceTxt}>${item.price}/Day</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={loading ? [] : listings}
        renderItem={renderItems}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListingsWorkers;

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
    position:'relative'
  },
  itemInfo: {
    width: '100%',
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
    backgroundColor: Colors.primaryColor,
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
    color: Colors.primaryColor,
  },
  itemRating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 5,
  },
  itemReviews: {
    fontSize: 14,
    color: '#999'
  }
});

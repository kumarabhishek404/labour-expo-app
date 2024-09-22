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
import coverImage from '../assets/images/placeholder-cover.jpg'

type Props = {
  listings: any[];
  category: string;
};

const ListingsVertical = ({ listings, category }: Props) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const renderItems: ListRenderItem<ListingType> = ({ item }) => {
    return (
      <View style={styles.container}>
        <Link href={`/screens/service/${item._id}`} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image source={item?.coverImage ? { uri: item?.coverImage } : coverImage} style={styles.image} />
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
                  <Text style={styles.itemLocationTxt}>{item.location}</Text>
                </View>
                <Text style={styles.itemPriceTxt}>${item.price}</Text>
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

export default ListingsVertical;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    width: '100%',
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
});

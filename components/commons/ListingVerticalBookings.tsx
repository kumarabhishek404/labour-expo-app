import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import ListingsBookings from "./ListingBookings";
import ListingsBookedWorkers from "./ListingBookedWorkers";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { debounce } from "lodash";
import Colors from "@/constants/Colors";
import OnPageLoader from "./Loaders/OnPageLoader";

const ListingsVerticalBookings = ({
  listings,
  category,
  isLoading,
  loadMore,
  isFetchingNextPage,
  refreshControl,
}: any) => {
  const RenderItem = ({ item }: any) => {
    if (category === "recievedRequests") {
      return (
        <ListingsBookings
          title="bookingRequestDetails"
          item={item}
          category={category}
        />
      );
    } else if (category === "sentRequests") {
      return (
        <ListingsBookedWorkers
          title="bookingRequestDetails"
          item={item}
          category={category}
        />
      );
    } else {
      return (
        <ListingsBookedWorkers
          title="bookingDetails"
          item={item}
          category={category}
        />
      );
    }
  };

  if (isLoading) {
    return <OnPageLoader />;
  }

  return (
    <View>
      <FlatList
        data={listings ?? []}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={debounce(loadMore, 300)}
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
        contentContainerStyle={{ paddingBottom: 200 }}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderStyle: { alignItems: "center", paddingLeft: 20, paddingBottom: 10 },
});

export default ListingsVerticalBookings;

import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React from "react";
import debounce from "lodash/debounce";
import Colors from "@/constants/Colors";
import ListingsServices from "./ListingServices";

type Props = {
  listings: any[];
  isFetchingNextPage: boolean;
  loadMore: () => void;
  refreshControl: any;
};

const ListingsVerticalServices = ({
  listings,
  isFetchingNextPage,
  loadMore,
  refreshControl,
}: Props) => {
  const RenderItem = ({ item }: any) => <ListingsServices item={item} />;

  return (
    <View>
      <FlatList
        data={listings}
        renderItem={({ item }) => <RenderItem item={item} />}
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

export default ListingsVerticalServices;

const styles = StyleSheet.create({
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
});

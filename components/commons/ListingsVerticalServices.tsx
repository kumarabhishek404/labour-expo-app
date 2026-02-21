import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import debounce from "lodash/debounce";
import Colors from "@/constants/Colors";
import ListingsServices from "./ListingServices";

type Props = {
  listings: any[];
  isFetchingNextPage: boolean;
  loadMore: () => void;
  refreshControl: any;
};

const RenderItem = React.memo(({ item }: any) => {
  return <ListingsServices item={item} />;
});
RenderItem.displayName = "RenderItem";

const ListingsVerticalServices = ({
  listings,
  isFetchingNextPage,
  loadMore,
  refreshControl,
}: Props) => {
  const debouncedLoadMore = useMemo(() => debounce(loadMore, 300), [loadMore]);
  React.useEffect(() => {
    return () => {
      debouncedLoadMore.cancel();
    };
  }, [debouncedLoadMore]);
  return (
    <View>
      <FlatList
        data={listings}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item) => item._id}
        onEndReached={debouncedLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.loaderStyle}
            />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 200 }}
        // 🚀 PERFORMANCE MAGIC
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        updateCellsBatchingPeriod={50}
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

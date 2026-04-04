import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useMemo, type ReactElement } from "react";
import debounce from "lodash/debounce";
import Colors from "@/constants/Colors";
import ListingsServices from "./ListingServices";

type Props = {
  listings: any[];
  isFetchingNextPage: boolean;
  loadMore: () => void;
  refreshControl: any;
  ListHeaderComponent?: ReactElement | null;
};

const RenderItem = React.memo(({ item }: any) => {
  return <ListingsServices item={item} />;
});
RenderItem.displayName = "RenderItem";

/** Space below last item — tab bar / scroll comfort; loader sits above this. */
const LIST_BOTTOM_INSET = 250;

const ListingsVerticalServices = ({
  listings,
  isFetchingNextPage,
  loadMore,
  refreshControl,
  ListHeaderComponent,
}: Props) => {
  const debouncedLoadMore = useMemo(() => debounce(loadMore, 300), [loadMore]);
  React.useEffect(() => {
    return () => {
      debouncedLoadMore.cancel();
    };
  }, [debouncedLoadMore]);
  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.flatList}
        data={listings}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={ListHeaderComponent ?? undefined}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={debouncedLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          <View style={styles.listFooter}>
            {isFetchingNextPage ? (
              <View style={styles.paginationLoader}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : null}
            <View style={styles.listBottomInset} />
          </View>
        }
        contentContainerStyle={styles.listContent}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={false}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListingsVerticalServices;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 0,
  },
  flatList: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  listFooter: {
    width: "100%",
  },
  paginationLoader: {
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  listBottomInset: {
    width: "100%",
    height: LIST_BOTTOM_INSET,
  },
});

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import React, { useRef, type ReactElement } from "react";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";
import CustomHeading from "./CustomHeading";
import ShowDistance from "./ShowDistance";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import ShowAddress from "./ShowAddress";
import UserRoleTag from "./UserRoleTag";

/** Space below last item — tab bar / scroll comfort; loader sits above this. */
const LIST_BOTTOM_INSET = 250;

type ListingsVerticalWorkersProps = {
  availableInterest: any;
  listings: any[];
  loadMore: () => void;
  isFetchingNextPage: boolean;
  refreshControl?: any;
  type: string;
  ListHeaderComponent?: ReactElement | null;
  /** Optional wrapper style (e.g. flexGrow) for embedded screens */
  style?: StyleProp<ViewStyle>;
  /** Passed through from older screens; unused */
  category?: string;
};

const ListingsVerticalWorkers = ({
  availableInterest,
  listings,
  loadMore,
  isFetchingNextPage,
  refreshControl,
  type,
  ListHeaderComponent,
  style,
}: ListingsVerticalWorkersProps) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const onEndReachedCalledDuringMomentum = useRef(false);

  const RenderItem = React.memo(
    ({ item, type, userDetails, availableInterest }: any) => {
      return (
        <View style={styles.rowWrap}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/screens/users/[id]",
                params: {
                  id: item?._id,
                  role: type,
                  title: "workerDetails",
                },
              })
            }
            style={styles.cardTouchable}
          >
            <View style={styles.item}>
              <Image
                source={
                  item?.profilePicture
                    ? { uri: item.profilePicture }
                    : coverImage
                }
                style={styles.avatar}
              />

              <View style={styles.cardContent}>
                <View style={styles.nameRow}>
                <CustomHeading textAlign="left">{item?.name}</CustomHeading>
                  <View style={styles.roleTagLine}>
                    <UserRoleTag user={item} variant="compact" />
                  </View>
                </View>

                <ShowAddress address={item?.address} numberOfLines={1} />

                <SkillSelector
                  canAddSkills={false}
                  isShowLabel={false}
                  style={styles.skillsContainer}
                  tagStyle={styles.skillTag}
                  tagTextStyle={styles.skillTagText}
                  userSkills={item?.skills}
                  availableSkills={availableInterest}
                  count={3}
                />

                <View style={styles.bottomRow}>
                  <RatingAndReviews
                    rating={item?.rating?.average}
                    reviews={item?.rating?.count}
                  />

                  <ShowDistance
                    address={item?.address}
                    loggedInUserLocation={
                      userDetails?.geoLocation ?? userDetails?.location
                    }
                    targetLocation={item?.geoLocation}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
  );

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: any) => (
    <RenderItem
      item={item}
      type={type}
      userDetails={userDetails}
      availableInterest={availableInterest}
    />
  );

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      loadMore();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };

  const handleMomentum = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };

  return (
    <View style={[styles.listRoot, style]}>
      <FlatList
        style={styles.flatList}
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        ListHeaderComponent={ListHeaderComponent ?? undefined}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={handleMomentum}
        ListFooterComponent={
          <View style={styles.listFooter}>
            {isFetchingNextPage ? (
              <View style={styles.paginationLoader}>
                <ActivityIndicator size="large" color={Colors?.primary} />
              </View>
            ) : null}
            <View style={styles.listBottomInset} />
          </View>
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={refreshControl}
      />
    </View>
  );
};

export default ListingsVerticalWorkers;

const styles = StyleSheet.create({
  listRoot: {
    flex: 1,
    minHeight: 0,
  },
  flatList: {
    flex: 1,
  },
  rowWrap: {
    flex: 1,
  },
  cardTouchable: {
    borderRadius: 14,
  },
  item: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 11,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.16)",
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatar: {
    width: 68,
    height: 86,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.18)",
    backgroundColor: Colors.secondaryBackground,
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  roleTagLine: {
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 4,
  },
  skillsContainer: {
    marginTop: 4,
    flexDirection: "row",
  },
  skillTag: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.16)",
  },
  skillTagText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  separator: {
    height: 10,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  listFooter: {
    width: "100%",
  },
  paginationLoader: {
    paddingTop: 8,
    paddingBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  listBottomInset: {
    width: "100%",
    height: LIST_BOTTOM_INSET,
  },
});

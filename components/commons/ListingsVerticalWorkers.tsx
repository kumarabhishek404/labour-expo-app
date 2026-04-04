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
import React, { useMemo, useRef } from "react";
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

/** Space below last item — tab bar / scroll comfort; loader sits above this. */
const LIST_BOTTOM_INSET = 110;

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
        <View style={styles.container}>
          <TouchableOpacity
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
                <CustomHeading textAlign="left">{item?.name}</CustomHeading>

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
                    loggedInUserLocation={userDetails?.geoLocation}
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
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={handleMomentum}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="large" color={Colors?.primary} />
          ) : null
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
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
  container: {
    flex: 1,
  },
  image: {
    width: 100,
    minHeight: 100,
    maxHeight: 230,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  placeholderImage: {
    backgroundColor: "#f2f2f2",
  },
  liked: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    padding: 4,
    borderRadius: 12,
  },
  item: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 11,
    marginBottom: 10,
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
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
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

  item: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  avatar: {
    width: 60,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },

  cardContent: {
    flex: 1,
  },

  skillsContainer: {
    marginTop: 6,
    flexDirection: "row",
  },

  skillTag: {
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },

  skillTagText: {
    fontSize: 11,
    color: Colors.tertiery,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

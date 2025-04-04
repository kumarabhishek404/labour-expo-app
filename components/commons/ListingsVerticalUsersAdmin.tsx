import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import Button from "../inputs/Button";

const ListingsVerticalUsersAdmin = ({
  availableInterest,
  listings,
  role,
  loadMore,
  isFetchingNextPage,
  refreshControl,
  onSuspendUser,
  onActivateUser,
}: any) => {
  const RenderItem = React.memo(({ item }: any) => {

    const getActionButton = (status: string) => {
      let buttonText = "";
      let buttonColor = Colors.primary;
      let backgroundColor = Colors.primary;
      let borderColor = Colors.primary;
      let action: any;

      switch (status) {
        case "ACTIVE":
          buttonText = "Suspend";
          buttonColor = Colors.white;
          backgroundColor = Colors.danger;
          borderColor = Colors.danger;
          action = () => onSuspendUser({ userId: item?._id });
          break;
        case "PENDING":
        case "SUSPENDED":
          buttonText = "Activate";
          buttonColor = Colors.white;
          backgroundColor = Colors.success;
          borderColor = Colors.success;
          action = () => onActivateUser({ userId: item?._id });
          break;
        case "DISABLED":
          buttonText = "Enable";
          buttonColor = Colors.white;
          backgroundColor = Colors.success;
          borderColor = Colors.success;
          action = () => onActivateUser({ userId: item?._id });
          break;
        default:
          return null;
      }

      return (
        <Button
          isPrimary={true}
          title={buttonText}
          bgColor={backgroundColor}
          borderColor={borderColor}
          textColor={buttonColor}
          style={styles.statusButton}
          onPress={action}
        />
      );
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/screens/users/[id]",
              params: {
                id: item?._id,
                role: role,
                title: "userDetails",
                type: "details",
              },
            })
          }
        >
          <View style={styles.item}>
            <Image
              source={
                item?.profilePicture
                  ? { uri: item?.profilePicture }
                  : coverImage
              }
              style={styles.image}
            />

            <View style={styles.itemInfo}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: "65%",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <CustomHeading textAlign="left">{item?.name}</CustomHeading>
                  <RatingAndReviews
                    rating={item?.rating?.average}
                    reviews={item?.rating?.count}
                  />
                  <CustomText textAlign="left">{item?.address}</CustomText>
                </View>
                <View style={styles.actionButtonContainer}>
                  {getActionButton(item?.status)}
                </View>
              </View>
              <View>
                <SkillSelector
                  canAddSkills={false}
                  isShowLabel={false}
                  style={styles?.skillsContainer}
                  tagStyle={styles?.skillTag}
                  userSkills={item?.skills}
                  availableSkills={availableInterest}
                  count={5}
                />
              </View>
              <View style={styles.ratingPriceContainer}>
                <View style={styles.priceContainer}>
                  <CustomHeading>
                    <FontAwesome name="rupee" size={14} />{" "}
                    {item?.price || "350"}/Day
                  </CustomHeading>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: any) => <RenderItem item={item} />;

  return (
    <View style={{ marginBottom: 110 }}>
      <FlatList
        data={listings ?? []}
        renderItem={renderItem}
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
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListingsVerticalUsersAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "relative",
    marginBottom: 10,
  },
  image: {
    width: "22%",
    minHeight: 100,
    maxHeight: 150,
    borderRadius: 8,
    marginRight: 15,
  },
  liked: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 20,
  },
  itemInfo: {
    width: "74%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  skillsContainer: {
    paddingVertical: 0,
  },
  skillTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 0,
    marginBottom: 5,
  },
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 8,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  actionButtonContainer: {
    width: "34%",
    alignItems: "flex-end",
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});

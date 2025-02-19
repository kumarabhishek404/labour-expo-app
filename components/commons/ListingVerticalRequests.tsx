import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { debounce } from "lodash";
import { getTimeAgo } from "@/constants/functions";
import CustomHeading from "./CustomHeading";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";
import { MEDIATORTYPES, WORKERTYPES } from "@/constants";
import CustomText from "./CustomText";
import Button from "../inputs/Button";
import { t } from "@/utils/translationHelper";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import ProfilePicture from "./ProfilePicture";
import OnPageLoader from "./Loaders/OnPageLoader";

const getStatusColor = (status: string): string => {
  const statusColors = {
    pending: "#F59E0B",
    received: "#3B82F6",
    accepted: "#10B981",
    rejected: "#DC2626",
    default: Colors.primary,
  } as const;
  return (
    statusColors[status?.toLowerCase() as keyof typeof statusColors] ||
    statusColors.default
  );
};

const RequestCardAdmin = React.memo(({ item }: any) => {
  const sender = item?.sender;
  const receiver = item?.receiver;
  const status = item?.status;

  return (
    <View style={styles.card}>
      <View style={styles.requestHeader}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(status) },
            ]}
          />
          <CustomText
            style={[styles.requestStatus, { color: getStatusColor(status) }]}
          >
            {status?.toUpperCase()}
          </CustomText>
        </View>
        <CustomText style={styles.timeAgo}>
          {getTimeAgo(item?.createdAt)}
        </CustomText>
      </View>

      <View style={styles.usersContainer}>
        {/* Sender Section - Left Aligned */}
        <View style={[styles.userSection, styles.senderSection]}>
          <View
            style={[styles.userContentContainer, { alignItems: "flex-start" }]}
          >
            <View style={styles.imageContainer}>
              <ProfilePicture
                uri={sender?.profilePicture}
                style={styles.profileImage}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userDetails}>
              <CustomHeading style={styles.leftAlignText}>
                {sender?.name}
              </CustomHeading>
              <CustomText style={[styles.label, styles.leftAlignText]}>
                Sender
              </CustomText>
              <RatingAndReviews
                rating={sender?.rating || 0}
                reviews={sender?.reviews || 0}
                style={styles.leftAlignText}
              />
              <SkillSelector
                canAddSkills={false}
                role={sender?.role}
                isShowLabel={false}
                style={[styles.skillsContainer, styles.leftAlignContainer]}
                tagStyle={styles.skillTag}
                tagTextStyle={styles.skillTagText}
                userSkills={sender?.skills}
                availableSkills={WORKERTYPES}
                count={2}
              />
              <CustomText style={[styles.address, styles.leftAlignText]}>
                {sender?.address}
              </CustomText>
              <CustomText style={styles.leftAlignText}>
                Gender: {sender?.gender || "N/A"}
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <View style={styles.arrowLine} />
          <CustomText style={styles.arrow}>→</CustomText>
        </View>

        {/* Receiver Section - Right Aligned */}
        <View style={[styles.userSection, styles.receiverSection]}>
          <View
            style={[styles.userContentContainer, { alignItems: "flex-end" }]}
          >
            <View style={styles.imageContainer}>
              <ProfilePicture
                uri={receiver?.profilePicture}
                style={styles.profileImage}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userDetails}>
              <CustomHeading style={styles.rightAlignText}>
                {receiver?.name}
              </CustomHeading>
              <CustomText style={[styles.label, styles.rightAlignText]}>
                Receiver
              </CustomText>
              <RatingAndReviews
                rating={receiver?.rating || 0}
                reviews={receiver?.reviews || 0}
                style={styles.rightAlignText}
              />
              <SkillSelector
                canAddSkills={false}
                role={receiver?.role}
                isShowLabel={false}
                style={[styles.skillsContainer, styles.rightAlignContainer]}
                tagStyle={styles.skillTag}
                tagTextStyle={styles.skillTagText}
                userSkills={receiver?.skills}
                availableSkills={MEDIATORTYPES}
                count={2}
              />
              <CustomText style={[styles.address, styles.rightAlignText]}>
                {receiver?.address}
              </CustomText>
              <CustomText style={styles.rightAlignText}>
                Gender: {receiver?.gender || "N/A"}
              </CustomText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

RequestCardAdmin.displayName = "RequestCardAdmin";

const RequestCardUser = React.memo(
  ({
    item,
    userDetails,
    requestType,
    onAcceptRequest,
    onRejectRequest,
    onCancelRequest,
  }: any) => {
    const isSender =
      item?.employer?._id === userDetails?._id ||
      item?.employer === userDetails?._id;
    const isReceiver =
      item?.receiver?._id === userDetails?._id ||
      item?.receiver === userDetails?._id;

    const user = isSender ? item?.receiver : item?.employer;

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.requestContainer}>
          <ProfilePicture
            uri={user?.profilePicture}
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <CustomHeading textAlign="left">{user?.name}</CustomHeading>
            <RatingAndReviews
              rating={user?.rating || 4.5}
              reviews={user?.reviews || 400}
            />
            <SkillSelector
              canAddSkills={false}
              role={user?.role}
              isShowLabel={false}
              style={styles?.skillsContainer}
              tagStyle={styles?.skillTag}
              tagTextStyle={styles?.skillTagText}
              userSkills={user?.skills}
              availableSkills={MEDIATORTYPES}
              count={2}
            />
            <CustomText textAlign="left">{user?.address}</CustomText>
          </View>
          <View style={styles.etaContainer}>
            <CustomText>{getTimeAgo(item?.createdAt)}</CustomText>
          </View>
        </View>

        <View
          style={
            isSender ? styles.actionContainer : styles?.sentActionContainer
          }
        >
          {isSender && (
            <Button
              isPrimary={false}
              title={t("cancel")}
              onPress={() => onCancelRequest?.(item?.receiver?._id)}
              style={{ width: "30%" }}
            />
          )}
          {isReceiver && (
            <>
              <Button
                isPrimary={true}
                title={t("reject")}
                onPress={() => onRejectRequest?.(item?._id)}
                style={styles?.rejectButton}
                bgColor={Colors?.danger}
                borderColor={Colors?.danger}
              />
              <Button
                isPrimary={true}
                title={t("accept")}
                onPress={() => onAcceptRequest?.(item?._id)}
                style={styles?.acceptButton}
                bgColor={Colors?.success}
                borderColor={Colors?.success}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

RequestCardUser.displayName = "RequestCardUser";

const RequestCardTeamJoinng = React.memo(
  ({
    item,
    userDetails,
    requestType,
    onAcceptRequest,
    onRejectRequest,
    onCancelRequest,
  }: any) => {
    const isSender =
      item?.sender?._id === userDetails?._id ||
      item?.sender === userDetails?._id;
    const isReceiver =
      item?.receiver?._id === userDetails?._id ||
      item?.receiver === userDetails?._id;

    const user = isSender ? item?.receiver : item?.sender;

    console.log("user---", item);

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/screens/users/[id]",
            params: {
              id: user?._id,
              role: "workers",
              title: "Workers",
              type: "all",
            },
          })
        }
        style={styles.card}
      >
        <View style={styles.requestContainer}>
          <ProfilePicture
            uri={user?.profilePicture}
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <CustomHeading textAlign="left">{user?.name}</CustomHeading>
            <RatingAndReviews
              rating={user?.rating || 4.5}
              reviews={user?.reviews || 400}
            />
            <SkillSelector
              canAddSkills={false}
              role={user?.role}
              isShowLabel={false}
              style={styles?.skillsContainer}
              tagStyle={styles?.skillTag}
              tagTextStyle={styles?.skillTagText}
              userSkills={user?.skills}
              availableSkills={MEDIATORTYPES}
              count={2}
            />
            <CustomText textAlign="left">{user?.address}</CustomText>
          </View>
          <View style={styles.etaContainer}>
            <CustomText>{getTimeAgo(item?.createdAt)}</CustomText>
          </View>
        </View>

        <View
          style={
            isSender ? styles.actionContainer : styles?.sentActionContainer
          }
        >
          {isSender && (
            <Button
              isPrimary={false}
              title={t("cancel")}
              onPress={() => onCancelRequest?.(item?.receiver?._id)}
              bgColor={Colors?.danger}
              borderColor={Colors?.danger}
              textColor={Colors?.white}
              style={{ width: "30%", paddingVertical: 6 }}
            />
          )}
          {isReceiver && (
            <>
              <Button
                isPrimary={true}
                title={t("reject")}
                onPress={() => onRejectRequest?.(item?.sender?._id)}
                style={styles?.rejectButton}
                bgColor={Colors?.danger}
                borderColor={Colors?.danger}
              />
              <Button
                isPrimary={true}
                title={t("accept")}
                onPress={() => onAcceptRequest?.(item?.sender?._id)}
                style={styles?.acceptButton}
                bgColor={Colors?.success}
                borderColor={Colors?.success}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

RequestCardTeamJoinng.displayName = "RequestCardTeamJoinng";

const ListingVerticalRequests = ({
  listings,
  requestType,
  isLoading,
  loadMore,
  isFetchingNextPage,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  refreshControl,
}: any) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const renderLoader = () =>
    isFetchingNextPage ? (
      <ActivityIndicator
        size="large"
        color={Colors?.primary}
        style={styles.loaderStyle}
      />
    ) : null;

  const commonFlatListProps = {
    data: listings ?? [],
    keyExtractor: (item: any) => item?._id?.toString(),
    onEndReached: debounce(loadMore, 300),
    onEndReachedThreshold: 0.9,
    ListFooterComponent: renderLoader,
    getItemLayout: (data: any, index: number) => ({
      length: 200,
      offset: 200 * index,
      index,
    }),
    initialNumToRender: 10,
    maxToRenderPerBatch: 10,
    windowSize: 3,
    removeClippedSubviews: true,
    contentContainerStyle: { paddingBottom: 110 },
  };

  const renderContent = () => {
    if (userDetails?.isAdmin) {
      return (
        <FlatList
          {...commonFlatListProps}
          renderItem={({ item }) => (
            <RequestCardAdmin
              item={item}
              requestType={requestType}
              onAcceptRequest={onAcceptRequest}
              onRejectRequest={onRejectRequest}
              onCancelRequest={onCancelRequest}
            />
          )}
        />
      );
    }

    if (requestType === "teamJoiningRequest") {
      return (
        <FlatList
          {...commonFlatListProps}
          renderItem={({ item }) => (
            <RequestCardTeamJoinng
              item={item}
              userDetails={userDetails}
              requestType={requestType}
              onAcceptRequest={onAcceptRequest}
              onRejectRequest={onRejectRequest}
              onCancelRequest={onCancelRequest}
            />
          )}
          refreshControl={refreshControl}
        />
      );
    }
    return (
      <FlatList
        {...commonFlatListProps}
        renderItem={({ item }) => (
          <RequestCardUser
            item={item}
            userDetails={userDetails}
            requestType={requestType}
            onAcceptRequest={onAcceptRequest}
            onRejectRequest={onRejectRequest}
            onCancelRequest={onCancelRequest}
          />
        )}
        refreshControl={refreshControl}
      />
    );
  };

  if (isLoading) {
    return <OnPageLoader />;
  }

  return <View style={styles.container}>{renderContent()}</View>;
};

export default ListingVerticalRequests;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 0,
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  requestStatus: {
    fontWeight: "600",
    fontSize: 14,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.secondary,
  },
  imageContainer: {
    position: "relative",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "white",
  },
  usersContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userSection: {
    flex: 1,
  },
  senderSection: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  receiverSection: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  userContentContainer: {
    flexDirection: "column",
    gap: 10,
  },
  userDetails: {
    flex: 1,
  },
  leftAlignText: {
    textAlign: "left",
    alignSelf: "flex-start",
  },
  rightAlignText: {
    textAlign: "right",
    alignSelf: "flex-end",
  },
  leftAlignContainer: {
    alignItems: "flex-start",
  },
  rightAlignContainer: {
    alignItems: "flex-end",
  },
  arrowContainer: {
    position: "relative",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  arrowLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.secondary,
  },
  arrow: {
    fontSize: 24,
    color: Colors.primary,
    backgroundColor: "white",
    paddingHorizontal: 8,
  },
  label: {
    color: Colors.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    color: Colors.secondary,
  },
  skillsContainer: {
    paddingVertical: 4,
  },
  skillTag: {
    backgroundColor: Colors?.fourth,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  skillTagText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.tertiery,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  requestContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  etaContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sentActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rejectButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    width: "30%",
  },
  acceptButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    width: "50%",
  },
});

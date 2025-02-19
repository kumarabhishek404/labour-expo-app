import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import * as Notifications from "expo-notifications";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack, useFocusEffect } from "expo-router";
import Button from "@/components/inputs/Button";
import NOTIFICATION from "@/app/api/notification";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Loader from "@/components/commons/Loaders/Loader";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import { getTimeAgo } from "@/constants/functions";
import ProfilePicture from "@/components/commons/ProfilePicture";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import RippleDot from "@/components/commons/RippleDot";

const NotificationScreen = () => {
  const queryClient = useQueryClient();
  const visibleNotificationIdsRef = useRef(new Set());
  const [hasPermission, setHasPermission] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [visibleNotificationIds, setVisibleNotificationIds] = useState<
    Set<string>
  >(new Set());
  const setHasNewNotification = useSetAtom(Atoms?.hasNewNotificationAtom);

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["allNotifications"],
    queryFn: ({ pageParam }) =>
      NOTIFICATION?.fetchAllNotifications({ pageParam }),
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const mutationMarkAsReadMutation = useMutation({
    mutationKey: ["markAsReadNotification"],
    mutationFn: (payload: any) => NOTIFICATION?.markAsReadNotification(payload),
    onSuccess: (response) => {
      console.log("response while marking as read notification - ", response);
      queryClient.invalidateQueries({ queryKey: ["allNotificationsCount"] });
    },
    onError: (err) => {
      console.error("error while marking as read notification - ", err);
    },
  });

  useEffect(() => {
    visibleNotificationIdsRef.current = visibleNotificationIds;
  }, [visibleNotificationIds]);

  useEffect(() => {
    return () => {
      if (mutationMarkAsReadMutation) {
        const notificationIds = [...visibleNotificationIdsRef.current];
        if (notificationIds?.length > 0)
          mutationMarkAsReadMutation.mutate({ notificationIds });
      }
    };
  }, []);

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    setHasNewNotification(false);
  }, [notifications]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setNotifications(
        response?.pages?.flatMap((page: any) => page?.notifications || []) || []
      );
      return () => unsubscribe;
    }, [response])
  );

  const memoizedData = useMemo(
    () => notifications?.flatMap((data: any) => data),
    [notifications]
  );

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      const newVisibleIds = viewableItems
        ?.filter((item) => !item?.item?.read)
        ?.map((item) => item?.item?._id);

      setVisibleNotificationIds((prevIds) => {
        const updatedIds = new Set(prevIds);
        newVisibleIds?.forEach((id) => updatedIds?.add(id));

        if (updatedIds?.size !== prevIds?.size) {
          return updatedIds;
        }
        return prevIds;
      });
    }
  ).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Trigger when 50% of the item is visible
  };

  useEffect(() => {
    // Update the visibleNotificationIds whenever new data is fetched
    const newVisibleIds = notifications
      ?.filter((item) => !item?.read)
      ?.map((item) => item?._id);

    setVisibleNotificationIds(new Set(newVisibleIds));
  }, [notifications]); // Trigger this effect every time notifications change after a refetch

  const renderNotification = ({ item }: any) => (
    <View style={styles?.notificationItem}>
      <View
        style={{
          width: "55%",
          flexDirection: "row",
          position: "relative",
          gap: 10,
        }}
      >
        <ProfilePicture uri={item?.data?.actionBy?.profilePicture} />
        <View style={styles?.notificationContent}>
          <View style={{ position: "absolute", top: 0, left: -20 }}>
            {!item?.read && <RippleDot />}
          </View>
          <CustomHeading textAlign="left">{item?.title}</CustomHeading>
          <CustomText textAlign="left">{item?.body}</CustomText>
        </View>
      </View>
      <CustomText>{getTimeAgo(item?.createdAt)}</CustomText>
    </View>
  );

  const RequestPermission = () => (
    <View style={styles?.container}>
      <CustomHeading textAlign="left">
        Get notifications about important things for you.
      </CustomHeading>
      <CustomText textAlign="left" style={{ marginBottom: 10 }}>
        We&#39;ll notify you when
      </CustomText>
      <View style={styles?.permissionItems}>
        <CustomText baseFont={14} textAlign="left">
          1. New service is arrived
        </CustomText>
        <CustomText baseFont={14} textAlign="left">
          2. When any mediator creates requirements
        </CustomText>
        <CustomText baseFont={14} textAlign="left">
          3. When you got selected in the service
        </CustomText>
        <CustomText baseFont={14} textAlign="left">
          4. When someone likes you
        </CustomText>
        <CustomText baseFont={14} textAlign="left">
          5. When any mediator requests you to join his team
        </CustomText>
      </View>
      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={false}
          title="Later"
          onPress={() => router?.back()}
          style={styles?.button}
          textStyle={styles?.buttonText}
        />
        <Button
          isPrimary={true}
          title="Allow Notifications"
          onPress={requestPermission}
          style={styles?.button}
          textStyle={styles?.buttonText}
        />
      </View>
    </View>
  );

  const HasPermissionZeroNotification = () => (
    <View style={styles?.container}>
      <MaterialIcons
        name="notifications"
        size={100}
        style={styles?.notificationIcon}
      />
      <CustomHeading>No notifications yet</CustomHeading>
      <CustomText>
        Your notifications will appear here once you’ve received them.
      </CustomText>
      <TouchableOpacity>
        <CustomText color={Colors?.link}>
          Go to historical notifications.
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Notifications" left="back" />,
        }}
      />
      <Loader loading={isLoading || isFetchingNextPage} />
      <View style={styles?.container}>
        {!hasPermission && RequestPermission()}

        {hasPermission &&
          notifications?.length === 0 &&
          HasPermissionZeroNotification()}

        {hasPermission && notifications?.length > 0 && (
          <FlatList
            data={memoizedData || []}
            keyExtractor={(item) => item?._id}
            renderItem={renderNotification}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            ListFooterComponent={() => (
              <>
                {hasNextPage ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                      }
                    }}
                  >
                    <CustomText color={Colors?.link} margin={10}>
                      {t("goToHistoricalNotifications")}
                    </CustomText>
                  </TouchableOpacity>
                ) : (
                  <CustomText margin={10}>{t("noNotificationsYet")}</CustomText>
                )}
              </>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing && !isRefetching}
                onRefresh={onRefresh}
              />
            }
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: Colors?.background,
  },
  permissionItems: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors?.background,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    fontSize: 14,
  },
  notificationIcon: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  notificationContent: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 0,
  },
});

export default NotificationScreen;

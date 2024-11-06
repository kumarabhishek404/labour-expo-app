import React, { useState, useEffect, useMemo } from "react";
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
import { fetchAllNotifications } from "@/app/api/notification";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loader from "@/components/commons/Loader";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import { getTimeAgo } from "@/constants/functions";
import ProfilePicture from "@/components/commons/ProfilePicture";
import { useSetAtom } from "jotai";
import { hasNewNotificationAtom } from "@/app/AtomStore/user";
import { usePullToRefresh } from "@/app/hooks/usePullToRefresh";
import CustomHeader from "@/components/commons/Header";

const NotificationScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [notifications, setNotifications]: any = useState([]);
  const setHasNewNotification = useSetAtom(hasNewNotificationAtom);

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
    queryFn: ({ pageParam }) => fetchAllNotifications({ pageParam }),
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    setHasNewNotification(false);
  }, [notifications]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setNotifications(
        response?.pages.flatMap((page: any) => page?.notifications || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  const memoizedData = useMemo(
    () => notifications?.flatMap((data: any) => data),
    [notifications]
  );

  const checkPermission = async () => {
    const { status } = await Notifications?.getPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const requestPermission = async () => {
    const { status } = await Notifications?.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const renderNotification = ({ item, index }: any) => (
    <TouchableOpacity
      key={`${index}-${item?.data?.actionBy?.id}`}
      style={styles.notificationItem}
      onPress={() => router?.push(`/screens/users/${item?.data?.actionBy?.id}`)}
    >
      <View style={{ width: "55%", flexDirection: "row" }}>
        <ProfilePicture uri={item?.data?.actionBy?.profilePicture} />
        <View style={styles.notificationContent}>
          <CustomHeading textAlign="left">{item?.title}</CustomHeading>
          <CustomText textAlign="left">{item?.body}</CustomText>
        </View>
      </View>
      <CustomText>{getTimeAgo(item?.createdAt)}</CustomText>
    </TouchableOpacity>
  );

  const RequestPermission = () => (
    <View style={styles.container}>
      <CustomHeading textAlign="left">
        Get notifications about important things for you.
      </CustomHeading>
      <CustomText textAlign="left" style={{ marginBottom: 10 }}>
        We'll notify you when
      </CustomText>
      <View style={styles.permissionItems}>
        <CustomText fontSize={14} textAlign="left">
          1. New service is arrived
        </CustomText>
        <CustomText fontSize={14} textAlign="left">
          2. When any mediator create requirements
        </CustomText>
        <CustomText fontSize={14} textAlign="left">
          3. When you got selected in the service
        </CustomText>
        <CustomText fontSize={14} textAlign="left">
          4. When someone like you
        </CustomText>
        <CustomText fontSize={14} textAlign="left">
          5. When any mediator request you to join his team
        </CustomText>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          isPrimary={false}
          title="Later"
          onPress={() => router?.back()}
          style={styles.button}
          textStyle={styles.buttonText}
        />
        <Button
          isPrimary={true}
          title="Allow Notificatios"
          onPress={requestPermission}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );

  const HasPermissonZeroNotification = () => (
    <View style={styles.container}>
      <MaterialIcons
        name="notifications"
        size={100}
        style={styles.notificationIcon}
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

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Notifications" left="back" />,
        }}
      />
      <Loader loading={isLoading || isRefetching || isFetchingNextPage} />
      <View style={styles.container}>
        {!hasPermission && RequestPermission()}

        {hasPermission &&
          notifications?.length === 0 &&
          HasPermissonZeroNotification()}

        {hasPermission && notifications?.length > 0 && (
          <FlatList
            data={memoizedData || []}
            keyExtractor={(item) => item._id}
            renderItem={renderNotification}
            showsVerticalScrollIndicator={false}
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
                      Go to historical notifications.
                    </CustomText>
                  </TouchableOpacity>
                ) : (
                  <CustomText margin={10}>
                    Not found any notifications old than above
                  </CustomText>
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
  },
  permissionItems: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
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

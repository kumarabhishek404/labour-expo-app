import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import CategoryButtons from "@/components/CategoryButtons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import { fetchAllWorkers } from "../api/workers";
import { fetchAllServices } from "../api/services";
import Loader from "@/components/Loader";
import { fetchAllEmployers } from "../api/employer";
import GroupWorkersListing from "@/components/GroupWorkersListing";
import GroupEmployersListing from "@/components/GroupEmployersListing";
import profileImage from "../../assets/images/placeholder-person.jpg";
import i18n from "@/utils/i18n";
import { useLocale } from "../context/locale";
import ListingHorizontalServices from "@/components/ListingHorizontalServices";
import ListingHorizontalWorkers from "@/components/ListingHorizontalWorkers";
import Farmer1 from "../../assets/farmer1.png";
import Farmer2 from "../../assets/farmer2.png";
import Farmer3 from "../../assets/farmer3.png";
import Farmer4 from "../../assets/farmer4.png";
import Farmer5 from "../../assets/farmer5.png";

// import { useLocale } from "../context/locale";

const Page = () => {
  useLocale();
  const userDetails = useAtomValue(UserAtom);
  const headerHeight = useHeaderHeight();
  const [category, setCategory] = useState("All");

  // const {
  //   isLoading,
  //   data: response,
  //   isRefetching,
  // } = useQuery({
  //   queryKey: ["services"],
  //   queryFn: async () =>
  //     (await userDetails?.role) === "Employer"
  //       ? fetchAllWorkers()
  //       : fetchAllServices(),
  //   retry: 0,
  // });

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["homepage"],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "Employer"
        ? fetchAllWorkers({ pageParam })
        : fetchAllServices({ pageParam });
    },
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: secondResponse,
    isLoading: isSecondLoading,
    isFetchingNextPage: isSecondFetchingNextPage,
    fetchNextPage: fetchSecondNextPage,
    hasNextPage: hasSecondsNextPage,
  } = useInfiniteQuery({
    queryKey: ["tops"],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "Employer"
        ? fetchAllWorkers({ pageParam })
        : fetchAllEmployers({ pageParam });
    },
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const loadSecondMore = () => {
    if (hasSecondsNextPage && !isSecondFetchingNextPage) {
      fetchSecondNextPage();
    }
  };

  const onCatChanged = (category: string) => {
    setCategory(category);
  };

  const memoizedData = useMemo(
    () =>
      response?.pages
        .flatMap((page: any) => page.data || [])
        ?.flatMap((data: any) => data),
    [response]
  );

  const secondMemoizedData = useMemo(
    () =>
      secondResponse?.pages
        .flatMap((page: any) => page.data || [])
        ?.flatMap((data: any) => data),
    [secondResponse]
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              style={{ marginLeft: 20 }}
            >
              <Image
                source={
                  userDetails?.avatar
                    ? {
                        uri: userDetails?.avatar,
                      }
                    : profileImage
                }
                style={{ width: 40, height: 40, borderRadius: 4 }}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                marginRight: 20,
                backgroundColor: Colors.white,
                padding: 10,
                borderRadius: 8,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Ionicons name="notifications" size={20} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <Loader loading={isLoading || isSecondLoading} />

      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.headingTxt}>
            {i18n.t("welcome")} {userDetails?.firstName}
          </Text>
          <View style={styles.searchSectionWrapper}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={18}
                style={{ marginRight: 5 }}
                color={Colors.black}
              />
              <TextInput
                style={styles.searchBox}
                placeholder="Search..."
                // value={searchText}
                // onChangeText={handleSearch}
                placeholderTextColor="black"
              />
            </View>
            <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
              <Ionicons name="options" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles?.linksContainer}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.box}
                onPress={() => router.push("/(tabs)/workers")}
              >
                <View style={styles?.firstBoxText}>
                  <Text style={styles.title}>Services</Text>
                  <Text style={styles.subtitle}>
                    Mobile, Fiber and AirFiber
                  </Text>
                </View>
                <View style={styles?.imageContainer}>
                  <Image source={Farmer1} style={styles.image} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondBox}
                onPress={() => router.push("/screens/employer")}
              >
                <View style={styles?.secondBoxText}>
                  <Text style={styles.title}>Employers</Text>
                  <Text style={[styles.subtitle, { width: 70 }]}>
                    Free health check
                  </Text>
                </View>
                <View style={styles?.imageContainer}>
                  <Image source={Farmer5} style={{ width: 102, height: 75 }} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.secondRow}>
              <TouchableOpacity
                style={styles.secondBox}
                onPress={() => router.push("/screens/mediators")}
              >
                <View style={styles?.secondBoxText}>
                  <Text style={styles.title}>Mediators</Text>
                  <Text style={styles.subtitle}>UPI, Bank, Loan</Text>
                </View>
                <View style={styles?.imageContainer}>
                  <Image source={Farmer3} style={styles.secondImage} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondBox}
                onPress={() => router?.push("/(tabs)/bookings")}
              >
                <View style={styles?.secondBoxText}>
                  <Text style={styles.title}>My Bookings</Text>
                  <Text style={styles.subtitle}>Grocery, Fashion</Text>
                </View>
                <View style={styles?.imageContainer}>
                  <Image source={Farmer2} style={{ width: 80, height: 90 }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondBox}
                onPress={() => router.push("/(tabs)/help")}
              >
                <View style={styles?.secondBoxText}>
                  <Text style={styles.title}>Guides / Helps</Text>
                  <Text style={[styles.subtitle, { width: 90 }]}>
                    Music, TV, Games
                  </Text>
                </View>
                <View style={styles?.imageContainer}>
                  <Image source={Farmer4} style={{ width: 70, height: 90 }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.categroyTitle}>
            {userDetails?.role === "Employer" ? "Workers" : "Services"}
          </Text>
          <CategoryButtons
            type={userDetails?.role === "Employer" ? "workers" : "services"}
            onCagtegoryChanged={onCatChanged}
            stylesProp={styles.categoryContainer}
          />

          <View style={styles.totalData}>
            <Text style={styles.totalItemTxt}>
              {isLoading
                ? "Loading..."
                : `${memoizedData?.length || 0} Results`}
            </Text>
          </View>
          {userDetails?.role === "Employer" ? (
            <ListingHorizontalWorkers
              category={category}
              listings={memoizedData || []}
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <ListingHorizontalServices
              category={category}
              listings={memoizedData || []}
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}

          {userDetails?.role === "Employer" ? (
            <GroupWorkersListing
              category={category}
              listings={secondMemoizedData || []}
              loadMore={loadSecondMore}
              isFetchingNextPage={isSecondFetchingNextPage}
            />
          ) : (
            <GroupEmployersListing
              category={category}
              listings={secondMemoizedData || []}
              loadMore={loadSecondMore}
              isFetchingNextPage={isSecondFetchingNextPage}
            />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.bgColor,
  },
  headingTxt: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.black,
    marginTop: 10,
  },
  searchSectionWrapper: {
    flexDirection: "row",
    marginVertical: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingLeft: 16,
    borderRadius: 8,
  },
  searchBox: {
    color: "#000000",
    height: "100%",
    width: "92%",
    fontSize: 16,
  },
  filterBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginLeft: 20,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  row: {
    width: "48%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  secondRow: {
    width: "48%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 16,
  },
  box: {
    // width: "100%",
    height: 176,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    // alignItems: "flex-end",
    // flexDirection:'column',
    // justifyContent: "center",
    paddingTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  secondBox: {
    // width: "100%",
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  firstBoxText: {
    width: 140,
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    textAlign: "left",
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
  secondBoxText: {
    width: 140,
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    textAlign: "left",
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
    zIndex: 1,
  },
  imageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 0.9,
  },
  image: {
    width: 120,
    height: 150,
  },
  secondImage: {
    width: 70,
    height: 75,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333333",
  },
  subtitle: {
    fontSize: 10,
    color: "#888888",
  },
  singleBoxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  categroyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.black,
    // marginBottom: 10,
  },
  categoryContainer: {
    // paddingHorizontal: 20,
  },
  totalData: {
    // paddingHorizontal: 20,
    paddingBottom: 6,
  },
  totalItemTxt: {
    fontSize: 12,
  },
});

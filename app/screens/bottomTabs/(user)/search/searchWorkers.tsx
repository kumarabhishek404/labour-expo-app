import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard, // Import Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import ListingHorizontalWorkers from "@/components/commons/ListingHorizontalWorkers";
import { WORKERTYPES } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import WORKER from "@/app/api/workers";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import { Controller, useForm } from "react-hook-form";
import { t } from "@/utils/translationHelper";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import CustomText from "@/components/commons/CustomText";
import DropdownComponent from "@/components/inputs/Dropdown";
import ButtonComp from "@/components/inputs/Button";
import CustomHeading from "@/components/commons/CustomHeading";
import { Button } from "react-native-paper";
import USER from "@/app/api/user";

const SearchWorkers = () => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      skill: "",
    },
  });

  const userDetails = useAtomValue(Atoms?.UserAtom);

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["topWorkers"],
    queryFn: ({ pageParam }) =>
      USER?.fetchAllUsers({ pageParam, skill: "", name: "" }),
    initialPageParam: 1,
    enabled: !!userDetails?._id && userDetails?.status === "ACTIVE",
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.page < lastPage?.pagination?.pages
        ? lastPage?.pagination?.page + 1
        : undefined,
  });

  const memoizedData = useMemo(
    () => response?.pages?.flatMap((data) => data?.data),
    [response]
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onSubmit = (data: any) => {
    if (!data.name && !data.skill) {
      setError("root", {
        type: "manual",
        message: "Please fill at least one field (name or skill).",
      });
      return;
    }

    const searchCategory = {
      name: data?.name,
      skill: data?.skill,
    };

    router?.push({
      pathname: "/screens/users",
      params: {
        title: "All Services",
        type: "all",
        searchCategory: JSON.stringify(searchCategory),
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: 10,
            paddingTop: 10,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Button
            icon={() => (
              <Ionicons name="people" size={22} color={Colors.primary} />
            )}
            textColor={Colors?.primary}
            style={{ width: "50%", alignItems: "flex-start" }}
            onPress={() =>
              router?.push({
                pathname: "/screens/users",
                params: {
                  title: "All Workers",
                  type: "all",
                  searchCategory: JSON.stringify({ name: "", skill: "" }),
                },
              })
            }
          >
            SHOW ALL WORKERS
          </Button>
        </View>
        <View style={styles.searchContainer}>
          {errors.root && (
            <CustomText color="red" style={{ marginBottom: 10 }}>
              {errors.root.message}
            </CustomText>
          )}

          <Controller
            control={control}
            name="name"
            rules={{
              validate: (value) => {
                const skillValue = watch("skill");
                if (!value && !skillValue) {
                  return "Please fill at least one field (name or skill).";
                }
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                name="name"
                label={"Search Workers By Name"}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("enterYourResetPasswordCode")}
                containerStyle={errors?.name && styles.errorInput}
                errors={errors}
                icon={
                  <Ionicons
                    name="person"
                    size={30}
                    color={Colors.secondary}
                    style={styles.iconStyle}
                  />
                }
              />
            )}
          />

          <CustomText fontWeight="bold" baseFont={26}>
            OR
          </CustomText>

          <View style={{ zIndex: 300, marginBottom: 20 }}>
            <Controller
              control={control}
              name="skill"
              rules={{
                validate: (value) => {
                  const nameValue = watch("name");
                  if (!value && !nameValue) {
                    return "Please fill at least one field (name or skill).";
                  }
                  return true;
                },
              }}
              render={({ field: { onChange, value } }) => (
                <DropdownComponent
                  name="skill"
                  label={"Search Workers By Skill"}
                  value={value}
                  translationEnabled
                  onSelect={(selectedValue: any) => {
                    onChange(selectedValue);
                    Keyboard.dismiss();
                  }}
                  onPress={() => Keyboard.dismiss()}
                  onFocus={() => Keyboard.dismiss()} // Dismiss keyboard when dropdown is focused
                  placeholder="selectWorkType"
                  options={WORKERTYPES}
                  errors={errors}
                  containerStyle={errors?.skill && styles.errorInput}
                  search={true}
                  icon={
                    <Ionicons
                      name="construct"
                      size={30}
                      color={Colors.secondary}
                      style={styles.iconStyle}
                    />
                  }
                />
              )}
            />
          </View>

          <ButtonComp
            title="Search Workers"
            isPrimary
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        {/* <View style={styles.workerList}>
          <CustomHeading
            style={styles.sectionTitle}
            baseFont={22}
            textAlign="left"
          >
            🌴 Best Workers On Demand
          </CustomHeading>
          {memoizedData ? (
            <ListingHorizontalWorkers
              availableInterest={WORKERTYPES}
              listings={memoizedData || []}
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <ActivityIndicator
              size="large"
              style={styles.loaderStyle}
              color={Colors.primary}
            />
          )}
        </View> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchWorkers;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  searchContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 400,
  },
  iconStyle: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  workerList: {
    marginBottom: 20,
  },
  bottomOption: {
    width: "100%",
    textAlign: "right",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  loaderStyle: {
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
  },
});

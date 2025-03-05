import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { WORKTYPES } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import SERVICE from "@/app/api/services";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import { Controller, useForm } from "react-hook-form";
import { t } from "@/utils/translationHelper";
import { filterSubCategories } from "@/constants/functions";
import CustomText from "@/components/commons/CustomText";
import ButtonComp from "@/components/inputs/Button";
import ListingHorizontalServices from "@/components/commons/ListingHorizontalServices";
import PaperDropdown from "@/components/inputs/Dropdown";
import CustomHeading from "@/components/commons/CustomHeading";
import { Button } from "react-native-paper";
import TopHeaderLinks from "@/components/commons/TopHeaderLinks";

const SearchServices = ({ style }: any) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue, // Add setValue from react-hook-form
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      subType: "",
    },
  });

  const userDetails = useAtomValue(Atoms?.UserAtom);
  const {
    data: secondResponse,
    isFetchingNextPage: secondIsFetchingNextPage,
    fetchNextPage: secondFetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["topServices"],
    queryFn: ({ pageParam }) => {
      return SERVICE?.fetchAllServices({
        pageParam,
        status: "HIRING",
        type: "",
        subType: "",
        skill: "",
      });
    },
    initialPageParam: 1,
    retry: false,
    enabled: !!userDetails?._id && userDetails?.status === "ACTIVE",
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const secondMemoizedData = useMemo(
    () => secondResponse?.pages?.flatMap((data: any) => data?.data),
    [secondResponse]
  );

  const secondLoadMore = () => {
    if (secondFetchNextPage && !secondIsFetchingNextPage) {
      secondFetchNextPage();
    }
  };

  const onSubmit = (data: any) => {
    const searchCategory = {
      type: data?.type,
      subType: data?.subType,
      skill: data?.skill,
    };

    router?.push({
      pathname: "/screens/service",
      params: {
        title: 'allServices',
        type: "all",
        searchCategory: JSON.stringify(searchCategory),
      },
    });
  };

  return (
    <View style={style}>
      <TopHeaderLinks
        title={['showAllServices']}
        onPress={[
          () =>
            router?.push({
              pathname: "/screens/service",
              params: {
                title: 'allServices',
                type: "all",
                searchCategory: JSON.stringify({
                  type: "",
                  subType: "",
                  skill: "",
                }),
              },
            }),
        ]}
        icon={[
          <MaterialIcons
            key={0}
            name="work"
            size={22}
            color={Colors.primary}
          />,
        ]}
      />

      <View style={[styles.searchContainer, style]}>
        <CustomHeading
          textAlign="left"
          baseFont={22}
          style={{ marginBottom: 0 }}
          color={Colors?.heading}
        >
          {t("searchServices")}
        </CustomHeading>

        <View style={{ gap: 20, marginBottom: 0 }}>
          <View style={{ zIndex: 9 }}>
            <Controller
              control={control}
              name="type"
              defaultValue=""
              rules={{
                required: t("workTypeIsRequired"),
              }}
              render={({ field: { value, onChange } }) => (
                <PaperDropdown
                  name="type"
                  label="workType"
                  selectedValue={value}
                  onSelect={(selectedValue: any) => {
                    onChange(selectedValue); // Update the type field
                    setValue("subType", ""); // Reset the subType field
                  }}
                  translationEnabled
                  placeholder="selectWorkType"
                  options={WORKTYPES}
                  errors={errors}
                  search={false}
                  icon={
                    <Ionicons
                      name={"mail-outline"}
                      size={30}
                      color={Colors.secondary}
                      style={{ paddingVertical: 10, paddingRight: 10 }}
                    />
                  }
                />
              )}
            />
          </View>
          <View style={{ zIndex: 8 }}>
            <Controller
              control={control}
              name="subType"
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <PaperDropdown
                  key={watch("type")}
                  name="subType"
                  label="workSubType"
                  selectedValue={value}
                  onSelect={onChange}
                  placeholder={
                    watch("type")
                      ? "selectWorkSubType"
                      : "pleaseSelectWorkTypeFirst"
                  }
                  translationEnabled
                  // disabled={!watch("type")}
                  options={filterSubCategories(watch("type"))}
                  errors={errors}
                  search={false}
                  icon={
                    <Ionicons
                      name={"mail-outline"}
                      size={30}
                      color={Colors.secondary}
                      style={{ paddingVertical: 10, paddingRight: 10 }}
                    />
                  }
                />
              )}
            />
          </View>
        </View>
        <ButtonComp
          title={t("searchServicesTitle")}
          isPrimary
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export default SearchServices;

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: Colors?.background,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    gap: 25,
  },
  input: {
    height: 53,
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    height: 53,
  },
  dropDownContainer: {
    borderColor: "#ddd",
    borderRadius: 10,
    position: "absolute",
  },
  searchButton: {
    backgroundColor: Colors?.white,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  cardScroll: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  cardPrice: {
    fontSize: 14,
    color: "gray",
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
});

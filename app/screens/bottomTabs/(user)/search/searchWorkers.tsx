import React, { useMemo } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { WORKERTYPES } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import { Controller, useForm } from "react-hook-form";
import { t } from "@/utils/translationHelper";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import ButtonComp from "@/components/inputs/Button";
import CustomHeading from "@/components/commons/CustomHeading";
import USER from "@/app/api/user";
import TopHeaderLinks from "@/components/commons/TopHeaderLinks";
import PaperDropdown from "@/components/inputs/Dropdown";

const SearchWorkers = ({ style }: any) => {
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
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <TopHeaderLinks
        title={["SHOW ALL WORKERS"]}
        onPress={[
          () =>
            router?.push({
              pathname: "/screens/users",
              params: {
                title: "All Workers",
                type: "all",
                searchCategory: JSON.stringify({ name: "", skill: "" }),
              },
            }),
        ]}
        icon={[
          <Ionicons key={0} name="people" size={22} color={Colors.primary} />,
        ]}
      />

      <View style={[styles.searchContainer, style]}>
        <CustomHeading
          textAlign="left"
          baseFont={22}
          style={{ marginBottom: 0 }}
          color={Colors?.heading}
        >
          SEARCH WORKERS
        </CustomHeading>

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
              label="workerName"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("enterYourResetPasswordCode")}
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
            <PaperDropdown
              name="skill"
              label="workerSkill"
              selectedValue={value}
              translationEnabled
              onSelect={(selectedValue: any) => {
                onChange(selectedValue);
                Keyboard.dismiss();
              }}
              onPress={() => Keyboard.dismiss()}
              onFocus={() => Keyboard.dismiss()}
              placeholder="selectWorkType"
              options={WORKERTYPES}
              errors={errors}
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

        <ButtonComp
          title="Search Workers"
          isPrimary
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
    // </TouchableWithoutFeedback>
  );
};

export default SearchWorkers;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  searchContainer: {
    backgroundColor: Colors?.background,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    gap: 25,
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
});

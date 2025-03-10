import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { router } from "expo-router";
import ProfilePicture from "./ProfilePicture";
import ButtonComp from "../inputs/Button";
import DateDisplay from "./ShowDate";
import ShowDuration from "./ShowDuration";

const ListingsBookedWorkers = ({ title, item, category }: any) => {
  let workersList =
    item?.bookingType === "byService"
      ? [
          ...(item.selectedUsers?.filter(
            (user: any) => user?.status === "SELECTED"
          ) || []),
          ...item.selectedUsers
            .filter((user: any) => user?.status === "SELECTED")
            .flatMap((user: any) => user?.workers || []),
        ]
      : [item?.bookedWorker];

  const firstWorker = workersList?.[0];

  return (
    <View style={styles.container} key={item?._id}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/screens/bookings/[id]",
            params: {
              id: item?._id,
              title: title,
              data: JSON.stringify(item),
              category: category,
            },
          })
        }
      >
        <View style={styles.card}>
          {/* Worker Profile Section */}
          <View style={styles.workerHeader}>
            <View style={styles.workerImagesContainer}>
              {workersList?.slice(0, 3).map((worker: any, index: number) => (
                <ProfilePicture
                  key={index}
                  uri={worker.profilePicture}
                  style={[styles.workerImage, { left: index * 20 }]}
                />
              ))}
            </View>

            <View style={styles.workerInfo}>
              <CustomHeading baseFont={18} fontWeight="bold" textAlign="right">
                {firstWorker?.name}
              </CustomHeading>
              <CustomText
                baseFont={15}
                color={Colors.tertieryButton}
                textAlign="right"
              >
                {firstWorker?.skills?.map(
                  (skill: any) => `${t(skill?.skill)}, `
                )}
              </CustomText>
            </View>
          </View>

          {/* Worker Status & Contact */}
          <View style={styles.statusContainer}>
            <CustomText
              style={{ flex: 1 }}
              textAlign="left"
              baseFont={14}
              color={Colors?.subHeading}
            >
              {firstWorker?.address}
            </CustomText>
            <CustomText
              style={{ width: "30%" }}
              textAlign="right"
              baseFont={14}
              color={Colors.primary}
            >
              📞 {firstWorker?.mobile}
            </CustomText>
          </View>

          {/* Booking Info (Secondary) */}
          <View style={styles.bookingDetails}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <CustomHeading textAlign="left">
                {t(item?.type)} - {t(item?.subType)}
              </CustomHeading>
              <ShowDuration duration={item?.duration} />
            </View>
            <DateDisplay date={item?.startDate} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {item?.status === "HIRING" && (
                <ButtonComp
                  isPrimary={true}
                  title={t("addAttendance")}
                  onPress={() =>
                    router?.push({
                      pathname: "/screens/bookings/addAttendance",
                      params: {
                        bookingDetails: JSON.stringify(item),
                        workers: JSON.stringify(workersList),
                      },
                    })
                  }
                  textStyle={{ fontSize: 16 }}
                  style={{ width: "50%", marginTop: 10, paddingVertical: 6 }}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ListingsBookedWorkers;

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 20 },
  card: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
  },
  workerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  workerImagesContainer: {
    flexDirection: "row",
    position: "relative",
    width: 80,
    height: 50,
  },
  workerImage: {
    position: "absolute",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  workerInfo: {
    flex: 1,
    marginLeft: 20,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  bookingDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.secondary,
    paddingTop: 8,
  },
});

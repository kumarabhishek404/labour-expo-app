import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Colors from "@/constants/Colors";
import CustomText from "@/components/commons/CustomText";
import Drawer from "@/components/commons/Drawer";
import { t } from "@/utils/translationHelper";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import ProfilePicture from "@/components/commons/ProfilePicture";
import DateDisplay from "@/components/commons/ShowDate";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";

export default function ShowAttendanceComponent({
  booking,
  attendanceReport,
}: any) {
  const setDrawerState: any = useSetAtom(Atoms?.SideDrawerAtom);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const calculateOverallAttendance = (attendance: any) => ({
    present: attendance.presentDays,
    absent: attendance.absentDays,
    halfDay: attendance.halfDays,
  });

  useEffect(() => {
    if (attendanceReport?.report?.length === 1) {
      setSelectedWorker(attendanceReport?.report[0]);
    }
  }, [attendanceReport]);

  const handleWorkerClick = (worker: any) => {
    setSelectedWorker(worker);
    // setIsDrawerVisible(true);
    handleShowAttendance();
  };

  const getAllDatesInRange = (startDate: Date, endDate: Date) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // ✅ Main function with booking start date parameter
  const renderDateWiseAttendance = (
    attendanceRecords: any[],
    bookingStartDate: string
  ) => {
    if (!attendanceRecords) return null;

    // ✅ Sort records by date
    const sortedRecords = attendanceRecords.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // ✅ Identify the earliest date among all attendance records and booking start date
    const earliestRecordDate = sortedRecords.length
      ? new Date(sortedRecords[0]?.date)
      : new Date(bookingStartDate);

    const rangeStartDate =
      earliestRecordDate < new Date(bookingStartDate)
        ? earliestRecordDate
        : new Date(bookingStartDate);

    const rangeEndDate = sortedRecords.length
      ? new Date(sortedRecords[sortedRecords.length - 1]?.date)
      : new Date();

    // ✅ Generate all dates from the earliest found date to the last attendance date
    const allDates = getAllDatesInRange(rangeStartDate, rangeEndDate);

    return allDates.map((date: Date) => {
      // ✅ Find matching record or return dummy if not found
      const record = sortedRecords.find(
        (rec: any) => new Date(rec.date).toDateString() === date.toDateString()
      ) || { date: date.toISOString(), status: "" };

      // const formattedDate = date.toLocaleDateString("en-US", {
      //   day: "2-digit",
      //   weekday: "long",
      //   month: "long",
      // });

      // const [weekday, month, day] = formattedDate.split(" ");
      // const customFormattedDate = `${day} ${t(weekday)} ${t(month)}`;

      return (
        <View key={record._id || date.toString()} style={styles.dateRow}>
          <View style={styles.dateBadge}>
            <DateDisplay date={date} />
          </View>
          <View
            style={[
              styles.statusBadge,
              styles[record?.status?.toLowerCase()] || styles.emptyStatus,
            ]}
          >
            <CustomText style={styles.statusText}>
              {t(record.status) || "--"}
            </CustomText>
          </View>
        </View>
      );
    });
  };

  const addBookingModalContent = () => (
    <View>
      <View style={styles.drawerProfileSection}>
        <ProfilePicture
          uri={selectedWorker?.workerDetails?.profilePicture}
          style={styles.drawerProfileImage}
        />
        <View>
          <Text style={styles.drawerWorkerName}>
            {selectedWorker?.workerDetails?.name}
          </Text>
          <Text style={styles.drawerWorkerAddress}>
            {selectedWorker?.workerDetails?.address || t("addressNotFound")}
          </Text>
        </View>
      </View>
      <CustomText textAlign="left" style={styles.drawerHeading}>
        {t("datewiseRecords")}
      </CustomText>
      {selectedWorker &&
        renderDateWiseAttendance(
          selectedWorker?.attendance?.attendanceRecords,
          booking?.startDate
        )}
    </View>
  );

  const handleShowAttendance = () => {
    setDrawerState({
      visible: true,
      title: "attendanceDetails",
      content: addBookingModalContent,
      // primaryButton: {
      //   title: "save",
      //   action: handleSubmit(onSubmitCompleteProfile),
      // },
      secondaryButton: {
        title: "back",
        action: () => setDrawerState({ visible: false }),
      },
    });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {attendanceReport?.report?.length > 1 ? (
          <>
            {attendanceReport?.report?.map((worker: any) => {
              const { workerDetails, attendance } = worker;
              const overall = calculateOverallAttendance(attendance);

              return (
                <TouchableOpacity
                  key={workerDetails._id}
                  style={styles.workerCard}
                  onPress={() => handleWorkerClick(worker)}
                >
                  <View style={styles.workerInfo}>
                    <Image
                      source={{ uri: workerDetails.profilePicture }}
                      style={styles.profileImage}
                    />
                    <View style={styles.workerDetailsContainer}>
                      <Text style={styles.workerName}>
                        {workerDetails.name}
                      </Text>
                      <Text style={styles.workerAddress}>
                        {workerDetails.address || t("addressNotFound")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.attendanceSummary}>
                    <View style={[styles.attendanceBadge, styles.presentBadge]}>
                      <CustomText style={styles.attendanceText}>
                        {t("present")}: {attendance.presentDays}
                      </CustomText>
                    </View>
                    <View style={[styles.attendanceBadge, styles.absentBadge]}>
                      <CustomText style={styles.attendanceText}>
                        {t("absent")}: {attendance.absentDays}
                      </CustomText>
                    </View>
                    <View style={[styles.attendanceBadge, styles.halfDayBadge]}>
                      <CustomText style={styles.attendanceText}>
                        {t("halfDay")}: {attendance.halfDays}
                      </CustomText>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <>
            {attendanceReport?.report?.length === 1 ? (
              <View style={styles?.singleWorkerContainer}>
                <View style={styles.drawerProfileSection}>
                  <Image
                    source={{
                      uri: selectedWorker?.workerDetails?.profilePicture,
                    }}
                    style={styles.drawerProfileImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.drawerWorkerName}>
                      {selectedWorker?.workerDetails?.name}
                    </Text>
                    <Text style={styles.drawerWorkerAddress}>
                      {selectedWorker?.workerDetails?.address ||
                        t("addressNotFound")}
                    </Text>
                  </View>
                </View>
                <CustomText textAlign="left" style={styles.drawerHeading}>
                  {t("datewiseRecords")}
                </CustomText>
                {selectedWorker &&
                  renderDateWiseAttendance(
                    selectedWorker?.attendance?.attendanceRecords,
                    booking?.startDate
                  )}
              </View>
            ) : (
              <EmptyDatePlaceholder title="attendanceRecords" />
            )}
          </>
        )}
      </ScrollView>

      {/* <Drawer
        title={t("attendanceDetails")}
        visible={isDrawerVisible}
        content={addBookingModalContent}
        onClose={() => setIsDrawerVisible(false)}
        secondaryButton={{
          title: t("back"),
          action: () => setIsDrawerVisible(false),
        }}
      /> */}
    </>
  );
}

type StatusStyles = {
  present: object;
  absent: object;
  "half-day": object;
  emptyStatus: object;
  [key: string]: object;
};

const styles: StatusStyles & any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background,
    padding: 10,
  },
  workerCard: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors?.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
  },
  workerInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    // flex: 1,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerDetailsContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  workerName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#333",
  },
  workerAddress: {
    fontSize: 13,
    color: "#757575",
    marginTop: 4,
  },
  attendanceSummary: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    // height: "100%",
  },
  attendanceBadge: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    // marginBottom: 6,
  },
  presentBadge: {
    backgroundColor: "#E0F7FA",
  },
  absentBadge: {
    backgroundColor: "#FFEBEE",
  },
  halfDayBadge: {
    backgroundColor: "#FFF3E0",
  },
  attendanceText: {
    fontWeight: "600",
    fontSize: 13,
    color: "#333",
  },
  drawerProfileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  drawerProfileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  drawerWorkerName: {
    fontWeight: "700",
    fontSize: 18,
  },
  drawerWorkerAddress: {
    fontSize: 14,
    color: "#757575",
  },
  drawerHeading: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors?.white,
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: Colors?.gray,
  },
  dateBadge: {
    backgroundColor: "#F0F4FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3E64FF",
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  present: {
    backgroundColor: "#E0F7FA",
  },
  absent: {
    backgroundColor: "#FFEBEE",
  },
  "half-day": {
    backgroundColor: "#FFF3E0",
  },
  emptyStatus: {
    backgroundColor: "#ECEFF1",
  },
  statusText: {
    fontWeight: "600",
    fontSize: 13,
  },
  singleWorkerContainer: {
    // padding: 16,
  },
});

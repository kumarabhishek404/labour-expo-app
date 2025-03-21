import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import ButtonComp from "@/components/inputs/Button";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import CustomText from "@/components/commons/CustomText";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { t } from "@/utils/translationHelper";
import ShowAddress from "@/components/commons/ShowAddress";

export default function AttendanceScreenComponent({
  handleSave,
  generateDates,
  workers,
  attendance,
  setAttendance,
  initialAttendance,
  selectedDate,
  setSelectedDate,
  handleBack
}: any) {

  const workersList = JSON?.parse(workers);




  const handleAttendanceChange = (workerId: any, status: any) => {
    setAttendance((prev: any) => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        [selectedDate?.format("YYYY-MM-DD")]: status,
      },
    }));
  };

  

  return (
    <>
      <CategoryButtons
        type="date"
        selectedDate={selectedDate}
        options={generateDates()}
        onCategoryChanged={setSelectedDate}
      />

      <ScrollView style={styles.workerList}>
        {workersList?.map((worker: any, index: any) => (
          <View key={worker?._id} style={styles.workerCard}>
            <View style={styles.workerInfo}>
              <View style={styles.profileImageContainer}>
                <Text style={styles.workerIndex}>{index + 1}</Text>
                <Image
                  source={{ uri: worker?.profilePicture }}
                  style={styles.profileImage}
                />
              </View>
              <View>
                <Text style={styles.workerName}>{worker?.name}</Text>
                <ShowAddress address={worker?.address} />
                <Text style={styles.workerAddress}>
                  {worker?.address || t("addressNotFound")}
                </Text>
              </View>
            </View>

            <View style={styles.attendanceOptions}>
              {[
                { label: "present", value: "PRESENT" },
                { label: "absent", value: "ABSENT" },
                { label: "halfDay", value: "HALF-DAY" },
              ].map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.attendanceButton,
                    attendance[worker?._id]?.[
                      selectedDate?.format("YYYY-MM-DD")
                    ] === status.value && styles.selectedAttendanceButton,
                  ]}
                  onPress={() =>
                    handleAttendanceChange(worker?._id, status.value)
                  }
                >
                  <CustomText
                    color={
                      attendance[worker?._id]?.[
                        selectedDate?.format("YYYY-MM-DD")
                      ] === status.value
                        ? Colors?.white
                        : Colors?.primary
                    }
                  >
                    {t(status.label)}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footerButtons}>
        <ButtonComp
          isPrimary={true}
          onPress={handleBack}
          title={t("cancel")}
          style={{ width: "35%" }}
          bgColor={Colors?.danger}
          borderColor={Colors?.danger}
        />
        <ButtonComp
          isPrimary={true}
          onPress={handleSave}
          title={t("saveAttendance")}
          style={{ flex: 1 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background,
    padding: 10,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  workerList: {
    marginTop: 8,
    flexGrow: 1,
  },
  workerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: Colors?.white,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  workerInfo: {
    width: "60%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  profileImageContainer: {
    flexDirection: "row",
  },
  workerIndex: {
    marginRight: 8,
    fontWeight: "bold",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  workerName: {
    fontWeight: "600",
  },
  workerAddress: {
    fontSize: 12,
    color: "#757575",
  },
  attendanceOptions: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    gap: 10,
  },
  attendanceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors?.primary,
  },
  selectedAttendanceButton: {
    backgroundColor: Colors?.primary,
  },
  footerButtons: {
    position: "absolute",
    gap: 10,
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

import React, { useState, useEffect } from "react";
import moment from "moment";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import ATTENDANCE from "@/app/api/attendance";
import TOAST from "@/app/hooks/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/commons/Loaders/Loader";
import AttendanceScreenComponent from "./attendanceComponent";
import { StyleSheet, View } from "react-native";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Colors from "@/constants/Colors";

export default function AddAttendance() {
  const [selectedDate, setSelectedDate]: any = useState(moment());
  const [attendance, setAttendance]: any = useState<any>({});
  const [initialAttendance, setInitialAttendance]: any = useState<any>({});
  const { bookingDetails, workers }: any = useLocalSearchParams();
  const router: any = useRouter();

  const workersList: any = JSON?.parse(workers);
  const booking: any = JSON?.parse(bookingDetails);

  const {
    isLoading,
    data: attendanceReport,
    refetch,
    isRefetching,
  }: any = useQuery({
    queryKey: ["bookingDetails", booking?._id],
    queryFn: async (): Promise<any> =>
      await ATTENDANCE?.getAllAttendanceReports(booking?._id),
    retry: false,
    enabled: !!booking?._id,
  });

  const triggerRefetch = async (): Promise<void> => {
    await refetch();
  };

  useEffect(() => {
    const initial: any = {};
    workersList?.forEach((worker: any) => {
      initial[worker?._id] = {};
    });
    setAttendance(initial);
    setInitialAttendance(initial);
  }, [workers]);

  useEffect(() => {
    if (attendanceReport?.report) {
      const reportData: any = {};
      attendanceReport?.report.forEach((worker: any) => {
        const { _id }: any = worker.workerDetails;
        worker?.attendance?.attendanceRecords?.forEach((record: any) => {
          reportData[_id] = reportData[_id] || {};
          reportData[_id][moment(record.date).format("YYYY-MM-DD")] =
            record?.status;
        });
      });
      setAttendance((prev: any) => ({ ...prev, ...reportData }));
      setInitialAttendance((prev: any) => ({ ...prev, ...reportData }));
    }
  }, [attendanceReport]);

  const mutationAddAttendance: any = useMutation({
    mutationKey: ["addAttendance"],
    mutationFn: (formattedAttendance: any): Promise<any> =>
      ATTENDANCE?.addAttendance(booking?._id, formattedAttendance),
    onSuccess: async (response: any) => {
      await triggerRefetch().then(() => {
        TOAST?.success("Attendance updated successfully.");
        router.back();
      });
    },
  });

  const handleSave = (): void => {
    const formattedAttendance: any = Object.entries(attendance).map(
      ([workerId, records]: any) => ({
        workerId,
        date: selectedDate?.format("YYYY-MM-DD"),
        status: records[selectedDate?.format("YYYY-MM-DD")] ?? "",
      })
    );
    mutationAddAttendance.mutate(formattedAttendance);
  };

  const generateDates = (): any => {
    const start: any = moment(booking?.startDate);
    const endOfMonth: any = moment(start).endOf("month");
    const totalDays: any = endOfMonth.diff(start, "days") + 1;

    return Array.from({ length: totalDays }, (_, i: any) =>
      moment(start).add(i, "days")
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: (): any => (
            <CustomHeader
              title={t("addAttendance")}
              left="back"
              onLeftAction={() => router.back()}
            />
          ),
        }}
      />
      <Loader
        loading={isLoading || isRefetching || mutationAddAttendance?.isPending}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: "60%" }}>
            <CustomHeading baseFont={20} textAlign="left">
              {t(booking?.type)}
            </CustomHeading>
            <CustomHeading baseFont={20} textAlign="left">
              {t(booking?.subType)}
            </CustomHeading>
            <CustomText textAlign="left">{booking?.address}</CustomText>
          </View>
          <CustomHeading
            baseFont={20}
            fontWeight="bold"
            color={Colors?.inputLabel}
            style={{ width: "40%" }}
            textAlign="right"
          >
            {selectedDate?.format("MMMM YYYY")}
          </CustomHeading>
        </View>
        <AttendanceScreenComponent
          handleSave={handleSave}
          generateDates={generateDates}
          workers={workers}
          attendance={attendance}
          setAttendance={setAttendance}
          initialAttendance={initialAttendance}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
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
});

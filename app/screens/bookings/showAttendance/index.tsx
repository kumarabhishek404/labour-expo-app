import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ATTENDANCE from "@/app/api/attendance";
import { Stack, useLocalSearchParams } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import ShowAttendanceComponent from "@/app/screens/bookings/showAttendance/ShowAttendance";
import SingleUserAttendanceSkeleton from "@/components/commons/LoadingPlaceholders/Attendance";

export default function ShowAttendance() {
  const { bookingDetails }: any = useLocalSearchParams();

  const booking: any = JSON?.parse(bookingDetails);

  const {
    isLoading,
    data: attendanceReport,
    isRefetching,
  }: any = useQuery({
    queryKey: ["attendanceReport", booking?._id],
    queryFn: async (): Promise<any> =>
      await ATTENDANCE?.getAllAttendanceReports(booking?._id),
    retry: false,
    enabled: !!booking?._id,
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title="showingAttendance"
              left="back"
              right="notification"
            />
          ),
        }}
      />
      {isLoading || isRefetching ? (
        <SingleUserAttendanceSkeleton />
      ) : (
        <ShowAttendanceComponent
          booking={booking}
          attendanceReport={attendanceReport}
        />
      )}
    </>
  );
}

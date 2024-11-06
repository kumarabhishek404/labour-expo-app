import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";

interface RequirementsProps {
  type: String;
  requirements: any;
}

const Requirements = ({ type, requirements }: RequirementsProps) => {
  console.log("Requesr---", requirements);
  
  return (
    <>
      {type === "highlights" ? (
        <View style={styles.container}>
          {requirements?.map((requirement: any, index: number) => (
            <View key={index} style={styles.tag}>
              <CustomHeading
                fontSize={14}
                color={Colors?.white}
                style={{ textTransform: "capitalize" }}
              >
                {requirement?.count} {requirement?.name}
              </CustomHeading>
              <CustomText color={Colors?.white} fontSize={12}>
                ₹ {requirement?.payPerDay} Per Day
              </CustomText>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.requirmentContainer}>
          {requirements?.map((requirement: any, index: number) => {
            return (
              <View style={styles.card} key={index}>
                <View style={styles.header}>
                  <CustomHeading style={{ textTransform: "capitalize" }}>
                    {requirement?.name}
                  </CustomHeading>
                  <CustomText fontSize={14}>
                    ₹ {requirement?.payPerDay} Per Day
                  </CustomText>
                </View>

                <View style={styles.details}>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700">Count</CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.count}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700">Food</CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.food ? "Yes" : "No"}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700">Living</CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.shelterProvider ? "Yes" : "No"}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700">ESI / PF</CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      No
                    </CustomText>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 6,
  },
  requirmentContainer: {
    marginVertical: 10,
    backgroundColor: "#e1e8e5",
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#e1e8e5",
    padding: 15,
    marginBottom: 6,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    marginTop: 8,
  },
  detailBox: {
    flexDirection: "column",
  },
  tag: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Colors?.tertiery,
    borderColor: Colors?.tertiery,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginRight: 5,
    borderWidth: 1,
  },
});

export default Requirements;

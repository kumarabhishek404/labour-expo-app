import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import Farmer1 from "../../assets/farmer1.png";
import Farmer2 from "../../assets/farmer2.png";
import Farmer3 from "../../assets/farmer3.png";
import Farmer4 from "../../assets/farmer4.png";
import Farmer5 from "../../assets/farmer5.png";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";

const HomePageLinks = () => {
  const userDetails = useAtomValue(UserAtom);
  return (
    <View style={styles?.linksContainer}>
      <View style={styles.row}>
        {userDetails?.role === "EMPLOYER" ? (
          <TouchableOpacity
            style={styles.box}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <View style={styles?.firstBoxText}>
              <Text style={styles.title}>My Profile</Text>
              <Text style={styles.subtitle}>Mobile, Fiber and AirFiber</Text>
            </View>
            <View style={styles?.imageContainer}>
              <Image source={Farmer1} style={styles.image} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.box}
            onPress={() => router.push("/(tabs)/workers")}
          >
            <View style={styles?.firstBoxText}>
              <Text style={styles.title}>Services</Text>
              <Text style={styles.subtitle}>Mobile, Fiber and AirFiber</Text>
            </View>
            <View style={styles?.imageContainer}>
              <Image source={Farmer1} style={styles.image} />
            </View>
          </TouchableOpacity>
        )}

        {userDetails?.role === "WORKER" ? (
          <TouchableOpacity
            style={styles.secondBox}
            onPress={() =>
              router.push({
                pathname: "/screens/employer",
                params: {
                  title: "Employers",
                  type: "all",
                },
              })
            }
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
        ) : (
          <TouchableOpacity
            style={styles.secondBox}
            onPress={() =>
              router.push({
                pathname: "/screens/worker",
                params: {
                  title: "Workers",
                  type: "all",
                },
              })
            }
          >
            <View style={styles?.secondBoxText}>
              <Text style={styles.title}>Workers</Text>
              <Text style={[styles.subtitle, { width: 70 }]}>
                Free health check
              </Text>
            </View>
            <View style={styles?.imageContainer}>
              <Image source={Farmer5} style={{ width: 102, height: 75 }} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.secondRow}>
        {userDetails?.role === "MEDIATOR" ? (
          <TouchableOpacity
            style={styles.secondBox}
            onPress={() =>
              router.push({
                pathname: "/screens/employer",
                params: {
                  title: "Employers",
                  type: "all",
                },
              })
            }
          >
            <View style={styles?.secondBoxText}>
              <Text style={styles.title}>Employers</Text>
              <Text style={styles.subtitle}>UPI, Bank, Loan</Text>
            </View>
            <View style={styles?.imageContainer}>
              <Image source={Farmer3} style={styles.secondImage} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.secondBox}
            onPress={() =>
              router.push({
                pathname: "/screens/mediators",
                params: {
                  title: "Mediators",
                  type: "all",
                },
              })
            }
          >
            <View style={styles?.secondBoxText}>
              <Text style={styles.title}>Mediators</Text>
              <Text style={styles.subtitle}>UPI, Bank, Loan</Text>
            </View>
            <View style={styles?.imageContainer}>
              <Image source={Farmer3} style={styles.secondImage} />
            </View>
          </TouchableOpacity>
        )}

        {userDetails?.role === "EMPLOYER" ? (
          <TouchableOpacity
            style={styles.secondBox}
            onPress={() => router?.push("/(tabs)/bookings")}
          >
            <View style={styles?.secondBoxText}>
              <Text style={styles.title}>My Services</Text>
              <Text style={styles.subtitle}>Grocery, Fashion</Text>
            </View>
            <View style={styles?.imageContainer}>
              <Image source={Farmer2} style={{ width: 80, height: 90 }} />
            </View>
          </TouchableOpacity>
        ) : (
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
        )}

        {userDetails?.role === "EMPLOYER" ? (
          <TouchableOpacity
            style={styles.secondBox}
            onPress={() =>
              router.push({
                pathname: "/screens/worker",
                params: {
                  title: "Favourite Workers",
                  type: "favourite",
                },
              })
            }
          >
            <View style={styles?.secondBoxText}>
              <Text style={styles.title}>My Favourite Workers</Text>
              <Text style={[styles.subtitle, { width: 90 }]}>
                Music, TV, Games
              </Text>
            </View>
            <View style={styles?.imageContainer}>
              <Image source={Farmer4} style={{ width: 70, height: 90 }} />
            </View>
          </TouchableOpacity>
        ) : (
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
        )}
      </View>
    </View>
  );
};

export default HomePageLinks;

const styles = StyleSheet.create({
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
});

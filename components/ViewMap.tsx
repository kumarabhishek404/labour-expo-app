import { markers } from "@/constants/mapData";
import { useNavigation } from "expo-router";
import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

const Map = ({ data }: any) => {
  const mapRef: any = useRef();
  const navigation = useNavigation();

  console.log("Map Data--", data);
  
  const focus = () => {
    const Cordinates = {
      latitude: 48.8575,
      longitude: 2.3514,
      latitudeDelta: 2,
      longitudeDelta: 2,
    }

    mapRef.current?.animateCamera({center: Cordinates, zoom: 10}, {duration: 3000})
  }

  const onRegionChange = (region: Region) => {};

  const onCalloutPresses = (ev: any) => {
    console.log("Markerr---", ev);
  };

  const initialRegion = {
    latitude: 28.6448,
    longitude: 77.216721,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={focus}>
        <Text>Focus</Text>
      </TouchableOpacity> */}
      <MapView
        style={{ height: 400, width: 370 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={data?.cordinates || initialRegion}
        showsUserLocation={true}
        showsMyLocationButton
        zoomControlEnabled={true}
        loadingEnabled={true}
        userLocationCalloutEnabled={true}
        onRegionChangeComplete={onRegionChange}
        ref={mapRef}
      >
        <Marker coordinate={data?.cordinates || initialRegion}>
          <Callout onPress={onCalloutPresses}>
            <View style={{ padding: 4 }}>
              <Text style={{ fontSize: 24 }}>{data.location}</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

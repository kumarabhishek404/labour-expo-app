import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import Button from "../inputs/Button";
import CustomText from "./CustomText";

const Map = ({ data }: any) => {
  const mapRef: any = useRef();

  const focus = () => {
    mapRef.current?.animateCamera(
      { center: data, zoom: 10 },
      { duration: 3000 }
    );
  };

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
      <Button
        isPrimary={true}
        title="Focus On Location"
        onPress={focus}
        style={{
          position: "absolute",
          top: 6,
          right: 28,
          width: 140,
          zIndex: 1,
          paddingVertical: 4,
          paddingHorizontal: 8,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
      <MapView
        style={{ height: 400, width: 370, borderRadius: 4 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={data || initialRegion}
        showsUserLocation={true}
        showsMyLocationButton
        zoomControlEnabled={true}
        loadingEnabled={true}
        userLocationCalloutEnabled={true}
        // onRegionChangeComplete={onRegionChange}
        onRegionChange={onRegionChange}
        ref={mapRef}
        // onCalloutPress={() => mapRef.current?.animateCamera({center: data, zoom: 10}, {duration: 3000})}
        // onUserLocationChange={(location) => mapRef.current?.animateCamera({center: data, zoom: 10}, {duration: 3000})}
      >
        <Marker coordinate={data || initialRegion}>
          <Callout onPress={onCalloutPresses}>
            <View style={{ padding: 4 }}>
              <CustomText baseFont={20}>{JSON.stringify(data)}</CustomText>
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
    borderRadius: 8,
  },
});

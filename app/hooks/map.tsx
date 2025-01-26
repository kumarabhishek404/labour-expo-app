import * as Linking from "expo-linking";

// Open Google Maps with directions to the destination
const openGoogleMaps = (destination:any) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`;
  Linking.openURL(url); // Open Google Maps via the URL
};

export default openGoogleMaps;

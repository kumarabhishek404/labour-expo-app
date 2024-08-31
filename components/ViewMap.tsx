// import {
//     Animated,
//     Dimensions,
//     Platform,
//     StyleSheet,
//     Text,
//     View,
//   } from "react-native";
//   import React from "react";
//   import {
//     Fontisto,
//     MaterialCommunityIcons,
//   } from "@expo/vector-icons";
//   import Colors from "@/constants/Colors";
  
//   import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
//   import { markers, mapDarkStyle, mapStandardStyle } from '../constants/mapData';
  
//   const { width, height } = Dimensions.get("window");
//   const CARD_WIDTH = width * 0.8;
//   const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
  
//   const ViewMap = () => {
  
//     const initialMapState = {
//       markers,
//       categories: [
//         { 
//           name: 'Fastfood Center', 
//           icon: <MaterialCommunityIcons style={styles.chipsIcon} name="food-fork-drink" size={18} />,
//         },
//         {
//           name: 'Restaurant',
//           icon: <MaterialCommunityIcons name="food" style={styles.chipsIcon} size={18} />,
//         },
//         {
//           name: 'Dineouts',
//           icon: <MaterialCommunityIcons name="food" style={styles.chipsIcon} size={18} />,
//         },
//         {
//           name: 'Snacks Corner',
//           icon: <MaterialCommunityIcons name="food" style={styles.chipsIcon} size={18} />,
//         },
//         {
//           name: 'Hotel',
//           icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
//         },
//     ],
//       region: {
//         latitude: 22.62938671242907,
//         longitude: 88.4354486029795,
//         latitudeDelta: 0.04864195044303443,
//         longitudeDelta: 0.040142817690068,
//       },
//     };
  
//     const _map = React.useRef(null);
//     const _scrollView = React.useRef(null);
//     const [state, setState] = React.useState(initialMapState);
//     let mapAnimation = new Animated.Value(0);
  
//     const interpolations = state.markers.map((marker:any, index:any) => {
//       const inputRange = [
//         (index - 1) * CARD_WIDTH,
//         index * CARD_WIDTH,
//         ((index + 1) * CARD_WIDTH),
//       ];
  
//       const scale = mapAnimation.interpolate({
//         inputRange,
//         outputRange: [1, 1.5, 1],
//         extrapolate: "clamp"
//       });
  
//       return { scale };
//     });
  
//     const onMarkerPress = (mapEventData:any) => {
//       const markerID = mapEventData._targetInst.return.key;
  
//       let x = (markerID * CARD_WIDTH) + (markerID * 20); 
//       if (Platform.OS === 'ios') {
//         x = x - SPACING_FOR_CARD_INSET;
//       }
//       _scrollView.current.scrollTo({x: x, y: 0, animated: true});
//     }
  
//     return (
//       <>
//         <View>
//           <Text>ASD</Text>
//           <MapView
//             ref={_map}
//             initialRegion={state.region}
//             style={styles.container}
//             provider={PROVIDER_GOOGLE}
//             // customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}
//           >
//             {state.markers.map((marker:any, index:number) => {
//               const scaleStyle = {
//                 transform: [
//                   {
//                     scale: interpolations[index].scale,
//                   },
//                 ],
//               };
//               return (
//                 <Marker
//                   key={index}
//                   coordinate={marker.coordinate}
//                   onPress={(e:any) => onMarkerPress(e)}
//                 >
//                   <Animated.View style={[styles.markerWrap]}>
//                     <Animated.Image
//                       source={require("../assets/images/map_marker.png")}
//                       style={[styles.marker, scaleStyle]}
//                       resizeMode="cover"
//                     />
//                   </Animated.View>
//                 </Marker>
//               );
//             })}
//           </MapView>
//         </View>
//       </>
//     );
//   };
  
//   export default ViewMap;
  
//   const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//       },
//     chipsIcon: {
//       marginRight: 5,
//     },
//     markerWrap: {
//       alignItems: "center",
//       justifyContent: "center",
//       width:50,
//       height:50,
//     },
//     marker: {
//       width: 30,
//       height: 30,
//     },
//   });
  

// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { Marker }  from 'expo-maps';

// export default function MyMap() {
//   const [region, setRegion] = useState({
//     latitude: 37.78825,
//     longitude: -122.4324,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView style={{ flex: 1 }} initialRegion={region}>
//         <Marker coordinate={region} title="Marker Title" description="Marker Description" />
//       </MapView>
//     </View>
//   );
// }

import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: 200,
  },
});

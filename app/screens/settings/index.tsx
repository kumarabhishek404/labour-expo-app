// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Touchable,
//   TouchableOpacity,
//   ScrollView,
//   Button,
// } from "react-native";
// // import { useStateContext } from "../context/context";
// import { router, Stack } from "expo-router";
// import Colors from "@/constants/Colors";
// import { Feather, Ionicons } from "@expo/vector-icons";
// import i18n from '../../../utils/i18n';  // Import the i18n configuration
// import { useLocale } from '../../context/locale';

// const Settings = (props: any) => {
//   // const { state, dispatch }: any = useStateContext();
//   const {locale, setLocale} = useLocale();

//   // const handleChangeLanguages = (locale:any) => {
//   //   i18n.locale = locale;
//   //   setLocale(locale)
//   //   setI18nLocale(locale)
//   // }

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerTransparent: true,
//           headerTitle: "Settings",
//           headerLeft: () => (
//             <TouchableOpacity
//               onPress={() => router.back()}
//               style={{
//                 backgroundColor: "rgba(255, 255, 255, 0.5)",
//                 borderRadius: 10,
//                 padding: 4,
//                 marginRight: 20
//               }}
//             >
//               <View
//                 style={{
//                   backgroundColor: Colors.white,
//                   padding: 6,
//                   borderRadius: 10,
//                 }}
//               >
//                 <Feather name="arrow-left" size={20} />
//               </View>
//             </TouchableOpacity>
//           ),
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => {}}
//               style={{
//                 marginRight: 20,
//                 backgroundColor: Colors.white,
//                 padding: 10,
//                 borderRadius: 10,
//                 shadowColor: "#171717",
//                 shadowOffset: { width: 2, height: 4 },
//                 shadowOpacity: 0.2,
//                 shadowRadius: 3,
//               }}
//             >
//               <Ionicons name="notifications" size={20} color={Colors.black} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <ScrollView style={{ flex: 1 }}>
//         <View
//           style={{
//             flex: 1,
//             alignItems: "center",
//             justifyContent: "center",
//             paddingTop: 100,
//           }}
//         >
//           <Text>Settings</Text>
//           <TouchableOpacity onPress={() => router.push('/screens/settings/changeLanguage')}>
//             <Text>Change Language</Text>
//           </TouchableOpacity>
//           {/* <Button title={"भाषा बदलें"} onPress={() => setLocale('hi')} />
//           <Button title={"Change Language"} onPress={() => setLocale('en')} />
//           <Button title={"भाषा बदला"} onPress={() => setLocale('mr')} />
//           <Button title={"भाषा बदलो"} onPress={() => setLocale('rj')} /> */}
//           {/* <Button onPress={() => handleChangeLanguages('hi')} title="Change Language" /> */}

//           <Text>{i18n.t('welcome')}</Text>
//           <Text>Current Locale: {locale}</Text>
//         </View>
//       </ScrollView>
//     </>
//   );
// };

// export default Settings;


import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // You can use different icons from the Feather, FontAwesome, etc.

export default function SettingsScreen() {
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(false);

  const toggleNotificationSwitch = () => setNotificationsEnabled((prevState) => !prevState);
  const toggleDarkModeSwitch = () => setDarkModeEnabled((prevState) => !prevState);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.settingsItem}>
          <Icon name="bell" size={22} color="#000" />
          <Text style={styles.itemText}>Notification</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotificationSwitch}
            style={styles.switch}
          />
        </View>

        <View style={styles.settingsItem}>
          <Icon name="sun" size={22} color="#000" />
          <Text style={styles.itemText}>Dark Mode</Text>
          <Switch
            value={isDarkModeEnabled}
            onValueChange={toggleDarkModeSwitch}
            style={styles.switch}
          />
        </View>

        <TouchableOpacity style={styles.settingsItem}>
          <Icon name="star" size={22} color="#000" />
          <Text style={styles.itemText}>Rate App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Icon name="share-2" size={22} color="#000" />
          <Text style={styles.itemText}>Share App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Icon name="lock" size={22} color="#000" />
          <Text style={styles.itemText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Icon name="file-text" size={22} color="#000" />
          <Text style={styles.itemText}>Terms and Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Icon name="clipboard" size={22} color="#000" />
          <Text style={styles.itemText}>Cookies Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Icon name="mail" size={22} color="#000" />
          <Text style={styles.itemText}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Icon name="message-square" size={22} color="#000" />
          <Text style={styles.itemText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Icon name="log-out" size={22} color="#000" />
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
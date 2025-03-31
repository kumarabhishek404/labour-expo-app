import Colors from "@/constants/Colors";
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import EmptyPlaceholder from "../../assets/empty-placeholder.png";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import ButtonComp from "../inputs/Button";

const HEADER_HEIGHT = 200; 

const EmptyDataPlaceholder = ({
  title,
  parentHeight,
  leftHeight = HEADER_HEIGHT,
  buttonTitle,
  onPress,
}: any) => {
  const { height } = useWindowDimensions();

  return (
    <View
      style={[
        styles.container,
        { height: (parentHeight ?? height) - leftHeight },
      ]}
    >
      <Image source={EmptyPlaceholder} style={styles.image} />
      <CustomText baseFont={16} fontWeight="medium" color={Colors?.white}>
        {t("notFoundAny", { title: t(title) })}
      </CustomText>

      {buttonTitle && onPress && (
        <ButtonComp
          isPrimary
          title={t(buttonTitle)}
          onPress={onPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

export default EmptyDataPlaceholder;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
  },
  button: {
    marginTop: 15,
    backgroundColor: Colors.tertieryButton,
    borderColor: Colors.tertieryButton,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});

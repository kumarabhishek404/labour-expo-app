import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";

type Props = {
  options: any;
  onCagtegoryChanged: (category: string) => void;
  stylesProp?: object;
};

const CategoryButtons = ({
  options,
  onCagtegoryChanged,
  stylesProp,
}: Props) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [categories, setCategories] = useState(options);
  const scrollRef: any = useRef<ScrollView>(null);
  const itemRef = useRef<any[] | null[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    setCategories(options);
  }, [userDetails]);

  const handleSelectCategory = (index: number) => {
    const selected = itemRef.current[index];
    setActiveIndex(index);
    selected?.measureLayout(
      scrollRef?.current?.getInnerViewRef(),
      (x: any, y: any) => {
        scrollRef.current.scrollTo({
          x: x - width / 2,
          animated: true,
        });
      }
    );

    onCagtegoryChanged(categories[index].value);
  };

  return (
    <View style={stylesProp}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          paddingVertical: 6,
          marginBottom: 3,
        }}
      >
        {categories?.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectCategory(index)}
            style={[
              styles?.categoryBtn,
              activeIndex === index && styles.categoryBtnActive,
            ]}
          >
            <MaterialCommunityIcons
              name={item.iconName as any}
              size={20}
              color={activeIndex === index ? Colors.white : Colors.primary}
            />
            <CustomText
              baseFont={15}
              fontWeight="medium"
              style={
                activeIndex === index
                  ? styles.categoryBtnTxtActive
                  : styles.categoryBtnTxt
              }
            >
              {t(item.label)}
            </CustomText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryButtons;

const styles = StyleSheet.create({
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors?.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryBtnActive: {
    backgroundColor: Colors.primary,
  },
  categoryBtnTxt: {
    marginLeft: 5,
    color: Colors?.primary,
    fontWeight: 600
  },
  categoryBtnTxtActive: {
    marginLeft: 5,
    color: Colors.white,
  },
});

import {
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";
import moment from "moment";

type Props = {
  options?: any;
  onCategoryChanged: any;
  stylesProp?: object;
  type: "workerType" | "date";
  selectedDate?: moment.Moment;
};

const ReusableCategoryComponent = ({
  options = [],
  onCategoryChanged,
  stylesProp,
  type,
  selectedDate,
}: Props) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [items, setItems] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const itemRef = useRef<Array<any | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    let updatedItems = type === "workerType" ? options : options;
    setItems(updatedItems);
  }, [userDetails, type, options]);

  useEffect(() => {
    if (type === "date" && selectedDate && items.length > 0) {
      const defaultIndex = items.findIndex((item) =>
        item.isSame(selectedDate, "day")
      );
      if (defaultIndex >= 0 && defaultIndex !== activeIndex) {
        setActiveIndex(defaultIndex);
        onCategoryChanged(items[defaultIndex]);

        setTimeout(() => {
          const selected = itemRef.current[defaultIndex];
          if (selected && scrollRef.current) {
            selected.measure(
              (
                x: number,
                y: number,
                width: number,
                height: number,
                pageX: number
              ) => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    x: pageX - width / 2,
                    animated: true,
                  });
                }
              }
            );
          }
        }, 100);
      }
    }
  }, [selectedDate, items, type]);

  const handleSelectItem = (index: number) => {
    setActiveIndex(index);
    onCategoryChanged(items[index]);

    setTimeout(() => {
      const selected = itemRef.current[index];
      if (selected && scrollRef.current) {
        selected.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number
          ) => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({
                x: pageX - width / 2,
                animated: true,
              });
            }
          }
        );
      }
    }, 100);
  };

  return (
    <View style={stylesProp}>
      <ScrollView
        ref={(ref) => (scrollRef.current = ref)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerStyle}
      >
        {items.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            disabled={type === "date" ? item?.isAfter(moment()) : false}
            onPress={() => handleSelectItem(index)}
            style={[
              styles.categoryBtn,
              activeIndex === index && styles.categoryBtnActive,
              type === "date" && item?.isAfter(moment()) && { opacity: 0.5 },
            ]}
          >
            {type === "workerType" ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <MaterialCommunityIcons
                  name={item.iconName as any}
                  size={20}
                  color={
                    activeIndex === index ? Colors.white : Colors.tertieryButton
                  }
                />
                <CustomText
                  baseFont={15}
                  fontWeight="medium"
                  color={
                    activeIndex === index ? Colors.white : Colors.tertieryButton
                  }
                >
                  {t(item.label)}
                </CustomText>
              </View>
            ) : (
              <View style={{ flexDirection: "column" }}>
                <CustomText
                  baseFont={16}
                  fontWeight="600"
                  color={
                    activeIndex === index ? Colors.white : Colors.tertieryButton
                  }
                >
                  {item.format("DD")}
                </CustomText>
                <CustomText
                  baseFont={16}
                  fontWeight="600"
                  color={
                    activeIndex === index ? Colors.white : Colors.tertieryButton
                  }
                >
                  {t(item.format("dddd"))}
                </CustomText>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ReusableCategoryComponent;

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 6,
    marginBottom: 3,
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors?.tertieryButton,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBtnActive: {
    backgroundColor: Colors.tertieryButton,
  },
});

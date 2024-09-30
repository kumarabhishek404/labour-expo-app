import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import allCategories from "@/data/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";

type Props = {
  type: string;
  onCagtegoryChanged: (category: string) => void;
  stylesProp: object
};

const CategoryButtons = ({ type, onCagtegoryChanged, stylesProp }: Props) => {
  const userDetails = useAtomValue(UserAtom);
  const [categories, setCategories] = useState(allCategories[type]);
  const scrollRef: any = useRef<ScrollView>(null);
  const itemRef = useRef<TouchableOpacity[] | null[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setCategories(allCategories[type]);
  }, [userDetails]);

  const handleSelectCategory = (index: number) => {
    const selected = itemRef.current[index];
    setActiveIndex(index);
    selected?.measureLayout(scrollRef?.current?.getInnerViewRef(), (x, y) => {
      scrollRef.current.scrollTo({
        x,
        animated: true,
      });
    });

    onCagtegoryChanged(categories[index].title);
  };

  return (
    <View style={stylesProp}>
      {/* <Text style={styles.title}>
        {userDetails?.role === "Employer" ? "Workers" : "Services"}
      </Text> */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          paddingVertical: 10,
          marginBottom: 10,
        }}
      >
        {categories.map((item:any, index:number) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectCategory(index)}
            style={
              activeIndex === index
                ? styles.categoryBtnActive
                : styles.categoryBtn
            }
          >
            <MaterialCommunityIcons
              name={item.iconName as any}
              size={20}
              color={activeIndex === index ? Colors.white : Colors.black}
            />
            <Text
              style={
                activeIndex === index
                  ? styles.categoryBtnTxtActive
                  : styles.categoryBtnTxt
              }
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryButtons;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.black,
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryBtnActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryBtnTxt: {
    marginLeft: 5,
    color: Colors.black,
  },
  categoryBtnTxtActive: {
    marginLeft: 5,
    color: Colors.white,
  },
});

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { SelectList } from "react-native-dropdown-select-list";

const DropdownNew = () => {
  const [selected, setSelected] = React.useState("");

  console.log("----", selected);

  const data = [
    { key: "1", value: "Mobiles", disabled: true },
    { key: "2", value: "Appliances" },
    { key: "3", value: "Cameras" },
    { key: "4", value: "Computers", disabled: true },
    { key: "5", value: "Vegetables" },
    { key: "6", value: "Diary Products" },
    { key: "7", value: "Drinks" },
  ];

  return (
    <SelectList
      onSelect={() => console.log("selefte4 valiu===")}
      setSelected={setSelected}
      fontFamily="lato"
      data={data}
      arrowicon={<FontAwesome name="chevron-down" size={12} color={"black"} />}
      searchicon={<FontAwesome name="search" size={12} color={"black"} />}
      search={false}
      boxStyles={{ borderRadius: 0 }} //override default styles
      defaultOption={{ key: "1", value: "Jammu & Kashmir" }} //default selected option
    />
  );
};

export default DropdownNew;

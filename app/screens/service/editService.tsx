import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAtom } from "jotai";
import { AddServiceAtom, AddServiceInProcess } from "@/app/AtomStore/user";
import TextInputComponent from "@/components/TextInputWithIcon";

interface WorkInfoProps {}

const EditService: React.FC<WorkInfoProps> = () => {
  const [isAddService, setIsAddService] = useAtom(AddServiceInProcess);
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const [title, setTitle] = useState<string>(addService?.name ?? "");
  const [description, setDescription] = useState<string>(
    addService?.description ?? ""
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles?.formContainer}>
        <TextInputComponent
          label="Work Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter Work Title"
        />
        <TextInputComponent
          label="Work Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter Work Description"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 10,
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    // paddingHorizontal: 10,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    // padding: 20,
  },
});

export default EditService;

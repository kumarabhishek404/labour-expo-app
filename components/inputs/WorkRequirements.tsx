import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Counter from "@/components/inputs/Counter";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { filterWorkerTypes } from "@/constants/functions";
import { t } from "@/utils/translationHelper";
import TextInputComponent from "./TextInputWithIcon";
import { getDynamicWorkerType } from "@/utils/i18n";

interface Props {
  type: string;
  subType: string;
  value: any[];
  onChange: (data: any[]) => void;
}

export default function WorkerRequirementSelector({
  type,
  subType,
  value,
  onChange,
}: Props) {
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const workerTypes = filterWorkerTypes(type, subType) || [];

  const selectedNames = value?.map((v) => v.name);
  const availableWorkers = workerTypes.filter(
    (w: any) => !selectedNames.includes(w.value),
  );

  const openPopup = (worker: any) => {
    setSelectedWorker(worker);
    setCount(1);
    setPrice("0");
  };

  const saveWorker = () => {
    const newData = [
      ...value,
      {
        name: selectedWorker.value,
        count,
        payPerDay: parseInt(price),
      },
    ];
    onChange(newData);
    setSelectedWorker(null);
  };

  const removeWorker = (name: string) => {
    onChange(value.filter((v) => v.name !== name));
  };

  const sentence = (item: any) =>
    `${item.count} ${getDynamicWorkerType(item?.name, item.count)} ${t("workersNeeded")} ${item.payPerDay ? `₹${item.payPerDay}` : ""} ${
      item.payPerDay ? t("perDay") : ""
    }`;

  return (
    <View style={{ gap: 18 }}>
      {/* ✅ Selected Workers */}
      {value?.length > 0 && (
        <View>
          <Text style={styles.heading}>{t("selectedWorkers")}</Text>

          {value?.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.selectedCard}
              onPress={() => removeWorker(item?.name)}
            >
              <Text style={styles.selectedText}>{sentence(item)}</Text>
              <Text style={styles.remove}>{t("remove")}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ✅ Available Workers */}
      <Text style={styles.heading}>{t("tapToAddWorkers")}</Text>

      <View style={styles.grid}>
        {availableWorkers.map((worker: any) => (
          <TouchableOpacity
            key={worker.value}
            style={styles.card}
            onPress={() => openPopup(worker)}
          >
            <Text style={styles.cardText}>{worker.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ POPUP */}
      <Modal visible={!!selectedWorker} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {t("enterDetailsFor")} {selectedWorker?.label}
            </Text>

            <Counter label="count" counter={count} setCounter={setCount} />

            <TextInputComponent
              name="payPerDay"
              label="pricePerDay"
              value={price}
              placeholder={t("enterPayPerDay")}
              type="number"
              onChangeText={setPrice}
              style={{ marginVertical: 30 }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                title={t("cancel")}
                isPrimary={false}
                onPress={() => setSelectedWorker(null)}
                style={{ flex: 1 }}
              />
              <Button
                title={t("save")}
                isPrimary
                onPress={saveWorker}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: "600" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  card: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardText: { fontSize: 15 },

  selectedCard: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    marginBottom: 10,
  },
  selectedText: { fontSize: 15, fontWeight: "600" },
  remove: { color: "red", marginTop: 4 },

  modalBg: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    gap: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { t } from "@/utils/translationHelper";

type Role = "WORKER" | "EMPLOYER" | "MEDIATOR";

interface Props {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
}

export default function RoleSwitcherPopup({ currentRole, onChangeRole }: Props) {
  const [visible, setVisible] = useState(false);

  const roles: { key: Role; emoji: string; title: string; subtitle: string }[] = [
    {
      key: "WORKER",
      emoji: "👷",
      title: t("worker"),
      subtitle: t("workerSubtitle") || "Find work and manage your tasks easily",
    },
    {
      key: "EMPLOYER",
      emoji: "🧑‍💼",
      title: t("employer"),
      subtitle: t("employerSubtitle") || "Post jobs and hire workers quickly",
    },
    {
      key: "MEDIATOR",
      emoji: "🤝",
      title: t("mediator"),
      subtitle: t("mediatorSubtitle") || "Connect workers and employers efficiently",
    },
  ];

  const selectedRole = roles.find((r) => r.key === currentRole);

  return (
    <>
      {/* ===== Role Selector ===== */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.selectorLabel}>{t("yourRole")}</Text>
        <View style={styles.roleRow}>
          <Text style={styles.selectorValue}>
            {selectedRole?.emoji} {selectedRole?.title}
          </Text>
          <AntDesign name="down" size={20} color="#333" style={{ marginLeft: 8 }} />
        </View>
      </TouchableOpacity>

      {/* ===== Modal ===== */}
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Text style={styles.heading}>{t("changeRole")}</Text>
                <Text style={styles.subHeading}>{t("selectRole")}</Text>

                {roles.map((role) => {
                  const selected = currentRole === role.key;

                  return (
                    <TouchableOpacity
                      key={role.key}
                      style={[styles.card, selected && styles.selectedCard]}
                      onPress={() => {
                        onChangeRole(role.key);
                        setVisible(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.emoji}>{role.emoji}</Text>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{role.title}</Text>
                        <Text style={styles.subtitle}>{role.subtitle}</Text>
                      </View>

                      {selected && <AntDesign name="check" size={24} color="#4CAF50" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    padding: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectorLabel: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectorValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  selectedCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  emoji: {
    fontSize: 36,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
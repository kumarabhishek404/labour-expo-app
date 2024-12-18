import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ModalComponent from "./Modal";
import { useAtom, useSetAtom } from "jotai";
import { AccountStatusAtom, UserAtom } from "@/app/AtomStore/user";
import { toast } from "@/app/hooks/toast";
import Loader from "./Loader";
import { FontAwesome } from "@expo/vector-icons";
import CustomHeading from "./CustomHeading";
import Colors from "@/constants/Colors";
import CustomText from "./CustomText";
import Button from "../inputs/Button";
import { t } from "@/utils/translationHelper";

const InactiveAccountMessage = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const setIsAccountInactive = useSetAtom(AccountStatusAtom);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const restoreAccount = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(t("successfullyActivateMessage"));
      setModalVisible(false);
      setIsAccountInactive(false);
      setUserDetails({
        ...userDetails,
        status: "active",
      });
    }, 3000);
  };

  const modalContent = () => (
    <View style={styles.modalContentContainer}>
      <CustomHeading>{t("inactiveModalHeading")}</CustomHeading>
      <CustomText fontSize={14}>{t("inactiveModalMessage")}</CustomText>
    </View>
  );

  return (
    <>
      <Loader loading={isLoading} />
      <View style={styles.container}>
        <View style={styles.gradientBackground}>
          <FontAwesome name="exclamation-circle" size={80} color="#fff" />
          <CustomHeading fontSize={20} color={Colors?.white}>
            {t("inactiveHeading")}
          </CustomHeading>
          <CustomText color={Colors?.white} fontSize={14}>
            {t("inactiveMessage")}
          </CustomText>

          <Button
            isPrimary={true}
            title={t("restoreAccountButton")}
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: Colors?.white,
              borderColor: Colors?.white,
            }}
            textColor={Colors?.danger}
          />
        </View>

        <ModalComponent
          visible={isModalVisible}
          title={t("inactiveModalTitle")}
          onClose={() => setModalVisible(false)}
          content={modalContent}
          primaryButton={{
            title: t("activateAccountButton"),
            action: restoreAccount,
            styles: { paddingHorizontal: 0 },
          }}
          secondaryButton={{
            title: t("cancel"),
            action: () => setModalVisible(false),
            styles: { paddingHorizontal: 0 },
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  gradientBackground: {
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: Colors?.danger,
    gap: 10,
  },
  iconContainer: {
    marginBottom: 10,
  },
  message: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subMessage: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },
  restoreButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  restoreButtonText: {
    color: "#ff4757",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContentContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default InactiveAccountMessage;

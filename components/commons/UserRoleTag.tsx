import Colors from "@/constants/Colors";
import {
  resolveDisplayUserRole,
  roleToTranslationKey,
  type AppUserRole,
} from "@/utils/resolveDisplayUserRole";
import { t } from "@/utils/translationHelper";
import React from "react";
import { StyleSheet, View } from "react-native";
import CustomText from "./CustomText";

type Props = {
  /** Raw user / list item — role resolved with `resolveDisplayUserRole` unless overridden */
  user: { role?: unknown; skills?: unknown };
  /** Skip inference and show this role (optional) */
  roleOverride?: AppUserRole;
  variant?: "compact" | "prominent";
};

const UserRoleTag: React.FC<Props> = ({
  user,
  roleOverride,
  variant = "compact",
}) => {
  const role = roleOverride ?? resolveDisplayUserRole(user);
  const labelKey = roleToTranslationKey(role);
  const prominent = variant === "prominent";

  return (
    <View style={[styles.tag, prominent ? styles.tagProminent : styles.tagCompact]}>
      <CustomText
        baseFont={15}
        fontWeight="800"
        color={Colors.white}
        style={styles.tagText}
      >
        {t(labelKey)}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: Colors.tertiery,
    borderWidth: 1,
    borderColor: Colors.tertiery,
  },
  tagCompact: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tagProminent: {
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  tagText: {
    color: Colors.white,
  },
});

export default UserRoleTag;

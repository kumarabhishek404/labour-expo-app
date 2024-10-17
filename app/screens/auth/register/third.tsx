import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import Stepper from "@/app/(tabs)/addService/stepper";
import { MEDIATORTYPES, REGISTERSTEPS, WORKERSKILLS } from "@/constants";
import SkillsSelector from "@/components/SelectSkills";
import RoleSelection from "@/components/SelectRole";
import { Controller, useForm } from "react-hook-form";

interface ThirdScreenProps {
  setStep: any;
  role: any;
  setRole: any;
  // labourType: string;
  // setLabourType: any;
  selectedInterests: any;
  setSelectedInterests: any;
}

const ThirdScreen: React.FC<ThirdScreenProps> = ({
  setStep,
  role,
  setRole,
  // labourType,
  // setLabourType,
  selectedInterests,
  setSelectedInterests,
}: ThirdScreenProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: role,
      interest: selectedInterests,
    },
  });

  const [previousRole, setPreviousRole] = useState({
    name: "",
    type: "",
  });
  React.useEffect(() => {
    if (
      previousRole?.name !== watch("role")?.name ||
      (previousRole?.name === watch("role")?.name &&
        previousRole?.type !== watch("role")?.type)
    ) {
      setValue("interest", []);
    }
    setPreviousRole({ ...watch("role") });
  }, [watch("role")]);

  const onSubmit = (data: any) => {
    setRole(data?.role);
    setSelectedInterests(data?.interest);
    setStep(4);
  };

  return (
    <>
      <View style={{ marginBottom: 20 }}>
        <Stepper currentStep={3} steps={REGISTERSTEPS} />
      </View>
      <View style={{ flexDirection: "column", gap: 20 }}>
        <Controller
          control={control}
          name="role"
          rules={{
            required: false,
            // required: "Select at least one skill",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <RoleSelection
              role={value}
              setRole={onChange}
              onBlur={onBlur}
              // labourType={labourType}
              // setLabourType={setLabourType}
            />
          )}
        />

        {watch("role")?.name === "WORKER" && watch("role")?.type === "ONE" && (
          <Controller
            control={control}
            name="interest"
            defaultValue=""
            rules={{
              required: false,
              // required: "Select at least one skill",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SkillsSelector
                name="interest"
                selectedInterests={value}
                setSelectedInterests={onChange}
                availableOptions={WORKERSKILLS}
                onBlur={onBlur}
                errors={errors}
              />
            )}
          />
        )}

        {watch("role")?.name === "WORKER" && watch("role")?.type === "ORG" && (
          <Controller
            control={control}
            name="interest"
            defaultValue=""
            rules={{
              required: false,
              // required: "Select at least one option",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SkillsSelector
                name="interest"
                selectedInterests={value}
                setSelectedInterests={onChange}
                availableOptions={MEDIATORTYPES}
                onBlur={onBlur}
                errors={errors}
              />
            )}
          />
        )}
      </View>
      <View style={styles?.buttonContainer}>
        <Button isPrimary={false} title="Back" onPress={() => setStep(2)} />
        <Button
          isPrimary={true}
          title="Save And Next"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 40,
  },

  label: {
    marginVertical: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },

  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    // fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 20,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
});

export default ThirdScreen;

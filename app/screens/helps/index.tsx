import Chat from "@/components/commons/Chat";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import YouTubePlayer from "@/components/commons/VideoPlayer";
import Button from "@/components/inputs/Button";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import { FAQS_QUESTIONS, FAQS_SUPPORT, FAQS_TOPICS } from "@/constants";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import {
  Feather,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  Linking,
} from "react-native";

type RenderItemTypes = {
  item: {
    id: string;
    title: string;
    articles: string;
    icon: string;
    questions: any[];
  };
  index: number;
};

const HelpScreen = () => {
  const [openSections, setOpenSections]: any = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [chatVisible, setChatVisible] = useState(false);

  const toggleSection = (id: any) => {
    setOpenSections((prevSections: any) => ({ [id]: !prevSections[id] }));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const filteredQuestions = FAQS_QUESTIONS.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => (
    <View key={item.id} style={styles.questionContainer}>
      <TouchableOpacity
        onPress={() => toggleSection(item.id)}
        style={styles.topicCard}
      >
        <CustomHeading baseFont={30}>{item.icon}</CustomHeading>
        <View style={styles.topicTextContainer}>
          <CustomHeading textAlign="left">{item.title}</CustomHeading>
          <CustomText textAlign="left">{item.articles}</CustomText>
        </View>
        <View>
          {openSections[item.id] ? (
            <Feather name="arrow-down" size={26} color={Colors.secondary} />
          ) : (
            <Feather name="arrow-right" size={26} color={Colors.secondary} />
          )}
        </View>
      </TouchableOpacity>
      {openSections[item.id] && (
        <View style={styles.answerContainer}>
          {FAQS_QUESTIONS.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal(item)}
              style={styles.questionButton}
            >
              <CustomText baseFont={14}>{item.question}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  ));

  const openModal = (question: any) => {
    setSelectedQuestion(question);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedQuestion(null);
  };

  RenderItem.displayName = "RenderItem";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader title="helps" left="back" right="notification" />
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.contactBox}>
          <Foundation name="telephone" size={52} color={Colors?.primary} />
          <View style={styles.contactTextContainer}>
            <CustomHeading textAlign="left">
              {t("our24x7CustomerService")}
            </CustomHeading>
            <TouchableOpacity onPress={() => Linking.openURL("tel:6397308499")}>
              <CustomText textAlign="left" baseFont={16} color={Colors?.link}>
                6397308499
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contactBox}>
          <MaterialCommunityIcons
            name="email"
            size={40}
            color={Colors?.primary}
          />
          <View style={styles.contactTextContainer}>
            <CustomHeading textAlign="left">{t("writeUsAt")}</CustomHeading>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("mailto:fastag.recharge@support.com")
              }
            >
              <CustomText textAlign="left" baseFont={16} color={Colors?.link}>
                ak7192837@gmail.com
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInputComponent
            value={searchQuery}
            placeholder={t("search")}
            onChangeText={handleSearch}
            label="haveAQuestion"
            name="search"
          />
        </View>

        {searchQuery.length > 0 && (
          <View style={styles.filteredQuestionsContainer}>
            {filteredQuestions.map((q, index) => (
              <TouchableOpacity
                key={index}
                style={styles.questionButton}
                onPress={() => openModal(q)}
              >
                <CustomHeading baseFont={14}>{q.question}</CustomHeading>
              </TouchableOpacity>
            ))}
            {filteredQuestions.length === 0 && (
              <CustomText>{t("noResultsFound")}</CustomText>
            )}
          </View>
        )}
        <View style={styles.sectionHeader}>
          <CustomHeading>{t("frequentlyAskedQuestions")}</CustomHeading>
        </View>

        <View>
          <FlatList
            data={FAQS_SUPPORT ?? []}
            renderItem={({ item, index }: any) => (
              <TouchableOpacity
                key={index}
                style={styles.faqCard}
                onPress={() => openModal(item)}
              >
                <CustomHeading baseFont={30} style={{ marginBottom: 10 }}>
                  {item.icon}
                </CustomHeading>
                <CustomText
                  textAlign="left"
                  baseFont={14}
                  color={Colors?.white}
                  style={{ maxWidth: 200 }}
                >
                  {item.question}
                </CustomText>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?.id?.toString()}
            onEndReachedThreshold={0.2}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={3}
            removeClippedSubviews={true}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.sectionHeader}>
          <CustomHeading>Topics</CustomHeading>
        </View>

        <View style={{ marginBottom: 50 }}>
          {FAQS_TOPICS.map((item, index) => (
            <RenderItem key={item.id} item={item} index={index} />
          ))}
        </View>

        {selectedQuestion && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <CustomHeading textAlign="left">
                    {selectedQuestion.question}
                  </CustomHeading>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeIconContainer}
                  >
                    <Feather name="x" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <YouTubePlayer videoId="UrIaQbIK2E4" />
              </View>
            </View>
          </Modal>
        )}

        {/* <View style={styles?.startConversation}>
          <Button
            isPrimary={true}
            title={t("startAConversation")}
            onPress={() => setChatVisible(true)}
            style={styles.startConversationButton}
            textStyle={styles.startConversationText}
          />
        </View> */}

        {/* <Chat chatVisible={chatVisible} setChatVisible={setChatVisible} /> */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.fourth,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contactBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  contactTextContainer: {
    marginLeft: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  filteredQuestionsContainer: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  faqCard: {
    backgroundColor: Colors?.tertieryButton,
    borderRadius: 8,
    padding: 10,
    minWidth: 180,
    maxWidth: 240,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  topicCard: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  topicTextContainer: {
    flex: 1,
  },
  startConversation: {
    width: "100%",
    position: "absolute",
    bottom: -10,
    left: 20,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  startConversationButton: {
    width: "90%",
    backgroundColor: Colors?.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  startConversationText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  questionContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  questionButton: {
    paddingHorizontal: 8,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answerContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0",
  },
  arrow: {
    fontSize: 18,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 8,
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  closeIconContainer: {
    alignSelf: "flex-end",
  },
});

export default HelpScreen;

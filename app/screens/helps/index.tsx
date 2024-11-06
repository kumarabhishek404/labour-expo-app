import Chat from "@/components/commons/Chat";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import Button from "@/components/inputs/Button";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Video } from "expo-av";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
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
  const faqs = [
    { id: 1, question: "How do I cancel an existing order?", icon: "📦" },
    { id: 2, question: "What are the other shipping options?", icon: "🚚" },
    { id: 3, question: "Where is my package?", icon: "🔍" },
  ];

  const topics = [
    {
      id: 1,
      title: "Returns and Refunds",
      articles: "12 articles",
      icon: "📦",
      questions: [
        {
          id: 1,
          question: "How to stop scooter for some time?",
          answer: "Tap the pause button on the screen.",
        },
        {
          id: 2,
          question: "Where can I leave the scooter?",
          answer: "Park it at a safe place, away from traffic.",
        },
        {
          id: 3,
          question: "How to stop using the scooter?",
          answer: "Tap on 'End Ride' when you're done.",
        },
        {
          id: 4,
          question: "Where is my scooter?",
          answer: "Check the map in the app for the location.",
        },
        {
          id: 5,
          question: "I got hurt or damaged the scooter",
          answer: "Call support immediately or use the app to report.",
        },
        {
          id: 6,
          question: "Something else",
          answer: "Contact our support for other issues.",
        },
      ],
    },
    {
      id: 2,
      title: "Shipping and Delivery",
      articles: "8 articles",
      icon: "🚚",
      questions: [
        {
          id: 1,
          question: "How to stop scooter for some time?",
          answer: "Tap the pause button on the screen.",
        },
        {
          id: 2,
          question: "Where can I leave the scooter?",
          answer: "Park it at a safe place, away from traffic.",
        },
        {
          id: 3,
          question: "How to stop using the scooter?",
          answer: "Tap on 'End Ride' when you're done.",
        },
        {
          id: 4,
          question: "Where is my scooter?",
          answer: "Check the map in the app for the location.",
        },
        {
          id: 5,
          question: "I got hurt or damaged the scooter",
          answer: "Call support immediately or use the app to report.",
        },
        {
          id: 6,
          question: "Something else",
          answer: "Contact our support for other issues.",
        },
      ],
    },
    {
      id: 3,
      title: "Payments",
      articles: "6 articles",
      icon: "💳",
      questions: [
        {
          id: 1,
          question: "How to stop scooter for some time?",
          answer: "Tap the pause button on the screen.",
        },
        {
          id: 2,
          question: "Where can I leave the scooter?",
          answer: "Park it at a safe place, away from traffic.",
        },
        {
          id: 3,
          question: "How to stop using the scooter?",
          answer: "Tap on 'End Ride' when you're done.",
        },
        {
          id: 4,
          question: "Where is my scooter?",
          answer: "Check the map in the app for the location.",
        },
        {
          id: 5,
          question: "I got hurt or damaged the scooter",
          answer: "Call support immediately or use the app to report.",
        },
        {
          id: 6,
          question: "Something else",
          answer: "Contact our support for other issues.",
        },
      ],
    },
  ];

  const questions = [
    {
      id: 1,
      question: "How to stop scooter for some time?",
      answer: "Tap the pause button on the screen.",
    },
    {
      id: 2,
      question: "Where can I leave the scooter?",
      answer: "Park it at a safe place, away from traffic.",
    },
    {
      id: 3,
      question: "How to stop using the scooter?",
      answer: "Tap on 'End Ride' when you're done.",
    },
    {
      id: 4,
      question: "Where is my scooter?",
      answer: "Check the map in the app for the location.",
    },
    {
      id: 5,
      question: "I got hurt or damaged the scooter",
      answer: "Call support immediately or use the app to report.",
    },
    {
      id: 6,
      question: "Something else",
      answer: "Contact our support for other issues.",
    },
  ];

  const toggleSection = (id: any) => {
    setOpenSections((prevSections: any) => ({
      ...prevSections,
      [id]: !prevSections[id],
    }));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => (
    <View key={item.id} style={styles.questionContainer}>
      <TouchableOpacity
        onPress={() => toggleSection(item.id)}
        style={styles.topicCard}
      >
        <CustomHeading fontSize={30}>{item.icon}</CustomHeading>
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
          {questions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal(item)}
              style={styles.questionButton}
            >
              <CustomText fontSize={14}>{item.question}</CustomText>
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

  const renderItem = ({ item, index }: any) => (
    <RenderItem index={index} item={item} />
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Helps" left="back" />,
        }}
      />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInputComponent
            value={searchQuery}
            placeholder="Search for topics or questions..."
            onChangeText={handleSearch}
            label="Have a burning question? 🔥"
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
                <CustomHeading fontSize={14}>{q.question}</CustomHeading>
              </TouchableOpacity>
            ))}
            {filteredQuestions.length === 0 && (
              <CustomText>No results found</CustomText>
            )}
          </View>
        )}
        <View style={styles.sectionHeader}>
          <CustomHeading>Frequently Asked</CustomHeading>
          <TouchableOpacity>
            <CustomHeading color={Colors?.link} fontSize={14}>
              View All
            </CustomHeading>
          </TouchableOpacity>
        </View>

        <View>
          <FlatList
            data={faqs ?? []}
            renderItem={({ item, index }: any) => (
              <TouchableOpacity
                key={index}
                style={styles.faqCard}
                onPress={() => openModal(item)}
              >
                <CustomHeading fontSize={30}>{item.icon}</CustomHeading>
                <CustomText fontSize={14}>{item.question}</CustomText>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?.id?.toString()}
            // onEndReached={debounce(loadMore, 300)} // Trigger load more when user scrolls to bottom
            onEndReachedThreshold={0.9}
            // ListFooterComponent={() =>
            //   isFetchingNextPage ? (
            //     <ActivityIndicator
            //       size="large"
            //       color={Colors?.primary}
            //       style={styles.loaderStyle}
            //     />
            //   ) : null
            // }
            // getItemLayout={(data, index) => ({
            //   length: 200,
            //   offset: 200 * index,
            //   index,
            // })}
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
          <TouchableOpacity>
            <CustomHeading color={Colors?.link} fontSize={14}>
              View All
            </CustomHeading>
          </TouchableOpacity>
        </View>

        <FlatList
          data={topics ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id?.toString()}
          // onEndReached={debounce(loadMore, 300)} // Trigger load more when user scrolls to bottom
          onEndReachedThreshold={0.9}
          // ListFooterComponent={() =>
          //   isFetchingNextPage ? (
          //     <ActivityIndicator
          //       size="large"
          //       color={Colors?.primary}
          //       style={styles.loaderStyle}
          //     />
          //   ) : null
          // }
          getItemLayout={(data, index) => ({
            length: 200,
            offset: 200 * index,
            index,
          })}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={3}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
        />

        {selectedQuestion && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeIconContainer}
                >
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
                <CustomHeading textAlign="left">
                  {selectedQuestion.question}
                </CustomHeading>
                <CustomText fontSize={14} textAlign="left">
                  {selectedQuestion.answer}
                </CustomText>

                {/* Video Player */}
                <Video
                  source={{ uri: "https://youtu.be/nFgsBxw-zWQ" }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  // resizeMode={"cover"}
                  shouldPlay={true}
                  useNativeControls
                  style={styles.videoPlayer}
                />

                {/* Image Section */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: "https://thumbs.dreamstime.com/b/help-wanted-vector-clip-art-31368648.jpg",
                    }}
                    style={styles.modalImage}
                  />
                  <Image
                    source={{
                      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWLxLohqKFddXcpZgU57idshaJpixaiy4Qsg&s",
                    }}
                    style={styles.modalImage}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}

        <View style={styles?.startConversation}>
          <Button
            isPrimary={true}
            title="Start a conversation"
            onPress={() => setChatVisible(true)}
            style={styles.startConversationButton}
            textStyle={styles.startConversationText}
          />
        </View>

        <Chat chatVisible={chatVisible} setChatVisible={setChatVisible} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 20,
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
    backgroundColor: "#F0F4FF",
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
    bottom: 20,
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
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
  },
  closeIconContainer: {
    alignSelf: "flex-end",
  },
  videoPlayer: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default HelpScreen;

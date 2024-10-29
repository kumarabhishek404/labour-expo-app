import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Video } from "expo-av";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  KeyboardAvoidingView,
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
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

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

  // Simplified questions and respective content for rural audiences
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

  // Function to handle search input changes
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Function to filter questions based on the search query
  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RenderItem: any = React.memo(({ item }: RenderItemTypes) => (
    <View key={item.id} style={styles.questionContainer}>
      <TouchableOpacity
        onPress={() => toggleSection(item.id)}
        style={styles.topicCard}
      >
        <Text style={styles.topicIcon}>{item.icon}</Text>
        <View style={styles.topicTextContainer}>
          <Text style={styles.topicTitle}>{item.title}</Text>
          <Text style={styles.topicArticles}>{item.articles}</Text>
        </View>
        <Text style={styles.arrow}>
          {openSections[item.id] ? (
            <Feather name="arrow-down" size={30} color={Colors.secondary} />
          ) : (
            <Feather name="arrow-right" size={30} color={Colors.secondary} />
          )}
        </Text>
      </TouchableOpacity>
      {openSections[item.id] && (
        <View style={styles.answerContainer}>
          {questions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal(item)}
              style={styles.questionButton}
            >
              <Text style={styles.questionText}>{item.question}</Text>
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
      setNewMessage("");
    }
  };

  const renderItem = ({ item, index }: any) => (
    <RenderItem index={index} item={item} />
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Helps",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.header}>Have a burning question? 🔥</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for topics or questions..."
            placeholderTextColor="#999"
            onChangeText={handleSearch}
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
                <Text style={styles.questionText}>{q.question}</Text>
              </TouchableOpacity>
            ))}
            {filteredQuestions.length === 0 && (
              <Text style={styles.noResultsText}>No results found</Text>
            )}
          </View>
        )}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Frequently Asked</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={faqs ?? []}
          renderItem={({ item, index }: any) => (
            <TouchableOpacity
              key={index}
              style={styles.faqCard}
              onPress={() => openModal(item)}
            >
              <Text style={styles.faqIcon}>{item.icon}</Text>
              <Text style={styles.faqText}>{item.question}</Text>
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Topics</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
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
                <Text style={styles.modalHeading}>
                  {selectedQuestion.question}
                </Text>
                <Text style={styles.modalParagraph}>
                  {selectedQuestion.answer}
                </Text>

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

        <TouchableOpacity
          style={styles.startConversationButton}
          onPress={() => setChatVisible(true)}
        >
          <Text style={styles.startConversationText}>Start a conversation</Text>
        </TouchableOpacity>

        {/* Chat Screen Modal */}
        <Modal
          visible={chatVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setChatVisible(false)}
        >
          <KeyboardAvoidingView
            behavior="height"
            style={styles.chatModalContainer}
          >
            <View style={styles.chatScreen}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>Chat with Support</Text>
                <TouchableOpacity onPress={() => setChatVisible(false)}>
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {/* Chat Messages */}
              <ScrollView style={styles.chatMessagesContainer}>
                {messages.map((message, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageContainer,
                      message.id === 1
                        ? styles.incomingMessage
                        : styles.outgoingMessage,
                    ]}
                  >
                    <Text style={styles.messageText}>{message.text}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* Chat Input */}
              <View style={styles.chatInputContainer}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChangeText={setNewMessage}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendMessage}
                >
                  <Feather name="send" size={24} color="#007BFF" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
  },
  filteredQuestionsContainer: {
    marginBottom: 10,
  },
  noResultsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAll: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
  },
  faqContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  faqCard: {
    backgroundColor: "#F0F4FF",
    borderRadius: 8,
    padding: 20,
    width: 180,
    marginRight: 10,
    marginBottom: 10,
  },
  faqIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  faqText: {
    fontSize: 16,
    color: "#333",
  },
  topicCard: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topicIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  topicTextContainer: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  topicArticles: {
    fontSize: 14,
    color: "#666",
  },
  startConversationButton: {
    backgroundColor: Colors?.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 0,
  },
  startConversationText: {
    fontSize: 16,
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
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 18,
    color: "#333",
  },
  answerContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0",
  },
  answerText: {
    fontSize: 16,
    color: "#555",
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
  modalHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalParagraph: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
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
  chatModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  chatScreen: {
    backgroundColor: "#fff",
    height: "90%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  chatMessagesContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  incomingMessage: {
    backgroundColor: Colors?.primary,
    alignSelf: "flex-start",
  },
  outgoingMessage: {
    backgroundColor: "#007BFF",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#fff",
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  chatInput: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default HelpScreen;

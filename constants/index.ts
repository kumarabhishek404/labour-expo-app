export const APPLINK = "https://your-app-link.com"; // Replace with your actual app link"

export const STETESOFINDIA = [
  { label: "andhrapradesh", value: "andhrapradesh" },
  { label: "arunachalpradesh", value: "arunachalpradesh" },
  { label: "assam", value: "assam" },
  { label: "bihar", value: "bihar" },
  { label: "chhattisgarh", value: "chhattisgarh" },
  { label: "goa", value: "goa" },
  { label: "gujarat", value: "gujarat" },
  { label: "haryana", value: "haryana" },
  { label: "himachalpradesh", value: "himachalpradesh" },
  { label: "jharkhand", value: "jharkhand" },
  { label: "karnataka", value: "karnataka" },
  { label: "kerala", value: "kerala" },
  { label: "madhyapradesh", value: "madhyapradesh" },
  { label: "maharashtra", value: "maharashtra" },
  { label: "manipur", value: "manipur" },
  { label: "meghalaya", value: "meghalaya" },
  { label: "mizoram", value: "mizoram" },
  { label: "nagaland", value: "nagaland" },
  { label: "odisha", value: "odisha" },
  { label: "punjab", value: "punjab" },
  { label: "rajasthan", value: "rajasthan" },
  { label: "sikkim", value: "sikkim" },
  { label: "tamilnadu", value: "tamilnadu" },
  { label: "telangana", value: "telangana" },
  { label: "tripura", value: "tripura" },
  { label: "uttarpradesh", value: "uttarpradesh" },
  { label: "uttarakhand", value: "uttarakhand" },
  { label: "westbengal", value: "westbengal" },
];

export const COUNTRYPHONECODE = [
  { label: "india", value: "+91" },
  { label: "canada", value: "+1" },
  { label: "belgium", value: "+32" },
  { label: "algeria", value: "+213" },
];

export const REGISTERSTEPS = [
  { label: "name" },
  { label: "contacts" },
  { label: "skills" },
  { label: "password" },
];

export const ADDSERVICESTEPS = [
  { label: "titleDescription" },
  { label: "addressDate" },
  { label: "requirements" },
  { label: "images" },
];

export const WORKERTYPES = [
  { label: "labour", value: "labour", iconName: "beach" },
  { label: "bricklayer", value: "bricklayer", iconName: "terrain" },
  { label: "stoneMason", value: "stoneMason", iconName: "city" },
  { label: "mistri", value: "mistri", iconName: "tree" },
  { label: "electrician", value: "electrician", iconName: "swim" },
];

export const MEDIATORTYPES = [
  { label: "construction", value: "construction", iconName: "beach" },
  { label: "dhaanBuwai", value: "dhaanBuwai", iconName: "terrain" },
  { label: "dhaanPitai", value: "dhaanPitai", iconName: "city" },
  { label: "alooBuwai", value: "alooBuwai", iconName: "tree" },
  { label: "bazraaKatai", value: "bazraaKatai", iconName: "swim" },
];

export const MYSERVICES = [
  {
    label: "active",
    value: "Hiring",
    iconName: "hiking",
  },
  {
    label: "completed",
    value: "Completed",
    iconName: "beach",
  },
  {
    label: "cancelled",
    value: "Cancelled",
    iconName: "terrain",
  },
];

export const SERVICES = [
  {
    label: "active",
    value: "Hiring",
    iconName: "hiking",
  },
  {
    label: "cancelled",
    value: "Cancelled",
    iconName: "terrain",
  },
];

export const MEMBERS = [
  {
    label: "all",
    iconName: "hiking",
  },
  {
    label: "construction",
    iconName: "beach",
  },
  {
    label: "farming",
    iconName: "city",
  },
  {
    label: "electrician",
    iconName: "city",
  },
];

export const WORKERS = [
  {
    label: "all",
    value: "",
    iconName: "hiking",
  },
  ...WORKERTYPES,
];

export const MEDIATOR = [
  {
    label: "all",
    value: "all",
    iconName: "hiking",
  },
  ...MEDIATORTYPES,
];

export const EMPLOYER = [
  {
    label: "all",
    value: "all",
    iconName: "hiking",
  },
  {
    label: "active",
    value: "Hiring",
    iconName: "hiking",
  },
];

export const MEDIATORREQUEST = [
  {
    label: "sentRequests",
    value: "sentRequests",
    iconName: "city",
  },
];

export const WORKERREQUEST = [
  {
    label: "receivedRequests",
    value: "recievedRequests",
    iconName: "beach",
  },
];

export const WORKTYPES = [
  { label: "construction", value: "construction" },
  { label: "farming", value: "farming" },
  { label: "helping", value: "helping" },
];

export const FAQS = [
  {
    question: "faq_how_to_recharge_fastag_question",
    answer: [
      "faq_how_to_recharge_fastag_answer.0",
      "faq_how_to_recharge_fastag_answer.1",
      "faq_how_to_recharge_fastag_answer.2",
      "faq_how_to_recharge_fastag_answer.3",
    ],
  },
  {
    question: "faq_recharge_different_provider_question",
    answer: ["faq_recharge_different_provider_answer.0"],
  },
  {
    question: "faq_recharge_failed_question",
    answer: ["faq_recharge_failed_answer.0"],
  },
  {
    question: "faq_add_card_question",
    answer: ["faq_add_card_answer.0"],
  },
  {
    question: "faq_view_tolls_question",
    answer: ["faq_view_tolls_answer.0"],
  },
];

// /constants/storageKeys.ts
export const FIRST_LAUNCH_KEY = "isFirstLaunch";
export const LANGUAGE_KEY = "selectedLanguage";

export const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Gujarati", value: "gu" },
  { label: "Marathi", value: "mr" },
  { label: "Bengali", value: "bn" },
  { label: "Rajasthani", value: "rj" },
  { label: "Punjabi", value: "pa" },
  { label: "Tamil", value: "ta" },
  { label: "Telugu", value: "te" },
  { label: "Kannada", value: "kn" },
  { label: "Malayalam", value: "ml" },
  { label: "Kashmiri", value: "ks" },
  { label: "Urdu", value: "ur" },
];

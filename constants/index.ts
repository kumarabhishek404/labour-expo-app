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
  { label: "India", value: "+91" },
  { label: "Canada", value: "+1" },
  { label: "Belgium", value: "+32" },
  { label: "Algeria", value: "+213" },
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
  { label: "construction", value: "construction", iconName: "beach" },
  { label: "labour", value: "labour", iconName: "beach" },
  { label: "brickLayer", value: "brickLayer", iconName: "terrain" },
  { label: "stoneMason", value: "stoneMason", iconName: "city" },
  { label: "mistri", value: "mistri", iconName: "tree" },
  { label: "mason", value: "mason", iconName: "swim" },
  { label: "carpenter", value: "carpenter", iconName: "swim" },
  { label: "electrician", value: "electrician", iconName: "swim" },
  { label: "dhaanBuwai", value: "dhaanBuwai", iconName: "swim" },
  { label: "dhaanPitai", value: "dhaanPitai", iconName: "swim" },
  { label: "alooBuwai", value: "alooBuwai", iconName: "swim" },
  { label: "bazraaKatai", value: "bazraaKatai", iconName: "swim" },
];

export const MEDIATORTYPES = [
  { label: "construction", value: "construction", iconName: "beach" },
  { label: "dhaanBuwai", value: "dhaanBuwai", iconName: "terrain" },
  { label: "dhaanPitai", value: "dhaanPitai", iconName: "city" },
  { label: "alooBuwai", value: "alooBuwai", iconName: "tree" },
  { label: "bazraaKatai", value: "bazraaKatai", iconName: "swim" },
  { label: "farming", value: "farming", iconName: "swim" },
  { label: "helping", value: "helping", iconName: "swim" },
  { label: "labour", value: "labour", iconName: "swim" },
  { label: "brickLayer", value: "brickLayer", iconName: "swim" },
  { label: "stoneMason", value: "stoneMason", iconName: "swim" },
  { label: "mistri", value: "mistri", iconName: "swim" },
  { label: "mason", value: "mason", iconName: "swim" },
  { label: "carpenter", value: "carpenter", iconName: "swim" },
  { label: "electrician", value: "electrician", iconName: "swim" },
];

export const MYSERVICES = [
  {
    label: "active",
    value: "HIRING",
    iconName: "hiking",
  },
  {
    label: "completed",
    value: "COMPLETED",
    iconName: "beach",
  },
  {
    label: "cancelled",
    value: "CANCELLED",
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
    label: "upcoming",
    value: "Upcoming",
    iconName: "terrain",
  },
];

// export const MEMBERS = [
//   {
//     label: "all",
//     iconName: "hiking",
//   },
//   {
//     label: "labour",
//     iconName: "beach",
//   },
//   {
//     label: "brickLayer",
//     iconName: "city",
//   },
//   {
//     label: "electrician",
//     iconName: "city",
//   },
// ];

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
    value: "",
    iconName: "hiking",
  },
  ...MEDIATORTYPES,
];

export const EMPLOYER = [
  {
    label: "all",
    value: "",
    iconName: "hiking",
  },
  {
    label: "active",
    value: "HIRING",
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
  { label: "labour", value: "labour" },
  { label: "brickLayer", value: "brickLayer" },
  { label: "electrician", value: "electrician" },
  { label: "mistri", value: "mistri" },
  { label: "mason", value: "mason" },
  { label: "carpenter", value: "carpenter" },
  { label: "stoneMason", value: "stoneMason" },
  { label: "dhaanBuwai", value: "dhaanBuwai" },
  { label: "dhaanPitai", value: "dhaanPitai" },
  { label: "alooBuwai", value: "alooBuwai" },
  { label: "bazraaKatai", value: "bazraaKatai" },
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
  { label: "हिंदी", value: "hi" },
  { label: "ગુજરાતી", value: "gu" },
  { label: "मराठी", value: "mr" },
  { label: "বাংলা", value: "bn" },
  { label: "राजस्थानी", value: "rj" },
  { label: "ਪੰਜਾਬੀ", value: "pa" },
  { label: "தமிழ்", value: "ta" },
  { label: "తెలుగు", value: "te" },
  { label: "ಕನ್ನಡ", value: "kn" },
  { label: "മലയാളം", value: "ml" },
  { label: "कश्मीरी", value: "ks" },
  { label: "اردو", value: "ur" },
];

export const REASONS = [
  {
    label: "behaviorsIsGood",
    value: "positive",
  },
  {
    label: "empatheticCommunication",
    value: "empatheticCommunication",
  },
  {
    label: "punctuality",
    value: "punctuality",
  },
  {
    label: "qualityOfWork",
    value: "qualityOfWork",
  },
  {
    label: "cleanliness",
    value: "cleanliness",
  },
  {
    label: "empatheticCommunication",
    value: "empatheticCommunication",
  },
  {
    label: "punctuality",
    value: "punctuality",
  },
  {
    label: "qualityOfWork",
    value: "qualityOfWork",
  },
  {
    label: "cleanliness",
    value: "cleanliness",
  },
  {
    label: "empatheticCommunication",
    value: "empatheticCommunication",
  },
  {
    label: "punctuality",
    value: "punctuality",
  },
  {
    label: "qualityOfWork",
    value: "qualityOfWork",
  },
  {
    label: "cleanliness",
    value: "cleanliness",
  },
  {
    label: "empatheticCommunication",
    value: "empatheticCommunication",
  },
  {
    label: "punctuality",
    value: "punctuality",
  },
  {
    label: "qualityOfWork",
    value: "qualityOfWork",
  },
  {
    label: "cleanliness",
    value: "cleanliness",
  },
  {
    label: "empatheticCommunication",
    value: "empatheticCommunication",
  },
  {
    label: "punctuality",
    value: "punctuality",
  },
  {
    label: "qualityOfWork",
    value: "qualityOfWork",
  },
  {
    label: "cleanliness",
    value: "cleanliness",
  },
];

export const APP_FEEDBACK_REASONS = [
  {
    label: "Bug",
    value: "BUG",
  },
  {
    label: "Feature request",
    value: "FEATURE_REQUEST",
  },
  {
    label: "Improvement",
    value: "IMPROVEMENT",
  },
  {
    label: "General feedback",
    value: "GENERAL",
  }, // enum: ["BUG", "FEATURE_REQUEST", "IMPROVEMENT", "GENERAL"],
];

const obj = {
  total: 0,
  applied: 0,
  selected: 0,
  cancelledApply: {
    byMySelf: 0,
    byEmployer: 0,
  },
  cancelledSelection: {
    byMySelf: 0,
    byEmployer: 0,
  },
  completed: 0,
};

const obj2 = {
  total: 0,
  pending: 0,
  cancelled: 0,
  completed: 0,
};

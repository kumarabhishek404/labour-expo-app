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

export const USERS = [
  {
    label: "active",
    value: "ACTIVE",
    iconName: "hiking",
  },
  {
    label: "pending",
    value: "PENDING",
    iconName: "hiking",
  },
  {
    label: "suspended",
    value: "SUSPENDED",
    iconName: "hiking",
  },
  {
    label: "disabled",
    value: "DISABLED",
    iconName: "hiking",
  },
];

export const ROLES = [
  {
    label: "worker",
    value: "WORKER",
    iconName: "hiking",
  },
  {
    label: "employer",
    value: "EMPLOYER",
    iconName: "hiking",
  },
  {
    label: "mediator",
    value: "MEDIATOR",
    iconName: "hiking",
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

export const ADMINREQUEST = [
  {
    label: "pending",
    value: "PENDING",
    iconName: "beach",
  },
  {
    label: "accepted",
    value: "ACCEPTED",
    iconName: "city",
  },
  {
    label: "rejected",
    value: "REJECTED",
    iconName: "city",
  },
  {
    label: "cancelled",
    value: "CANCELLED",
    iconName: "city",
  },
];

export const MEDIATORREQUEST = [
  {
    label: "sent",
    value: "SENT",
    iconName: "city",
  },
];

export const WORKERREQUEST = [
  {
    label: "received",
    value: "RECEIVED",
    iconName: "beach",
  },
];

export const EMPLOYERBOOKINGS = [
  {
    label: "bookedWorker",
    value: "booking",
    iconName: "city",
  },
  {
    label: "sentRequest",
    value: "request",
    iconName: "city",
  },
];

export const WORKERBOOKINGS = [
  {
    label: "myBookings",
    value: "booking",
    iconName: "city",
  },
  {
    label: "receivedRequest",
    value: "request",
    iconName: "city",
  },
];

export const WORKTYPES = [
  {
    label: "buildingAndRenovation",
    value: "buildingAndRenovation",
    subTypes: [
      {
        label: "homeConstruction",
        value: "homeConstruction",
        workerTypes: [
          {
            label: "mason",
            value: "mason",
          },
          {
            label: "laborers",
            value: "laborers",
          },
          {
            label: "carpenter",
            value: "carpenter",
          },
          {
            label: "plumber",
            value: "plumber",
          },
          {
            label: "electrician",
            value: "electrician",
          },
          {
            label: "steelFixer",
            value: "steelFixer",
          },
        ],
      },
      {
        label: "wallPainting",
        value: "wallPainting",
        workerTypes: [
          {
            label: "painter",
            value: "painter",
          },
          {
            label: "wallPlasteringWorker",
            value: "wallPlasteringWorker",
          },
          {
            label: "scaffoldingLaborer",
            value: "scaffoldingLaborer",
          },
        ],
      },
      {
        label: "roofRepair",
        value: "roofRepair",
        workerTypes: [
          {
            label: "roofMason",
            value: "roofMason",
          },
          {
            label: "waterproofingExpert",
            value: "waterproofingExpert",
          },
          {
            label: "laborers",
            value: "laborers",
          },
          {
            label: "thatcher",
            value: "thatcher",
          },
        ],
      },
    ],
  },
  {
    label: "plumbingServices",
    value: "plumbingServices",
    subTypes: [
      {
        label: "fixingLeaks",
        value: "fixingLeaks",
        workerTypes: [
          {
            label: "roofMason",
            value: "roofMason",
          },
        ],
      },
      {
        label: "pipeInstallations",
        value: "pipeInstallations",
        workerTypes: [
          {
            label: "roofMason",
            value: "roofMason",
          },
        ],
      },
      {
        label: "repairingWaterTanks",
        value: "repairingWaterTanks",
        workerTypes: [
          {
            label: "roofMason",
            value: "roofMason",
          },
        ],
      },
    ],
  },
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

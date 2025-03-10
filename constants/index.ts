import Image1 from "../assets/image1.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";

export const APPLINK = "https://your-app-link.com"; // Replace with your actual app link"

export const STETESOFINDIA = [
  [
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
    { label: "andamanandnicobarislands", value: "andamanandnicobarislands" },
    { label: "chandigarh", value: "chandigarh" },
    {
      label: "dadarandnagarhavelianddamananddiu",
      value: "dadarandnagarhavelianddamananddiu",
    },
    { label: "delhi", value: "delhi" },
    { label: "lakshadweep", value: "lakshadweep" },
    { label: "laddakh", value: "laddakh" },
    { label: "puducherry", value: "puducherry" },
    { label: "ladakh", value: "ladakh" },
    { label: "jammuandkashmir", value: "jammuandkashmir" },
    { label: "nctdelhi", value: "nctdelhi" },
  ],
];

export const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];

export const COUNTRYPHONECODE = [{ label: "india", value: "+91" }];

export const REGISTERSTEPS = [
  { label: "name" },
  // { label: "contacts" },
  { label: "skills" },
  { label: "password" },
];

export const ADDSERVICESTEPS = [
  { label: "typeAndSubType" },
  { label: "requirements" },
  { label: "addressDate" },
  { label: "checkDetails" },
];

export const WORKERTYPES = [
  { label: "construction", value: "construction", iconName: "building" },
  { label: "labour", value: "labour", iconName: "construction" },
  { label: "brickLayer", value: "brickLayer", iconName: "terrain" },
  { label: "stoneMason", value: "stoneMason", iconName: "city" },
  { label: "mistri", value: "mistri", iconName: "tools" },
  { label: "mason", value: "mason", iconName: "hammer" },
  { label: "carpenter", value: "carpenter", iconName: "wood" },
  { label: "electrician", value: "electrician", iconName: "bolt" },
  { label: "dhaanBuwai", value: "dhaanBuwai", iconName: "grass" },
  { label: "dhaanPitai", value: "dhaanPitai", iconName: "agriculture" },
  { label: "alooBuwai", value: "alooBuwai", iconName: "potato" },
  { label: "bazraaKatai", value: "bazraaKatai", iconName: "grass" },
  { label: "tractorDriver", value: "tractorDriver", iconName: "tractor" },
  { label: "equipmentSupplier", value: "equipmentSupplier", iconName: "tools" },
  { label: "wellDigger", value: "wellDigger", iconName: "water" },
  { label: "pumpMechanic", value: "pumpMechanic", iconName: "wrench" },
  {
    label: "borewellTechnician",
    value: "borewellTechnician",
    iconName: "water",
  },
  { label: "soilTester", value: "soilTester", iconName: "science" },
  { label: "agricultureExpert", value: "agricultureExpert", iconName: "eco" },
  { label: "pesticideSupplier", value: "pesticideSupplier", iconName: "eco" },
  {
    label: "fertilizerSupplier",
    value: "fertilizerSupplier",
    iconName: "nature",
  },
  { label: "farmConsultant", value: "farmConsultant", iconName: "person" },
  { label: "steelFixer", value: "steelFixer", iconName: "construction" },
  { label: "painter", value: "painter", iconName: "brush" },
  {
    label: "wallPlasteringWorker",
    value: "wallPlasteringWorker",
    iconName: "paint",
  },
  {
    label: "scaffoldingLaborer",
    value: "scaffoldingLaborer",
    iconName: "construction",
  },
  { label: "roofMason", value: "roofMason", iconName: "home" },
  {
    label: "waterproofingExpert",
    value: "waterproofingExpert",
    iconName: "water",
  },
  { label: "thatcher", value: "thatcher", iconName: "roofing" },
  { label: "plumber", value: "plumber", iconName: "plumbing" },
  { label: "waterTankRepairer", value: "waterTankRepairer", iconName: "water" },
  { label: "welders", value: "welders", iconName: "fire" },
  { label: "movers", value: "movers", iconName: "truck" },
  {
    label: "warehouseWorkers",
    value: "warehouseWorkers",
    iconName: "inventory",
  },
  { label: "securityGuards", value: "securityGuards", iconName: "security" },
  { label: "truckDrivers", value: "truckDrivers", iconName: "truck" },
  {
    label: "transportOperators",
    value: "transportOperators",
    iconName: "local_shipping",
  },
  { label: "cartPullers", value: "cartPullers", iconName: "agriculture" },
  { label: "packers", value: "packers", iconName: "package" },
  { label: "doctor", value: "doctor", iconName: "medical" },
  { label: "nurse", value: "nurse", iconName: "healing" },
  { label: "ambulanceDriver", value: "ambulanceDriver", iconName: "ambulance" },
  { label: "paramedic", value: "paramedic", iconName: "medical_services" },
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

export const ALLREQUEST = [
  {
    label: "received",
    value: "RECEIVED",
    iconName: "beach",
  },
  {
    label: "sent",
    value: "SENT",
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

export const ADMIN_BOOKINGS = [
  {
    label: "allBookings",
    value: "booking",
    iconName: "city",
  },
  {
    label: "allRequests",
    value: "request",
    iconName: "city",
  },
];

export const EMPLOYER_BOOKINGS = [
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

export const WORKER_BOOKINGS = [
  {
    label: "bookings",
    value: "booking",
    iconName: "city",
  },
  {
    label: "receivedDirectBookingRequests",
    value: "request",
    iconName: "city",
  },
];

export const WORKTYPES = [
  {
    label: "agricultureAndFarming",
    value: "agricultureAndFarming",
    subTypes: [
      {
        label: "tractorRental",
        value: "tractorRental",
        workerTypes: [
          {
            label: "tractorDriver",
            value: "tractorDriver",
          },
          {
            label: "equipmentSupplier",
            value: "equipmentSupplier",
          },
        ],
      },
      {
        label: "irrigationManagement",
        value: "irrigationManagement",
        workerTypes: [
          {
            label: "wellDigger",
            value: "wellDigger",
          },
          {
            label: "pumpMechanic",
            value: "pumpMechanic",
          },
          {
            label: "borewellTechnician",
            value: "borewellTechnician",
          },
        ],
      },
      {
        label: "soilTesting",
        value: "soilTesting",
        workerTypes: [
          {
            label: "soilTester",
            value: "soilTester",
          },
          {
            label: "agricultureExpert",
            value: "agricultureExpert",
          },
        ],
      },
      {
        label: "cropProtection",
        value: "cropProtection",
        workerTypes: [
          {
            label: "pesticideSupplier",
            value: "pesticideSupplier",
          },
          {
            label: "fertilizerSupplier",
            value: "fertilizerSupplier",
          },
          {
            label: "farmConsultant",
            value: "farmConsultant",
          },
        ],
      },
    ],
  },
  {
    label: "homeAndConstruction",
    value: "homeAndConstruction",
    subTypes: [
      {
        label: "buildingAndRenovation",
        value: "buildingAndRenovation",
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
            label: "plumber",
            value: "plumber",
          },
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
            label: "plumber",
            value: "plumber",
          },
        ],
      },
      {
        label: "repairingWaterTanks",
        value: "repairingWaterTanks",
        workerTypes: [
          {
            label: "plumber",
            value: "plumber",
          },
          {
            label: "waterTankRepairer",
            value: "waterTankRepairer",
          },
        ],
      },
    ],
  },
  {
    label: "dailyWageAndSkilledLabor",
    value: "dailyWageAndSkilledLabor",
    subTypes: [
      {
        label: "constructionWorkers",
        value: "constructionWorkers",
        workerTypes: [
          {
            label: "laborers",
            value: "laborers",
          },
          {
            label: "masons",
            value: "masons",
          },
          {
            label: "carpenters",
            value: "carpenters",
          },
          {
            label: "welders",
            value: "welders",
          },
        ],
      },
      {
        label: "loadingAndUnloading",
        value: "loadingAndUnloading",
        workerTypes: [
          {
            label: "movers",
            value: "movers",
          },
          {
            label: "warehouseWorkers",
            value: "warehouseWorkers",
          },
        ],
      },
      {
        label: "securityGuards",
        value: "securityGuards",
        workerTypes: [
          {
            label: "securityGuards",
            value: "securityGuards",
          },
        ],
      },
    ],
  },
  {
    label: "transportationAndLogistics",
    value: "transportationAndLogistics",
    subTypes: [
      {
        label: "tempoTruckRental",
        value: "tempoTruckRental",
        workerTypes: [
          {
            label: "truckDrivers",
            value: "truckDrivers",
          },
          {
            label: "transportOperators",
            value: "transportOperators",
          },
        ],
      },
      {
        label: "bullockCartServices",
        value: "bullockCartServices",
        workerTypes: [
          {
            label: "cartPullers",
            value: "cartPullers",
          },
        ],
      },
      {
        label: "packAndMove",
        value: "packAndMove",
        workerTypes: [
          {
            label: "packers",
            value: "packers",
          },
          {
            label: "movers",
            value: "movers",
          },
        ],
      },
    ],
  },
  {
    label: "healthAndMedicalServices",
    value: "healthAndMedicalServices",
    subTypes: [
      {
        label: "generalPhysician",
        value: "generalPhysician",
        workerTypes: [
          {
            label: "doctor",
            value: "doctor",
          },
          {
            label: "nurse",
            value: "nurse",
          },
        ],
      },
      {
        label: "ambulanceServices",
        value: "ambulanceServices",
        workerTypes: [
          {
            label: "ambulanceDriver",
            value: "ambulanceDriver",
          },
          {
            label: "paramedic",
            value: "paramedic",
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
  { label: "मराठी", value: "mr" },
  { label: "राजस्थानी", value: "rj" },
  { label: "தமிழ்", value: "ta" },
  { label: "ગુજરાતી", value: "gu" },
  { label: "বাংলা", value: "bn" },
  { label: "ਪੰਜਾਬੀ", value: "pa" },
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
    label: "bug",
    value: "BUG",
  },
  {
    label: "featureRequest",
    value: "FEATURE_REQUEST",
  },
  {
    label: "improvement",
    value: "IMPROVEMENT",
  },
  {
    label: "generalFeedback",
    value: "GENERAL",
  },
];

export const FAQS_SUPPORT = [
  { id: 1, question: "How do I cancel an existing order?", icon: "📦" },
  { id: 2, question: "What are the other shipping options?", icon: "🚚" },
  { id: 3, question: "Where is my package?", icon: "🔍" },
];

export const FAQS_TOPICS = [
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

export const FAQS_QUESTIONS = [
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

export const ONBOARDING_SLIDE = [
  {
    id: "1",
    title: "takeControlOfYourFinances",
    description: "Track your income and spending to stay on top.",
    image: Image1,
  },
  {
    id: "2",
    title: "cancelUnwantedSubscriptions",
    description: "Easily unsubscribe from unused services.",
    image: Image2,
  },
  {
    id: "3",
    title: "seeExactlyWhereYourMoneyIsGoing",
    description: "Visualize and understand your spending habits.",
    image: Image3,
  },
];

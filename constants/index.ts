import Image1 from "../assets/image1.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";

export const APPLINK =
  "https://play.google.com/store/apps/details?id=com.kumarabhishek404.labourapp"; // Replace with your actual app link"

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
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu & Kashmir",
];

export const COUNTRYPHONECODE = [{ label: "india", value: "+91" }];

export const REGISTERSTEPS = [
  { label: "name" },
  { label: "skills" },
  { label: "password" },
];

export const ADDSERVICESTEPS = [
  { label: "typeAndSubType" },
  { label: "requirements" },
  { label: "addressDate" },
  { label: "checkDetails" },
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
    label: "farmingWork",
    value: "farmingWork",
    subTypes: [
      {
        label: "fieldPreparation",
        value: "fieldPreparation",
        workerTypes: [
          { label: "jutai", value: "jutai" },
          { label: "bueai", value: "bueai" },
          { label: "sichai", value: "sichai" },
          { label: "khad", value: "khad" },
          { label: "chidkaab", value: "chidkaab" },
        ],
      },
      {
        label: "cropCare",
        value: "cropCare",
        workerTypes: [
          { label: "niraiGudai", value: "niraiGudai" },
          { label: "dekhbhal", value: "dekhbhal" },
          { label: "rakhwali", value: "rakhwali" },
        ],
      },
      {
        label: "harvestWork",
        value: "harvestWork",
        workerTypes: [
          { label: "katai", value: "katai" },
          { label: "thresing", value: "thresing" },
          { label: "harvesting", value: "harvesting" },
          { label: "dulai", value: "dulai" },
          { label: "binai", value: "binai" },
          { label: "chhatai", value: "chhatai" },
        ],
      },
      {
        label: "farmSupport",
        value: "farmSupport",
        workerTypes: [{ label: "taarBandi", value: "taarBandi" }],
      },
    ],
  },

  {
    label: "shopWork",
    value: "shopWork",
    subTypes: [
      {
        label: "shopStaff",
        value: "shopStaff",
        workerTypes: [
          { label: "shopHelper", value: "shopHelper" },
          { label: "cashier", value: "cashier" },
          { label: "computerOperator", value: "computerOperator" },
          { label: "accountant", value: "accountant" },
        ],
      },
      {
        label: "shopLogistics",
        value: "shopLogistics",
        workerTypes: [
          { label: "palledar", value: "palledar" },
          { label: "packer", value: "packer" },
          { label: "deliveryBoy", value: "deliveryBoy" },
        ],
      },
      {
        label: "shopBusiness",
        value: "shopBusiness",
        workerTypes: [
          { label: "recovery", value: "recovery" },
          { label: "marketing", value: "marketing" },
        ],
      },
    ],
  },

  {
    label: "homeMaintenance",
    value: "homeMaintenance",
    subTypes: [
      {
        label: "houseHelp",
        value: "houseHelp",
        workerTypes: [
          { label: "maid", value: "maid" },
          { label: "gardener", value: "gardener" },
          { label: "securityGuard", value: "securityGuard" },
          { label: "driver", value: "driver" },
          { label: "generalHelper", value: "generalHelper" },
        ],
      },
      {
        label: "homeRepair",
        value: "homeRepair",
        workerTypes: [
          { label: "plumber", value: "plumber" },
          { label: "electrician", value: "electrician" },
          { label: "painter", value: "painter" },
          { label: "carpenter", value: "carpenter" },
          { label: "mistri", value: "mistri" },
          { label: "beldaar", value: "beldaar" },
          { label: "lowVoltageTech", value: "lowVoltageTech" },
        ],
      },
    ],
  },

  {
    label: "constructionWork",
    value: "constructionWork",
    subTypes: [
      {
        label: "mistriWork",
        value: "mistriWork",
        workerTypes: [
          { label: "tileMistri", value: "tileMistri" },
          { label: "brickMistri", value: "brickMistri" },
          { label: "plasterMistri", value: "plasterMistri" },
          { label: "shuttering", value: "shuttering" },
          { label: "steelFixer", value: "steelFixer" },
          { label: "welder", value: "welder" },
          { label: "pipeWelder", value: "pipeWelder" },
          { label: "ducting", value: "ducting" },
        ],
      },
      {
        label: "siteStaff",
        value: "siteStaff",
        workerTypes: [
          { label: "beldaar", value: "beldaarConstruction" },
          { label: "storeKeeper", value: "storeKeeper" },
          { label: "supervisor", value: "supervisor" },
          { label: "foreman", value: "foreman" },
          { label: "fitter", value: "fitter" },
        ],
      },
    ],
  },

  {
    label: "animalWork",
    value: "animalWork",
    subTypes: [
      {
        label: "dairyWork",
        value: "dairyWork",
        workerTypes: [
          { label: "veterinary", value: "veterinary" },
          { label: "milking", value: "milking" },
          { label: "animalFeeder", value: "animalFeeder" },
          { label: "animalCleaner", value: "animalCleaner" },
        ],
      },
    ],
  },

  {
    label: "driverJobs",
    value: "driverJobs",
    subTypes: [
      {
        label: "vehicleDrivers",
        value: "vehicleDrivers",
        workerTypes: [
          { label: "truckDriver", value: "truckDriver" },
          { label: "carDriver", value: "carDriver" },
          { label: "tractorDriver", value: "tractorDriver" },
          { label: "bikeDriver", value: "bikeDriver" },
          { label: "busDriver", value: "busDriver" },
          { label: "ambulanceDriver", value: "ambulanceDriver" },
          { label: "tempoDriver", value: "tempoDriver" },
        ],
      },
      {
        label: "heavyDrivers",
        value: "heavyDrivers",
        workerTypes: [
          { label: "jcbDriver", value: "jcbDriver" },
          { label: "craneDriver", value: "craneDriver" },
          { label: "forkliftDriver", value: "forkliftDriver" },
          { label: "roadRollerDriver", value: "roadRollerDriver" },
          { label: "rmcDriver", value: "rmcDriver" },
          { label: "loaderDriver", value: "loaderDriver" },
          { label: "combineDriver", value: "combineDriver" },
          { label: "hydraDriver", value: "hydraDriver" },
        ],
      },
    ],
  },

  {
    label: "factoryJobs",
    value: "factoryJobs",
    subTypes: [
      {
        label: "factoryStaff",
        value: "factoryStaff",
        workerTypes: [
          { label: "factoryHelper", value: "factoryHelper" },
          { label: "operator", value: "operator" },
          { label: "maintenance", value: "maintenance" },
          { label: "janitor", value: "janitor" },
        ],
      },
      {
        label: "factoryOffice",
        value: "factoryOffice",
        workerTypes: [
          { label: "factorySupervisor", value: "factorySupervisor" },
          { label: "factoryForeman", value: "factoryForeman" },
          { label: "factoryStoreKeeper", value: "factoryStoreKeeper" },
          { label: "factoryAccountant", value: "factoryAccountant" },
          { label: "dataEntry", value: "dataEntry" },
          { label: "gateKeeper", value: "gateKeeper" },
        ],
      },
      {
        label: "factoryLoading",
        value: "factoryLoading",
        workerTypes: [{ label: "factoryPalledar", value: "factoryPalledar" }],
      },
    ],
  },

  {
    label: "electricalRepair",
    value: "electricalRepair",
    subTypes: [
      {
        label: "applianceRepair",
        value: "applianceRepair",
        workerTypes: [
          { label: "acMechanic", value: "acMechanic" },
          { label: "fridgeMechanic", value: "fridgeMechanic" },
          { label: "washingMachineMechanic", value: "washingMachineMechanic" },
          { label: "coolerMechanic", value: "coolerMechanic" },
          { label: "geyserMechanic", value: "geyserMechanic" },
          { label: "tvMechanic", value: "tvMechanic" },
          { label: "inverterMechanic", value: "inverterMechanic" },
          { label: "motorMechanic", value: "motorMechanic" },
        ],
      },
      {
        label: "wiringWork",
        value: "wiringWork",
        workerTypes: [{ label: "wiring", value: "wiring" }],
      },
    ],
  },

  {
    label: "generalLabour",
    value: "generalLabour",
    subTypes: [
      {
        label: "dailyLabour",
        value: "dailyLabour",
        workerTypes: [
          { label: "generalLabourer", value: "generalLabourer" },
          { label: "palledarGeneral", value: "palledarGeneral" },
        ],
      },
    ],
  },
];

type WorkerType = {
  label: string;
  value: string;
  iconName?: string;
};

type SubType = {
  label: string;
  value: string;
  workerTypes: WorkerType[];
};

type WorkType = {
  label: string;
  value: string;
  subTypes: SubType[];
};

export const extractWorkerSkills = (workTypes: any[]): any[] => {
  const workerMap = new Map<string, any>();

  for (const workType of workTypes) {
    for (const subType of workType.subTypes) {
      for (const worker of subType.workerTypes) {
        if (!workerMap.has(worker.value)) {
          workerMap.set(worker.value, worker);
        }
      }
    }
  }

  return Array.from(workerMap.values());
};

export const WORKERTYPES = extractWorkerSkills(WORKTYPES);

export const WORKERS = [
  {
    label: "all",
    value: "",
    iconName: "hiking",
  },
  ...WORKERTYPES,
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
  // { label: "मराठी", value: "mr" },
  // { label: "राजस्थानी", value: "rj" },
  // { label: "தமிழ்", value: "ta" },
  // { label: "ગુજરાતી", value: "gu" },
  // { label: "বাংলা", value: "bn" },
  // { label: "ਪੰਜਾਬੀ", value: "pa" },
  // { label: "తెలుగు", value: "te" },
  // { label: "ಕನ್ನಡ", value: "kn" },
  // { label: "മലയാളം", value: "ml" },
  // { label: "कश्मीरी", value: "ks" },
  // { label: "اردو", value: "ur" },
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
    title: "title1",
    description: "text1",
    image: Image1,
  },
  {
    id: "2",
    title: "title2",
    description: "text2",
    image: Image2,
  },
  {
    id: "3",
    title: "title3",
    description: "text3",
    image: Image3,
  },
];

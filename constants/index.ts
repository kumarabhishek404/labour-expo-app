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
    label: "farms",
    value: "farms",
    subTypes: [
      {
        label: "landPreparation",
        value: "landPreparation",
        workerTypes: [
          { label: "plowing", value: "plowing" },
          { label: "leveling", value: "leveling" },
          { label: "tilling", value: "tilling" },
          { label: "weeding", value: "weeding" },
          { label: "fieldClearing", value: "fieldClearing" },
          { label: "stonePicking", value: "stonePicking" },
          { label: "bundMaking", value: "bundMaking" },
        ],
      },
      {
        label: "sowingAndPlanting",
        value: "sowingAndPlanting",
        workerTypes: [
          { label: "seedSowing", value: "seedSowing" },
          { label: "transplantingSeedlings", value: "transplantingSeedlings" },
          { label: "manualPlanting", value: "manualPlanting" },
          { label: "fertilizerApplication", value: "fertilizerApplication" },
          { label: "manureSpreading", value: "manureSpreading" },
        ],
      },
      {
        label: "irrigation",
        value: "irrigation",
        workerTypes: [
          { label: "canalManagement", value: "canalManagement" },
          { label: "waterChannelDigging", value: "waterChannelDigging" },
          { label: "waterDistribution", value: "waterDistribution" },
          { label: "pumpOperation", value: "pumpOperation" },
          { label: "hoseManagement", value: "hoseManagement" },
        ],
      },
      {
        label: "cropMaintenance",
        value: "cropMaintenance",
        workerTypes: [
          { label: "weeding", value: "weeding" },
          { label: "pestControlSpraying", value: "pestControlSpraying" },
          { label: "fertilizerTopDressing", value: "fertilizerTopDressing" },
          { label: "pruning", value: "pruning" },
          { label: "staking", value: "staking" },
          { label: "cropWatching", value: "cropWatching" },
        ],
      },
      {
        label: "harvesting",
        value: "harvesting",
        workerTypes: [
          { label: "manualCutting", value: "manualCutting" },
          { label: "cropGathering", value: "cropGathering" },
          { label: "threshing", value: "threshing" },
          { label: "winnowing", value: "winnowing" },
          { label: "cropBundling", value: "cropBundling" },
        ],
      },
      {
        label: "postHarvest",
        value: "postHarvest",
        workerTypes: [
          { label: "cropSorting", value: "cropSorting" },
          { label: "cropCleaning", value: "cropCleaning" },
          { label: "cropPacking", value: "cropPacking" },
          { label: "loadingForTransport", value: "loadingForTransport" },
          { label: "unloadingFromTransport", value: "unloadingFromTransport" },
          { label: "storageAssistance", value: "storageAssistance" },
        ],
      },
      {
        label: "farmSupport",
        value: "farmSupport",
        workerTypes: [
          { label: "farmCleaning", value: "farmCleaning" },
          { label: "livestockFeeding", value: "livestockFeeding" },
          { label: "livestockCare", value: "livestockCare" },
          { label: "fenceRepair", value: "fenceRepair" },
          { label: "toolMaintenance", value: "toolMaintenance" },
          { label: "generalFarmHelp", value: "generalFarmHelp" },
          { label: "farmSecurity", value: "farmSecurity" },
        ],
      },
      {
        label: "specializedFarming",
        value: "specializedFarming",
        workerTypes: [
          {
            label: "apiaryManagementBeekeeping",
            value: "apiaryManagementBeekeeping",
          },
          {
            label: "sericultureSilkFarming",
            value: "sericultureSilkFarming",
          },
          {
            label: "horticultureGardening",
            value: "horticultureGardening",
          },
          {
            label: "floricultureFlowerFarming",
            value: "floricultureFlowerFarming",
          },
        ],
      },
      {
        label: "farmPartnershipsAndAssistance",
        value: "farmPartnershipsAndAssistance",
        workerTypes: [
          { label: "farmHand", value: "farmHand" },
          {
            label: "agriculturalPartnership",
            value: "agriculturalPartnership",
          },
          { label: "seasonalFarmLabor", value: "seasonalFarmLabor" },
        ],
      },
    ],
  },
  {
    label: "home",
    value: "home",
    subTypes: [
      {
        label: "housekeeping",
        value: "housekeeping",
        workerTypes: [
          { label: "sweeping", value: "sweeping" },
          { label: "mopping", value: "mopping" },
          { label: "dishwashing", value: "dishwashing" },
          { label: "laundry", value: "laundry" },
          { label: "cleaningUtensils", value: "cleaningUtensils" },
          { label: "dusting", value: "dusting" },
          { label: "arrangingItems", value: "arrangingItems" },
        ],
      },
      {
        label: "gardening",
        value: "gardening",
        workerTypes: [
          { label: "lawnMowing", value: "lawnMowing" },
          { label: "wateringPlants", value: "wateringPlants" },
          { label: "weedingGardens", value: "weedingGardens" },
          { label: "plantingFlowers", value: "plantingFlowers" },
          { label: "pruningTreesAndBushes", value: "pruningTreesAndBushes" },
          { label: "gardenCleaning", value: "gardenCleaning" },
          {
            label: "soilPreparationForGardening",
            value: "soilPreparationForGardening",
          },
        ],
      },
      {
        label: "generalHomeHelp",
        value: "generalHomeHelp",
        workerTypes: [
          { label: "carryingItems", value: "carryingItems" },
          { label: "fetchingWater", value: "fetchingWater" },
          { label: "runningErrands", value: "runningErrands" },
          { label: "basicRepairs", value: "basicRepairs" },
          { label: "cookingAssistance", value: "cookingAssistance" },
          {
            label: "elderlyCareNonMedical",
            value: "elderlyCareNonMedical",
          },
          { label: "childcareNonFormal", value: "childcareNonFormal" },
        ],
      },
      {
        label: "homeSecurity",
        value: "homeSecurity",
        workerTypes: [
          { label: "nightWatchman", value: "nightWatchman" },
          { label: "dayWatchman", value: "dayWatchman" },
          { label: "propertyGuarding", value: "propertyGuarding" },
        ],
      },
      {
        label: "homeManagement",
        value: "homeManagement",
        workerTypes: [
          { label: "propertySupervision", value: "propertySupervision" },
          {
            label: "billPaymentAssistance",
            value: "billPaymentAssistance",
          },
          {
            label: "organizingHouseholdTasks",
            value: "organizingHouseholdTasks",
          },
        ],
      },
      {
        label: "livestockCareHome",
        value: "livestockCareHome",
        workerTypes: [
          { label: "animalFeeding", value: "animalFeeding" },
          { label: "animalCleaning", value: "animalCleaning" },
          { label: "grazingAssistance", value: "grazingAssistance" },
        ],
      },
    ],
  },
  {
    label: "factories",
    value: "factories",
    subTypes: [
      {
        label: "productionLineWork",
        value: "productionLineWork",
        workerTypes: [
          { label: "assemblyLineWorker", value: "assemblyLineWorker" },
          { label: "packagingWorker", value: "packagingWorker" },
          { label: "sortingAndGrading", value: "sortingAndGrading" },
          {
            label: "machineOperationAssistant",
            value: "machineOperationAssistant",
          },
          {
            label: "qualityCheckingManual",
            value: "qualityCheckingManual",
          },
        ],
      },
      {
        label: "materialHandling",
        value: "materialHandling",
        workerTypes: [
          { label: "loader", value: "loader" },
          { label: "unloader", value: "unloader" },
          { label: "materialCarrier", value: "materialCarrier" },
          { label: "stackingWorker", value: "stackingWorker" },
          { label: "forkliftAssistant", value: "forkliftAssistant" },
        ],
      },
      {
        label: "cleaningAndMaintenance",
        value: "cleaningAndMaintenance",
        workerTypes: [
          { label: "factoryCleaner", value: "factoryCleaner" },
          { label: "machineCleaner", value: "machineCleaner" },
          { label: "wasteDisposal", value: "wasteDisposal" },
          {
            label: "basicMachineMaintenanceAssistant",
            value: "basicMachineMaintenanceAssistant",
          },
        ],
      },
      {
        label: "supportServices",
        value: "supportServices",
        workerTypes: [
          { label: "helper", value: "helper" },
          { label: "generalAssistant", value: "generalAssistant" },
          { label: "securityGuard", value: "securityGuard" },
          { label: "canteenWorker", value: "canteenWorker" },
        ],
      },
    ],
  },
  {
    label: "shops",
    value: "shops",
    subTypes: [
      {
        label: "salesAssistance",
        value: "salesAssistance",
        workerTypes: [
          { label: "shopHelper", value: "shopHelper" },
          { label: "displayArranger", value: "displayArranger" },
          {
            label: "customerServiceAssistant",
            value: "customerServiceAssistant",
          },
        ],
      },
      {
        label: "stockManagement",
        value: "stockManagement",
        workerTypes: [
          { label: "stockUnloader", value: "stockUnloader" },
          { label: "shelfStocker", value: "shelfStocker" },
          { label: "inventoryAssistant", value: "inventoryAssistant" },
        ],
      },
      {
        label: "cleaningAndMaintenance",
        value: "cleaningAndMaintenance",
        workerTypes: [
          { label: "shopCleaner", value: "shopCleaner" },
          { label: "basicRepairs", value: "basicRepairs" },
        ],
      },
      {
        label: "deliveryServices",
        value: "deliveryServices",
        workerTypes: [
          {
            label: "deliveryPersonBicycleScooter",
            value: "deliveryPersonBicycleScooter",
          },
          { label: "deliveryHelper", value: "deliveryHelper" },
        ],
      },
      {
        label: "supportRoles",
        value: "supportRoles",
        workerTypes: [
          { label: "cashierAssistant", value: "cashierAssistant" },
          { label: "securityGuard", value: "securityGuard" },
        ],
      },
    ],
  },
  {
    label: "godownsWarehouses",
    value: "godownsWarehouses",
    subTypes: [
      {
        label: "loadingAndUnloading",
        value: "loadingAndUnloading",
        workerTypes: [
          { label: "loader", value: "loader" },
          { label: "unloader", value: "unloader" },
          { label: "materialHandler", value: "materialHandler" },
        ],
      },
      {
        label: "stockManagement",
        value: "stockManagement",
        workerTypes: [
          { label: "stackingWorker", value: "stackingWorker" },
          { label: "inventoryTaker", value: "inventoryTaker" },
          { label: "goodsOrganizer", value: "goodsOrganizer" },
        ],
      },
      {
        label: "cleaningAndMaintenance",
        value: "cleaningAndMaintenance",
        workerTypes: [
          { label: "warehouseCleaner", value: "warehouseCleaner" },
          { label: "basicRepairs", value: "basicRepairs" },
        ],
      },
      {
        label: "packingAndDispatch",
        value: "packingAndDispatch",
        workerTypes: [
          { label: "packer", value: "packer" },
          { label: "dispatchAssistant", value: "dispatchAssistant" },
        ],
      },
      {
        label: "security",
        value: "security",
        workerTypes: [
          { label: "securityGuard", value: "securityGuard" },
          { label: "gatekeeper", value: "gatekeeper" },
        ],
      },
    ],
  },
  {
    label: "buildingConstruction",
    value: "buildingConstruction",
    subTypes: [
      {
        label: "sitePreparation",
        value: "sitePreparation",
        workerTypes: [
          { label: "landClearingLaborer", value: "landClearingLaborer" },
          { label: "levelingWorker", value: "levelingWorker" },
          { label: "excavationHelper", value: "excavationHelper" },
        ],
      },
      {
        label: "foundationWork",
        value: "foundationWork",
        workerTypes: [
          { label: "foundationDigger", value: "foundationDigger" },
          {
            label: "concreteMixerOperatorAssistant",
            value: "concreteMixerOperatorAssistant",
          },
          { label: "shutteringHelper", value: "shutteringHelper" },
          { label: "steelFixingHelper", value: "steelFixingHelper" },
        ],
      },
      {
        label: "masonry",
        value: "masonry",
        workerTypes: [
          { label: "bricklayerMason", value: "bricklayerMason" },
          { label: "blockLayer", value: "blockLayer" },
          { label: "plasteringHelper", value: "plasteringHelper" },
        ],
      },
      {
        label: "carpentry",
        value: "carpentry",
        workerTypes: [
          { label: "carpenter", value: "carpenter" },
          { label: "shutteringCarpenter", value: "shutteringCarpenter" },
          {
            label: "formworkCarpenterHelper",
            value: "formworkCarpenterHelper",
          },
        ],
      },
      {
        label: "plumbing",
        value: "plumbing",
        workerTypes: [
          { label: "plumber", value: "plumber" },
          { label: "plumbingAssistant", value: "plumbingAssistant" },
          { label: "pipeFitterHelper", value: "pipeFitterHelper" },
        ],
      },
      {
        label: "electricalWork",
        value: "electricalWork",
        workerTypes: [
          { label: "electrician", value: "electrician" },
          {
            label: "electricalWiringHelper",
            value: "electricalWiringHelper",
          },
        ],
      },
      {
        label: "steelWork",
        value: "steelWork",
        workerTypes: [
          { label: "steelFixer", value: "steelFixer" },
          { label: "welder", value: "welder" },
          { label: "steelCuttingHelper", value: "steelCuttingHelper" },
        ],
      },
      {
        label: "concreteWork",
        value: "concreteWork",
        workerTypes: [
          {
            label: "concreteMixerOperator",
            value: "concreteMixerOperator",
          },
          { label: "concretePourer", value: "concretePourer" },
          { label: "concreteFinisher", value: "concreteFinisher" },
          { label: "vibratorOperator", value: "vibratorOperator" },
        ],
      },
      {
        label: "scaffolding",
        value: "scaffolding",
        workerTypes: [
          { label: "scaffoldingErector", value: "scaffoldingErector" },
          { label: "scaffoldingDismantler", value: "scaffoldingDismantler" },
          { label: "scaffoldingLaborer", value: "scaffoldingLaborer" },
        ],
      },
      {
        label: "painting",
        value: "painting",
        workerTypes: [
          { label: "painter", value: "painter" },
          { label: "paintingHelper", value: "paintingHelper" },
          { label: "wallPuttyApplicator", value: "wallPuttyApplicator" },
        ],
      },
      {
        label: "flooringAndTiling",
        value: "flooringAndTiling",
        workerTypes: [
          { label: "tileLayer", value: "tileLayer" },
          { label: "flooringInstaller", value: "flooringInstaller" },
          { label: "marbleFitter", value: "marbleFitter" },
          { label: "flooringHelper", value: "flooringHelper" },
        ],
      },
      {
        label: "roofing",
        value: "roofing",
        workerTypes: [
          { label: "roofer", value: "roofer" },
          {
            label: "roofingSheetInstaller",
            value: "roofingSheetInstaller",
          },
          {
            label: "waterproofingApplicator",
            value: "waterproofingApplicator",
          },
          { label: "roofingHelper", value: "roofingHelper" },
        ],
      },
      {
        label: "finishingWork",
        value: "finishingWork",
        workerTypes: [
          { label: "glassFitter", value: "glassFitter" },
          { label: "grillFitter", value: "grillFitter" },
          {
            label: "falseCeilingInstaller",
            value: "false Ceiling Installer",
          },
          { label: "finishingHelper", value: "finishingHelper" },
        ],
      },
      {
        label: "heavyEquipmentOperation",
        value: "heavyEquipmentOperation",
        workerTypes: [
          { label: "craneOperator", value: "craneOperator" },
          { label: "excavatorOperator", value: "excavatorOperator" },
          { label: "heavyEquipmentHelper", value: "heavyEquipmentHelper" },
        ],
      },
      {
        label: "generalLabor",
        value: "generalLabor",
        workerTypes: [
          { label: "constructionLaborer", value: "constructionLaborer" },
          { label: "materialCarrier", value: "materialCarrier" },
          { label: "siteCleaner", value: "siteCleaner" },
          { label: "helper", value: "helper" },
        ],
      },
      {
        label: "security",
        value: "security",
        workerTypes: [
          { label: "siteSecurityGuard", value: "siteSecurityGuard" },
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
          { label: "plumber", value: "plumber" },
          {
            label: "leakDetectionSpecialist",
            value: "leakDetectionSpecialist",
          }, // Added
        ],
      },
      {
        label: "pipeInstallations",
        value: "pipeInstallations",
        workerTypes: [
          { label: "plumber", value: "plumber" },
          { label: "pipeFitter", value: "pipeFitter" }, // Added
        ],
      },
      {
        label: "repairingWaterTanks",
        value: "repairingWaterTanks",
        workerTypes: [
          { label: "plumber", value: "plumber" },
          { label: "waterTankRepairer", value: "waterTankRepairer" },
          { label: "tankCleaner", value: "tankCleaner" }, // Added
        ],
      },
      {
        label: "sanitationServices", // Added new subtype
        value: "sanitationServices",
        workerTypes: [
          { label: "septicTankCleaner", value: "septicTankCleaner" },
          { label: "drainCleaner", value: "drainCleaner" },
          {
            label: "toiletCleanerRepairer",
            value: "toiletCleanerRepairer",
          },
        ],
      },
      {
        label: "fixtureInstallation", // Added new subtype
        value: "fixtureInstallation",
        workerTypes: [
          { label: "faucetInstaller", value: "faucetInstaller" },
          { label: "sinkInstaller", value: "sinkInstaller" },
          { label: "toiletInstaller", value: "toiletInstaller" },
          { label: "showerInstaller", value: "showerInstaller" },
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
          { label: "laborers", value: "laborers" },
          { label: "masons", value: "masons" },
          { label: "carpenters", value: "carpenters" },
          { label: "welders", value: "welders" },
          { label: "steelFixers", value: "steelFixers" }, // Added
        ],
      },
      {
        label: "loadingAndUnloading",
        value: "loadingAndUnloading",
        workerTypes: [
          { label: "movers", value: "movers" },
          { label: "warehouseWorkers", value: "warehouseWorkers" },
          { label: "porters", value: "porters" }, // Added
        ],
      },
      {
        label: "security",
        value: "security",
        workerTypes: [{ label: "securityGuards", value: "securityGuards" }],
      },
      {
        label: "eventStaffing", // Added new subtype
        value: "eventStaffing",
        workerTypes: [
          { label: "eventSetupCrew", value: "eventSetupCrew" },
          { label: "eventCleanupCrew", value: "eventCleanupCrew" },
          { label: "waitstaff", value: "waitstaff" },
          { label: "usher", value: "usher" },
        ],
      },
      {
        label: "agriculturalLabor", // Added new subtype
        value: "agriculturalLabor",
        workerTypes: [
          { label: "fieldWorker", value: "fieldWorker" },
          { label: "harvester", value: "harvester" },
          { label: "planter", value: "planter" },
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
          { label: "truckDrivers", value: "truckDrivers" },
          { label: "transportOperators", value: "transportOperators" },
          { label: "truckCleaners", value: "truckCleaners" }, // Added
        ],
      },
      {
        label: "bullockCartServices",
        value: "bullockCartServices",
        workerTypes: [
          { label: "cartPullers", value: "cartPullers" },
          { label: "animalCaretakers", value: "animalCaretakers" }, // Added
        ],
      },
      {
        label: "packAndMove",
        value: "packAndMove",
        workerTypes: [
          { label: "packers", value: "packers" },
          { label: "movers", value: "movers" },
          {
            label: "furnitureDismantlersAssemblers",
            value: "furnitureDismantlersAssemblers",
          }, // Added
        ],
      },
      {
        label: "courierServices", // Added new subtype
        value: "courierServices",
        workerTypes: [
          { label: "courier", value: "courier" },
          { label: "deliveryAssistant", value: "deliveryAssistant" },
        ],
      },
      {
        label: "vehicleMaintenance", // Added new subtype
        value: "vehicleMaintenance",
        workerTypes: [
          { label: "vehicleCleaner", value: "vehicleCleaner" },
          { label: "tireChanger", value: "tireChanger" },
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
          { label: "doctor", value: "doctor" },
          { label: "nurse", value: "nurse" },
          { label: "wardBoyGirl", value: "wardBoyGirl" }, // Added
        ],
      },
      {
        label: "ambulanceServices",
        value: "ambulanceServices",
        workerTypes: [
          { label: "ambulanceDriver", value: "ambulanceDriver" },
          { label: "paramedic", value: "paramedic" },
          { label: "firstAidProvider", value: "firstAidProvider" }, // Added
        ],
      },
      {
        label: "homeHealthCare", // Added new subtype
        value: "homeHealthCare",
        workerTypes: [
          { label: "caregiver", value: "caregiver" },
          { label: "homeNurse", value: "homeNurse" },
          { label: "attendant", value: "attendant" },
        ],
      },
      {
        label: "pharmacyAssistance", // Added new subtype
        value: "pharmacyAssistance",
        workerTypes: [
          { label: "pharmacyHelper", value: "pharmacyHelper" },
          {
            label: "medicineDeliveryPerson",
            value: "medicineDeliveryPerson",
          },
        ],
      },
    ],
  },
  {
    label: "other", // Catch-all for anything that doesn't fit neatly
    value: "other",
    subTypes: [
      {
        label: "miscellaneous",
        value: "miscellaneous",
        workerTypes: [
          { label: "helper", value: "helper" },
          { label: "generalLaborer", value: "generalLaborer" },
        ],
      },
      {
        label: "animalServices", // Added
        value: "animalServices",
        workerTypes: [
          { label: "animalGroomer", value: "animalGroomer" },
          { label: "animalTrainer", value: "animalTrainer" },
        ],
      },
      {
        label: "eventServices", // Added
        value: "eventServices",
        workerTypes: [
          { label: "decorator", value: "decorator" },
          { label: "catererHelper", value: "catererHelper" },
        ],
      },
      {
        label: "textileWork", // Added
        value: "textileWork",
        workerTypes: [
          { label: "tailorAssistant", value: "tailorAssistant" },
          { label: "weaver", value: "weaver" },
        ],
      },
      {
        label: "wasteManagement", // Added
        value: "wasteManagement",
        workerTypes: [
          { label: "wasteCollector", value: "wasteCollector" },
          { label: "recyclingWorker", value: "recyclingWorker" },
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

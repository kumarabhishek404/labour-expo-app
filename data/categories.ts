import { MEDIATORTYPES, WORKERTYPES } from "@/constants";

const myServices = [
  {
    label: "Active",
    value: "Hiring",
    iconName: "hiking",
  },
  {
    label: "Completed",
    value: "Completed",
    iconName: "beach",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
    iconName: "terrain",
  },
];

const services = [
  {
    label: "Hiring",
    value: "Hiring",
    iconName: "hiking",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
    iconName: "terrain",
  },
];

const members = [
  {
    label: "All",
    iconName: "hiking",
  },
  {
    label: "Construction",
    iconName: "beach",
  },
  {
    label: "Farming",
    iconName: "city",
  },
  {
    label: "Electric",
    iconName: "city",
  },
];

const workers = [
  {
    label: "All",
    value: "",
    iconName: "hiking",
  },
  ...WORKERTYPES,
];

const mediatorRequests = [
  // {
  //   label: "Recieved Requests",
  //   value: 'recievedRequests',
  //   iconName: "beach",
  // },
  {
    label: "Sent Requests",
    value: "sentRequests",
    iconName: "city",
  },
];

const workerRequests = [
  {
    label: "Recieved Requests",
    value: "recievedRequests",
    iconName: "beach",
  },
  // {
  //   label: "Sent Requests",
  //   value: "sentRequests",
  //   iconName: "city",
  // },
];

const mediators = [
  {
    label: "All",
    value: "all",
    iconName: "beach",
  },
  ...MEDIATORTYPES
];

const employers = [
  {
    label: "All",
    value: "all",
    iconName: "beach",
  },
  {
    label: "Hirings",
    value: "hirings",
    iconName: "city",
  },
];

export default {
  myServices: myServices,
  services: services,
  workers: workers,
  employers: employers,
  members: members,
  mediatorRequests: mediatorRequests,
  workerRequests: workerRequests,
  mediators: mediators,
};

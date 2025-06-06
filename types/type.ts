export interface ServiceType {
  _id: string;
  name: string;
  coverImage: string;
  description: string;
  skills: string;
  rating: number;
  reviews: number;
  price: string;
  duration: string;
  location: {
    latitude: string;
    longitude: string;
  };
  category: string;
}

export interface WorkerType {
  _id: string;
  name: string;
  profilePicture: string;
  isBookmarked: boolean;
  skills: string;
  rating: number;
  reviews: number;
  price: string;
  duration: string;
  location: string;
  category: string;
}

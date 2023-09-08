import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type OrderFirestoreDTO = {
  patrimony: string;
  client: string;
  address: string;
  description: string;
  technician?: string;
  status: "open" | "closed";
  solution?: string;
  created_at: FirebaseFirestoreTypes.Timestamp;
  closed_at?: FirebaseFirestoreTypes.Timestamp;
};

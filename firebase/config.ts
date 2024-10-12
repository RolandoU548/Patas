// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file: File) {
  const storageRef = ref(storage, `drawings/${uuidv4()}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteFile(reference: string) {
  const storageRef = ref(storage, reference);
  return await deleteObject(storageRef);
}

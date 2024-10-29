import { initializeApp } from "firebase/app";
import { writeBatch, doc, getFirestore, getDocs, collection } from "firebase/firestore"; 
import { firebaseConfig } from "./firebase";

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
type DataType = {
  id: string;
  produk: string;
  komposisi: {
    admin: number[];
    ff: number[];
  };
};

export const getAllData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "komposisi"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return data;
    } catch (e) {
      console.error('Error mengambil dokumen: ', e);
      throw e;
    }
  };

export async function saveAllData(dataArray: DataType[]) {
  const batch = writeBatch(db);

  dataArray.forEach((data) => {
    const docRef = doc(db, "komposisi", data.id); // Ganti "collection_name" dengan nama koleksi di Firestore Anda
    batch.set(docRef, data);
  });

  try {
    await batch.commit();
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

/** @format */

import HOC from "../../layout/HOC";
import { useEffect, useState } from "react";
import {
  collection,
  updateDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import ChatMenu from "./ChatMenu";
import SendMessage from "./SendMessage";
import { postApi, showMsg } from "../../../Respo/Api";

const Chat = () => {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [collections, setCollections] = useState([]);
  const [document, setDocument] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, stPhotoUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [ uploading , setUploading ] = useState(false)

  useEffect(() => {
    if (user) {
      setDisplayName(user?.displayName);
      stPhotoUrl(user?.photoURL);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const fetchChatDocuments = async () => {
    const chatCollectionRef = collection(db, "Chat");
    const chatQuery = query(chatCollectionRef);
    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const chatDataArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setCollections(chatDataArray?.reverse());
    });

    return unsubscribe;
  };

  useEffect(() => {
    let unsubscribe;
    const fetchData = async () => {
      unsubscribe = await fetchChatDocuments();
    };

    fetchData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const fetchDocumentData = async (documentId) => {
    const docRef = doc(db, "Chat", documentId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setDocument(doc.data());
      } else {
        console.log("No such document!");
        setDocument({});
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (documentId) {
      let unsubscribe;
      const fetchData = async () => {
        unsubscribe = await fetchDocumentData(documentId);
      };

      fetchData();

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [documentId]);

  if (initializing) return "Loading...";

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const documentRef = doc(db, "Chat", documentId);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const recieverDetail = {
      avatar: photoURL,
      name: displayName,
    };

    if (!imageUrl && image) {
      showMsg("", "Please wait for the image to upload", "info");
      return;
    }

    try {
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const existingData = documentSnapshot.data();
        const updatedReply = [
          ...existingData.reply,
          {
            text: newMessage,
            type: "reciever",
            date: formattedDate,
            image: imageUrl,
          },
        ];
        await updateDoc(documentRef, {
          reply: updatedReply,
          reciever: recieverDetail,
        });
        sendLiveChat();
        fetchDocumentData();
        setImage(null);
        setImageUrl("");
        setNewMessage("");
      } else {
        console.log("Document does not exist!");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const sendLiveChat = () => {
    const payload = {
      message: newMessage,
      name,
      email,
    };
    postApi({
      url: `api/v1/admin/sendMailForChat`,
      payload,
    });
  };

  return (
    <>
      <section className="sectionCont">
        {user && (
          <div className="chat">
            <div className="sidebar">
              <ChatMenu
                collections={collections}
                setDocumentId={setDocumentId}
                documentId={documentId}
              />
            </div>
            <div className="content">
              <SendMessage
                data={document}
                setNewMessage={setNewMessage}
                handleOnSubmit={handleOnSubmit}
                newMessage={newMessage}
                setEmail={setEmail}
                setName={setName}
                setImageUrl={setImageUrl}
                setImage={setImage}
                setUploading={setUploading}
                uploading={uploading}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default HOC(Chat);

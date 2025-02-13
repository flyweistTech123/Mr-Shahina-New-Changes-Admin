/** @format */

import { useEffect, useState } from "react";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import uploadIcon from "../../../Images/upload-icon.png";
import sendIcon from '../../../Images/send.png'

const SendMessage = ({
  data,
  setNewMessage,
  newMessage,
  handleOnSubmit,
  setEmail,
  setName,
  setImageUrl,
  setImage,
  setUploading,
  uploading,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (data) {
      setName(data?.user?.name);
      setEmail(data?.user?.email);
    }
  }, [data]);

  const handleImageUpload = async (file) => {
    setUploading(true);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const mark = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(mark);
      },
      (error) => {
        console.error("Image upload failed: ", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        setUploading(false);
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      handleImageUpload(file);
    }
  };

  const openFile = () => {
    const target = document.getElementById("imageFile");
    target.click();
  };

  return (
    data && (
      <div className="chat-box">
        <div className="ttt">
          {data?.reply?.length > 0 ? (
            data?.reply?.map((i, index) => (
              <div
                className={i.type === "sender" ? "left" : "right"}
                key={`document${index}`}
              >
                <div className="img-container">
                  <img
                    src={
                      i.type === "sender"
                        ? data?.user?.avatar
                        : data?.reciever?.avatar
                    }
                    alt=""
                  />
                  <span>
                    <span style={{ textDecoration: "underline" }}>
                      {" "}
                      {i.type === "sender"
                        ? data?.user?.name
                        : data?.reciever?.name}
                    </span>
                    {i.date && (
                      <span className="date">
                        ( {i.date && DateInMMDDYY(i?.date)}{" "}
                        {i.date?.slice(11, 16)} )
                      </span>
                    )}
                  </span>
                </div>
                <p className="text"> {i.text} </p>
                {i?.image && (
                  <a
                    href={i?.image}
                    target="_blank"
                    className="sended-image-tag"
                  >
                    <img src={i?.image} className="sended-image" alt="" />
                  </a>
                )}
              </div>
            ))
          ) : (
            <span>No Previous Chat Found !</span>
          )}
        </div>

        <form onSubmit={handleOnSubmit} className="send-msg-form">
          <div className="input-container">
            <input
              type="text"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              placeholder="Write something here..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="imageFile"
            />
            <img src={uploadIcon} alt="" onClick={openFile} />
            {uploading && (
              <div className="cutsom-progrss-bar">
                <span style={{ width: `${progress}%` }}></span>
              </div>
            )}
          </div>
          <button type="submit" className="send-button">
            <img src={sendIcon} alt='' />
          </button>
        </form>
      </div>
    )
  );
};
export default SendMessage;

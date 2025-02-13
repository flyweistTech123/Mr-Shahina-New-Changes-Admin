/** @format */

import React from "react";

const userImg = "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1"

const ChatMenu = ({ collections, setDocumentId, documentId }) => {
  return (
    <>
      <aside className="h-auto">
        <nav className="menu-list">
          {collections?.map((nav, index) => {
            return (
              <span
                key={`chats${nav.id}${index}`}
                className={`container ${documentId === nav.id ? "active" : ""}`}
                onClick={() => setDocumentId(nav.id)}
              >
                <img src={nav?.data?.user?.avatar ? nav?.data?.user?.avatar : userImg} alt="" />
                <p> {nav?.data?.user?.name} </p>
              </span>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default ChatMenu;

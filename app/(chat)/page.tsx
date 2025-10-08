import React from "react";
import ContactList from "./_component/contact-list";

const HomePage = () => {
  return (
    <div className="w-80 h-screen border-r fiex inset-0 z-50">
      <ContactList contacts={contacts} />
    </div>
  );
};

const contacts = [
  {
    email: "john@gmail.com",
    _id: "1",
    avatar: "https://github.com/shadcn.png",
  },
  { email: "amile@gmail.com", _id: "2" },
  { email: "faris@gmail.com", _id: "3" },
  { email: "abdo@gmail.com", _id: "4" },
  { email: "billi@gmail.com", _id: "5" },
];

export default HomePage;

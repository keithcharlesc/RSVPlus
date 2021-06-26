//NOT REQUIRED PAGE
import React, { useState } from "react";
import NavigationBar from "../../Navbar Pages/NavigationBar/NavigationBar";
import Loop from "./Loop";
import "./FAQ.css";

export default function FAQ() {
  const [faqs, setFaqs] = useState([
    {
      question: "What is RSVPlus?",
      answer: "RSVPlus is designed to bring convenience and accessibility to event planners." + 
        "It displays upcoming events and reminders, but more importantly it provides an optimal timeslot for group events.",
      open: false,
    },
    {
      question: "Who can use RSVPlus?",
      answer: "RSVPlus is first and foremost a calendar app - it is created to be helpful for anyone who wants to keep track of their schedule." 
      + " That being said, this app is designed by students for students." + 
        " Students are required to work with different teams on projects and co-curricular activities and often do not have an effecient way to decide on a day and time that works with every team member's packed schedule." +
        " RSVPlus solves this problem by providing a date and a time that works well with everybody's schedules.",
      open: false,
    },
    {
      question: "What are channels used for?",
      answer: "A channel is created for every event that you organize. First, enter in details about your event like when it starts and when it ends, and who you want to invite." + 
        " Once that's done, RSVPlus will automatically create a channel through which you will be able to monitor who has responded to your event." +
        " The people whom you have invitied will be able to view the channel via their RSVPlus accounts, and can submit their calendar information to get a date and time that works for everyone.",
      open: false,
    },
    {
      question: "How do I sync my calendar data to RSVPlus?",
      answer: "Refer to the following guide: " ,
      open: false,
    }
  ]);

  const toggleFAQ = (index) => {
    setFaqs(
      faqs.map((faq, i) => {
        if (i === index) {
          faq.open = !faq.open;
        } else {
          faq.open = false;
        }

        return faq;
      })
    );
  };

  return (
    <>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h2 className="page-header text-center mb-4">FAQ</h2>
        <div
          className="d-flex justify-content-center mt-5"
          style={{ minHeight: "100vh" }}
        >
          <div className="faqs">
            {faqs.map((faq, i) => (
              <Loop key={i} faq={faq} index={i} toggleFAQ={toggleFAQ} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

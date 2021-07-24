//NOT REQUIRED PAGE
import React, { useState } from "react";
import MockNavigationBar from "../../Navbar Pages/NavigationBar/MockNavigationBar";
import Loop from "./Loop";
import "./FAQ.css";

export default function FAQ() {
  const [faqs, setFaqs] = useState([
    {
      question: "What is RSVPlus?",
      answer:
        "RSVPlus is designed to bring convenience and accessibility to event planners." +
        " It displays upcoming events and reminders, but more importantly it provides an optimal timeslot for group events.",
      open: false,
    },
    {
      question: "Who can use RSVPlus?",
      answer:
        "RSVPlus is first and foremost a calendar app - it is created to be helpful for anyone who wants to keep track of their schedule." +
        " That being said, this app is designed by students for students." +
        " Students are required to work with different teams on projects and co-curricular activities and often do not have an effecient way to decide on a day and time that works with every team member's packed schedule." +
        " RSVPlus solves this problem by providing a date and a time that works well with everybody's schedules.",
      open: false,
    },
    {
      question: "What are channels used for?",
      answer:
        "A channel is created for every event that you organize. First, enter in details about your event like when it starts and when it ends, and who you want to invite." +
        " Once that's done, RSVPlus will automatically create a channel through which you will be able to monitor who has responded to your event." +
        " The people whom you have invited will be able to view the channel via their RSVPlus accounts, and can submit their calendar information to get a date and time that works for everyone after everyone has responded.",
      open: false,
    },
    {
      question:
        "In 'Channels', what happens when I agree to sync my calendar data?",
      answer:
        "When a user clicks on the buton to sync calendar data, RSVPlus identifies specific dates and times that the user is not free." +
        " This is then used alongside other users' calendar data to decide the best date and time that an event can be held.",
      open: false,
    },
    {
      question:
        "In 'Calendar', when I input the link for my calendar, will this link be stored in a database that can be accessed by anyone, including RSVPlus' adminstrators?",
      answer:
        "The calendar link that you submit will be stored in a Firebase database." +
        " However, the link to your calendar cannot be accessed by anyone other than the person to whom it belongs to." +
        " This error message will appear if a person tries to use another person's calendar link: " +
        "'Events from one or more calendars could not be shown here because you do not have the permission to view them.'",
      open: false,
    },
    {
      question:
        "Do RSVPlus store any of my Google Calendar events' private information?",
      answer:
        "Nope. Every time you sync your data to a channel, it only looks for your Google Calendar events that fall within the date range of that channel. Only the needed dates and busy time slots of those dates are stored." +
        " No other information such as event name or details are stored on our database. Solely the needed dates and timings! Furthermore, every time you sync to a new channel, your previous data (old dates and timings) will be cleared and gets updated with the new data for the new date range!",
      open: false,
    },
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
      <MockNavigationBar />
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

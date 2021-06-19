//NOT REQUIRED PAGE
import React, {useState} from "react";
import { Container, Accordion, Card } from "react-bootstrap";
import NavigationBar from "../../Navbar Pages/NavigationBar/NavigationBar";
import Loop from './Loop'
import './FAQ.css'
 
 


export default function FAQ() {
  const [faqs, setFaqs] = useState([
    {
      question: "what is the meaning of life?",
      answer: "The meaning of life is 42.",
      open: false
    },
    {
      question: "Were Ross and Rachel on a break?",
      answer: "They were on a break.",
      open: false
    },
    {
      question: "Is the world flat?",
      answer: "No, our planet is a sphere.",
      open: false
    },
  ])

  const toggleFAQ = index => {
    setFaqs(faqs.map((faq, i) => {
      if (i === index) {
        faq.open = !faq.open
      } else {
        faq.open = false;
      }

      return faq;
    }))
  }

  return (
    <>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h2 className="text-center mb-4"> FAQ page </h2>
        <div
          className="d-flex justify-content-center mt-5"
          style={{ minHeight: "100vh" }} >
          <div className = 'faqs'>
          {faqs.map((faq, i) => (
            <Loop faq={faq} index={i} toggleFAQ={toggleFAQ} />
          ))}
            </div>
        </div>
      </div>
    </>
  );
}





























    {/* // <>
    //   <NavigationBar />
    //   <div className="p-3 mb-2 bg-dark text-white">
    //     <h2 className="text-center mb-4">Dashboard</h2>
    //     <Container
    //       className="d-flex justify-content-center mt-5"
    //       style={{ minHeight: "100vh" }}
    //     >
    //       <Accordion style={{ width: 700 }}>
    //         <Card>
    //           <Accordion.Toggle as={Card.Header} eventKey="0">
    //             Click me!
    //           </Accordion.Toggle>
    //           <Accordion.Collapse eventKey="0">
    //             <Card.Body>Hello! I'm the body</Card.Body>
    //           </Accordion.Collapse>
    //         </Card>
    //         <Card>
    //           <Accordion.Toggle as={Card.Header} eventKey="1">
    //             Click me!
    //           </Accordion.Toggle>
    //           <Accordion.Collapse eventKey="1">
    //             <Card.Body>Hello! I'm another body</Card.Body>
    //           </Accordion.Collapse>
    //         </Card>
    //       </Accordion>
    //     </Container>
    //   </div>
    // </> */}

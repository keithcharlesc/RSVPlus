import { mockFirebase } from "firestore-jest-mock";
import { mockCollection, mockWhere } from "firestore-jest-mock/mocks/firestore";

mockFirebase({
  database: {
    users: [
      { id: "testid", name: "Orbital RSVP" },
      { id: "testidTwo", name: "RSVP Test User 1" },
    ],
  },
});

function getUsersInName(name) {
  const firebase = require("firebase");
  const db = firebase.firestore();
  let query = db.collection("users");

  if (name) {
    query = query.where("name", "==", name);
  }

  return query.get();
}

test("testing stuff", () => {
  const firebase = require("firebase");
  const db = firebase.firestore();

  return db
    .collection("users")
    .get()
    .then((userDocs) => {
      // Assert that a collection ID was referenced
      expect(mockCollection).toHaveBeenCalledWith("users");
      // Assert that correct Firestore methods are called
      expect(userDocs.docs[0].id).toBe("testid");
    });
});

test("query with name", async () => {
  await getUsersInName("Orbital RSVP");
  // Assert that correct Firestore methods are called
  expect(mockCollection).toHaveBeenCalledWith("users");
  expect(mockWhere).toHaveBeenCalledWith("name", "==", "Orbital RSVP");
});

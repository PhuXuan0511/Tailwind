const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()

// Scheduled function to update overdue lendings every minute
exports.updateOverdueLendings = functions.pubsub
    .schedule("every 1 minutes")
    .onRun(async (context) => {
      const db = admin.firestore()
      const now = new Date().toISOString().split("T")[0] // YYYY-MM-DD

      const lendingsSnapshot = await db
          .collection("lendings")
          .where("status", "==", "Borrowed")
          .where("returnDate", "<", now)
          .get()

      const batch = db.batch()
      lendingsSnapshot.forEach((doc) => {
        batch.update(doc.ref, { status: "Overdue" })
      })
      await batch.commit()
      console.log("Overdue lendings updated.")
      return null
    })

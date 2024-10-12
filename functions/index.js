/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Parser} = require("json2csv");
const PDFDocument = require("pdfkit");
const stream = require("stream");
const sgMail = require("@sendgrid/mail");


console.log('Functions Config:', functions.config());

const sendGridAPIKey = functions.config().sendgrid?.key;

if (!sendGridAPIKey) {
  throw new Error('SendGrid API key is not defined in Firebase config');
}

sgMail.setApiKey(sendGridAPIKey);

admin.initializeApp();
const db = admin.firestore();

// Function to send email using SendGrid
exports.sendNewsletter = functions.https.onCall(async (data, context) => {
  const {subject, body, attachmentURL} = data;

  // Get all subscribed users from Firestore
  const db = admin.firestore();
  const usersSnapshot = await db.collection("users")
      .where("isSubscribed", "==", true).get();

  // Extract email addresses of subscribed users
  const recipients = usersSnapshot.docs.map((doc) => doc.data().email);

  if (recipients.length === 0) {
    return {success: false, message: "No subscribers found"};
  }

  const msg = {
    to: recipients, // array of recipient emails
    from: "mbal0012@student.monash.edu", // Verified SendGrid sender email
    subject: subject,
    text: body,
    html: body,
    attachments: attachmentURL ?
        [
          {
            content: attachmentURL,
            filename: "attachment.pdf",
            type: "application/pdf",
            disposition: "attachment",
          },
        ] :
        [],
  };

  try {
    await sgMail.sendMultiple(msg);
    return {success: true, message: "Newsletter sent successfully"};
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return {success: false, message: "Error sending newsletter"};
  }
});

// Helper function to format date for querying
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

exports.exportData = functions.https.onRequest(async (req, res) => {
  const {collection, format, startDate, endDate} = req.query;

  try {
    let query = db.collection(collection);

    // Apply date range
    if (startDate) {
      query = query.where("createdAt", ">=", formatDate(startDate));
    }
    if (endDate) {
      query = query.where("createdAt", "<=", formatDate(endDate));
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => doc.data());

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      return res.send(data);
    }

    if (format === "csv") {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=data.csv");
      return res.send(csv);
    }

    if (format === "pdf") {
      const doc = new PDFDocument();
      const passthrough = new stream.PassThrough();
      passthrough.end(Buffer.from(JSON.stringify(data), "utf-8"));

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=data.pdf");

      doc.pipe(res);
      data.forEach((item) => {
        doc.text(JSON.stringify(item, null, 2)); // Add data to PDF
        doc.moveDown();
      });
      doc.end();
    }
  } catch (error) {
    console.error("Error exporting data:", error);
    return res.status(500).send("Failed to export data");
  }
});


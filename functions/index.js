/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

require('dotenv').config({ path: '../.env' })
const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const { Parser } = require('json2csv')
const PDFDocument = require('pdfkit')
const sgMail = require('@sendgrid/mail')
const postmark = require('postmark')
const cors = require('cors')({ origin: true })

admin.initializeApp()
const db = admin.firestore()

const postmarkAPIKey = process.env.VITE_POSTMARK_API_KEY
const client = new postmark.ServerClient(postmarkAPIKey)

// Helper function to format date for querying
const formatDate = (date) => {
  if (!date) return null
  return new Date(date).toISOString()
}

exports.exportData = onRequest((req, res) => {
  cors(req, res, async () => {
    const { collection, format, startDate, endDate } = req.query

    try {
      let query = db.collection(collection)

      // Apply date range
      if (startDate) {
        query = query.where('createdAt', '>=', formatDate(startDate))
      }
      if (endDate) {
        query = query.where('createdAt', '<=', formatDate(endDate))
      }

      const snapshot = await query.get()
      const data = snapshot.docs.map((doc) => doc.data())

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json')
        return res.send(data)
      }

      if (format === 'csv') {
        const json2csvParser = new Parser()
        const csv = json2csvParser.parse(data)
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv')
        return res.send(csv)
      }

      if (format === 'pdf') {
        const doc = new PDFDocument()
        const tableTop = 100
        const rowHeight = 20

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=data.pdf')

        doc.pipe(res)

        const keys = Object.keys(data[0] || {})

        let x = 50
        let y = tableTop

        doc.font('Helvetica-Bold').fontSize(10)
        keys.forEach((key) => {
          doc.text(key, x, y, { width: 100, align: 'left' })
          x += 100
        })

        x = 50
        y += rowHeight

        doc.font('Helvetica').fontSize(10)

        data.forEach((item) => {
          keys.forEach((key) => {
            doc.text(item[key], x, y, { width: 100, align: 'left' })
            x += 100
          })

          x = 50
          y += rowHeight
        })

        doc.end()
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      return res.status(500).send('Failed to export data')
    }
  })
})

exports.sendNewsletter = onRequest((req, res) => {
  cors(req, res, async () => {
    const { newsletterId } = req.body

    try {
      // Fetch the selected newsletter from Firestore
      const newsletterRef = db.collection('newsletters').doc(newsletterId)
      const newsletterSnapshot = await newsletterRef.get()
      if (!newsletterSnapshot.exists) {
        return res.status(404).send({ success: false, message: 'Newsletter not found' })
      }
      const newsletter = newsletterSnapshot.data()

      // Get all subscribed users from Firestore
      const usersSnapshot = await db.collection('users').where('isSubscribed', '==', true).get()
      const recipients = usersSnapshot.docs.map((doc) => doc.data().email)

      if (recipients.length === 0) {
        return res.status(404).send({ success: false, message: 'No subscribers found' })
      }

      // Prepare email data for Postmark
      const emailData = {
        From: 'mbal0012@student.monash.edu',
        To: recipients.join(','), // Join recipients into a single string
        Subject: newsletter.subject,
        HtmlBody: newsletter.body,
        TextBody: newsletter.body,
        MessageStream: 'outbound'
      }

      // Send the email using Postmark
      await client.sendEmail(emailData)

      return res.send({ success: true, message: 'Newsletter sent successfully' })
    } catch (error) {
      console.error('Error sending newsletter:', error)
      return res.status(500).send({ success: false, message: 'Failed to send newsletter' })
    }
  })
})

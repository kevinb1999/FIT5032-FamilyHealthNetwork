import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  limit,
  updateDoc,
  deleteDoc,
  collection
} from 'firebase/firestore'
import { auth } from '@/firebase/init' // Your firebase init file

// Initialize Firestore
const db = getFirestore()

const eventsCollection = collection(db, 'events') // Collection for events

export const getEvents = async (
  page = 0,
  rows = 10,
  sortField = '',
  sortOrder = 1,
  filters = {}
) => {
  try {
    let q = query(eventsCollection)

    // Apply sorting if sortField is provided
    if (sortField) {
      q = query(q, orderBy(sortField, sortOrder === 1 ? 'asc' : 'desc'))
    }

    // Apply filtering from PrimeVue filters
    for (const filterField in filters) {
      const filterValue = filters[filterField].value
      if (filterValue) {
        // Apply Firestore where clause for each filter field
        q = query(q, where(filterField, '>=', filterValue), where(filterField, '<=', filterValue))
      }
    }

    // Pagination logic
    q = query(q, limit(rows))

    // Execute the query
    const snapshot = await getDocs(q)

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: events,
      total: snapshot.size // Total number of records (adjust if needed)
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

// Add or update an event in Firestore
export const saveEvent = async (event) => {
  try {
    const eventRef = doc(eventsCollection, event.id) // Reference to event document
    await setDoc(eventRef, {
      name: event.name,
      dateTime: event.dateTime,
      duration: event.duration,
      location: event.location,
      description: event.description
    })
    console.log('Event saved successfully')
  } catch (error) {
    console.error('Error saving event:', error)
  }
}

// Get an event from Firestore by event ID
export const getEvent = async (eventId) => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    const eventSnap = await getDoc(eventRef)
    if (eventSnap.exists()) {
      return eventSnap.data() // Return the event data
    } else {
      console.log('No such event!')
      return null
    }
  } catch (error) {
    console.error('Error getting event:', error)
  }
}

// Update an existing event in Firestore (using an Event object)
export const updateEvent = async (event) => {
  try {
    const eventRef = doc(eventsCollection, event.id)
    await updateDoc(eventRef, {
      name: event.name,
      dateTime: event.dateTime,
      duration: event.duration,
      location: event.location,
      description: event.description
    })
    console.log('Event updated successfully')
  } catch (error) {
    console.error('Error updating event:', error)
  }
}

// Delete an event from Firestore
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    await deleteDoc(eventRef)
    console.log('Event deleted successfully')
  } catch (error) {
    console.error('Error deleting event:', error)
  }
}

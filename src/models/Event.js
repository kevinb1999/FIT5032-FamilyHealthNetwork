export class Event {
  constructor(id, name, dateTime, duration, location, description) {
    this.id = id
    this.name = name
    this.dateTime = dateTime
    this.duration = duration
    this.location = location
    this.description = description
  }

  getId() {
    return this.id
  }

  setId(id) {
    this.id = id
  }

  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
  }

  getDateTime() {
    return this.dateTime
  }
  setDateTime(dateTime) {
    this.dateTime = dateTime
  }

  getDuration() {
    return this.duration
  }
  setDuration(duration) {
    this.duration = duration
  }

  getLocation() {
    return this.location
  }

  setLocation(location) {
    this.location = location
  }

  getDescription() {
    return this.description
  }

  setDescription(description) {
    this.description = description
  }
}

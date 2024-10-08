export class Clinic {
  constructor(id, name, phoneNumber, location, description) {
    this.id = id
    this.name = name
    this.phoneNumber = phoneNumber
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

  getPhoneNumber() {
    return this.phoneNumber
  }

  setPhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber
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

export class User {
  constructor(
    userId,
    email,
    userType,
    firstName,
    lastName,
    phoneNumber,
    isSubscribed,
    location,
    about
  ) {
    this.userId = userId
    this.email = email
    this.userType = userType
    this.firstName = firstName
    this.lastName = lastName
    this.phoneNumber = phoneNumber
    this.isSubscribed = isSubscribed
    this.location = location
    this.about = about
  }

  getId() {
    return this.userId
  }

  setId(userId) {
    this.userId = userId
  }

  getEmail() {
    return this.userId
  }

  setEmail(email) {
    this.email = email
  }

  getUserType() {
    return this.userType
  }

  setUserType(userType) {
    this.userType = userType
  }

  getFirstName() {
    return this.firstName
  }

  setFirstName(firstName) {
    this.firstName = firstName
  }

  getLastName() {
    return this.lastName
  }

  setLastName(lastName) {
    this.lastName = lastName
  }

  getPhoneNumber() {
    return this.phoneNumber
  }

  setPhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber
  }

  getSubscribed() {
    return this.isSubscribed
  }

  changeSubscription() {
    this.isSubscribed = !this.isSubscribed
  }

  getLocation() {
    return this.location
  }

  setLocation(location) {
    this.location = location
  }

  getAbout() {
    return this.about
  }

  setAbout(about) {
    this.about = about
  }
}

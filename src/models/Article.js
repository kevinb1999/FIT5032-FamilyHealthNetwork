export class Article {
  constructor(id, title, image, content, totalReviewCount, userReviewArr, redirectLink) {
    this.id = id
    this.title = title
    this.image = image
    this.content = content
    this.totalReviewCount = totalReviewCount
    this.userReviewArr = userReviewArr
    this.redirectLink = redirectLink
  }

  getId() {
    return this.id
  }

  setId(id) {
    this.id = id
  }

  getTitle() {
    return this.title
  }

  setTitle(title) {
    this.title = title
  }

  getImage() {
    return this.image
  }

  setImage(image) {
    this.image = image
  }

  getContent() {
    return this.content
  }

  setContent(content) {
    this.content = content
  }

  getTotalReviewCount() {
    return this.totalReviewCount
  }

  setTotalReviewCount(totalReviewCount) {
    this.totalReviewCount = totalReviewCount
  }

  getUserReviewArr() {
    return this.userReviewArr
  }

  getRedirectLink() {
    return this.redirectLink
  }

  setRedirectLink(redirectLink) {
    this.redirectLink = redirectLink
  }

  getRatiing() {
    let totalStarCount = 0
    for (let rating of this.userReviewArr.entries()) {
      totalStarCount += rating.stars
    }
    return Math.floor(totalStarCount / this.totalReviewCount)
  }

  rate(userId, rating) {
    const userReview = this.userReviewArr.find((review) => review.userId === userId)

    if (userReview) {
      userReview.stars = rating
    } else {
      this.userReviewArr.push({ userId: userId, stars: rating })
      this.totalReviewCount += 1
    }
  }
}

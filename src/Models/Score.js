export default class Score {
  constructor(score = 0){
    this.score = score;
  }
  setScore (score) {
    this.score = score;
  }
  getScore () {
    return this.score;
  }
}

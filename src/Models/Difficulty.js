export default class Difficulty {
  constructor(cardNum = 16){
    //default card number is 16, a 4x4 game board
    this.cardNum = cardNum;
  }
  setDifficulty (cardNum) {
    this.cardNum = cardNum;
  }
  getDifficulty () {
    return this.cardNum;
  }
}

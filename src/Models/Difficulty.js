export default class Difficulty {
  constructor(cardNum = 16, delayTime = 1000){
    //default card number is 16, a 4x4 game board
    this.cardNum = cardNum;
    this.delayTime = delayTime;
  }
  setCardNum (cardNum) {
    this.cardNum = cardNum;
  }
  getCardNum () {
    return this.cardNum;
  }
  setDelayTime (delayTime) {
    this.delayTime = delayTime;
  }
  getDelayTime () {
    return this.delayTime;
  }
}

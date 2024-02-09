export default class Move {
  constructor(maxMove = -1, moveSteps = 0){
    // maxMove = -1 indicates that user doesn't limit the moves
    this.maxMove = maxMove;
    this.moveSteps = moveSteps;
  }
  setMaxMoves(maxMove){
    this.maxMove = maxMove;
  }
  setSteps (step) {
    this.moveSteps = step;
  }
  getSteps () {
    return this.moveSteps;
  }
  getMaxSteps () {
    return this.maxMove;
  }
  getRemainSteps () {
    if(this.maxMove === -1){
      return '∞';
    }
    else{
      return this.maxMove - this.moveSteps;
    }
  }
}
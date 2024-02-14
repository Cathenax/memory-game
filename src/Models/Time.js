export default class Time {
  constructor(maxTime = -1){
    // maxTime = -1 indicates that user doesn't limit the time
    this.maxTime = maxTime;
    this.remainTime = maxTime;
    this.time = 0;
  }
  setMaxTime(maxTime){
    this.maxTime = maxTime;
  }
  setRemainTime(remainTime){
    this.remainTime = remainTime;
  }
  getRemainTime () {
    if(this.maxTime === -1){
      return '∞';
    }
    else{
      return this.remainTime;
    }
  }
  setTime (time){
    this.time = time;
  }
  getTime (time){
    return this.time;
  }
}
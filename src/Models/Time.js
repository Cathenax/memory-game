export default class Time {
  constructor(maxTime = -1, time = 0){
    // maxTime = -1 indicates that user doesn't limit the time
    this.maxTime = maxTime;
    this.remainTime = maxTime;
    this.time = time;
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
  getTime (){
    return this.time;
  }
  getMaxTime (){
    return this.maxTime;
  }
}
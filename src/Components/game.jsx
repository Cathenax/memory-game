import React, { Component } from 'react'

import Card from './card';
import './game.css'
import { cardEmojis } from '../Utils/cardEmojis';

export default class Game extends Component {
  constructor(props) {
    super(props);
    //default value of the game
    const time = new Time();
    const move = new Move();
    const score = new Score();
    const difficulty = new Difficulty();
    this.state = {
      time: time,
      move: move,
      score: score,
      difficulty: difficulty,
      cards: null,
      firstSelection: null,
      secondSelection: null,
    }
  }

  resetCards = () =>{
    const numOfCards = this.state.difficulty.cardNum / 2;
    const allCard = cardEmojis.splice(0,numOfCards);
    const shuffled = [...allCard,...allCard]
      .sort(() => Math.random() - .5)
      .map((card, index) => {
        return ({...card, key: index})
      })
    this.setState({
      cards: shuffled,
    })
  }

  resetTurns = () =>{

  }

  newGame = () => {
    this.resetCards();
    this.resetTurns();
    //new move & time settings
    const move = new Move();
    const time = new Time();
    this.setState({
      move: move,
      time: time,
    })
  }

  handleCardClick = (e) =>{
    const {firstSelection, secondSelection} = this.state;
    // to do: handle duplicated single card click
    if(firstSelection !== null){

    }else{
      // this.setState({
      //   firstSelection: e.target
      // })
    }
    console.log(e);
  }

  render() {
    const {time, move, score, difficulty, cards} = this.state;
    return (
      <div>
        <button onClick={() => this.newGame()}>New Game</button>
        <div className="gameboard">
          {
            cards.map((card) => {
              return (
                <Card
                  key={card.key}
                  card={card}
                  disabled={card}
                  handleCardClick={() => this.handleCardClick()}
                />
              )
            })
          }
        </div>
        <p>Total Moves: {move.moveSteps}</p>
        <p>Moves Remain: {move.getRemainSteps()}</p>
        <p>Total Score: {score}</p>
      </div>
    )
  }
}

export class Time {
  constructor(maxTime = -1){
    // time = -1 indicates that user doesn't limit the time
    this.maxTime = maxTime;
    this.remainTime = maxTime;
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
}

export class Move {
  constructor(maxMove = -1){
    // move = -1 indicates that user doesn't limit the moves
    this.maxMove = maxMove;
    this.moveSteps = 0;
  }
  setMaxMoves(maxMove){
    this.maxMove = maxMove;
  }
  setSteps (step) {
    this.moveSteps = step;
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

export class Score {
  constructor(score = 0){
    this.score = score;
  }
}

export class Difficulty {
  constructor(cardNum = 16){
    //default card number is 16, a 4x4 game board
    this.cardNum = cardNum;
  }
}

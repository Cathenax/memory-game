import React, { Component } from 'react'

import Card from './card';
import Time from '../Models/Time';
import Move from '../Models/Move';
import Score from '../Models/Score';
import Difficulty from '../Models/Difficulty';
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
    this.newGame();
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
    const {move} = this.state;
    const step = move.getSteps();
    const maxStep = move.getMaxSteps();
    const newMove = new Move(maxStep, step+1);
    this.setState({
      firstSelection: null,
      secondSelection: null,
      move: newMove,
    })
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
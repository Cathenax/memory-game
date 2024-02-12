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
    const score = new Score();
    const difficulty = new Difficulty()
    const move = new Move();
    const time = new Time();
    this.state = {
      move: move,
      time: time,
      score: score,
      difficulty: difficulty,
      playing: true,
      disabled: false,
    };
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
    const {move, firstSelection, secondSelection} = this.state;
    const step = move.getSteps();
    const maxStep = move.getMaxSteps();
    if(firstSelection && secondSelection){
      const newMove = new Move(maxStep, step+1);
      this.setState({
        firstSelection: null,
        secondSelection: null,
        move: newMove,
      })
    }
  }

  //check two cliked cards are a match or not
  matchCards = () =>{
    const {firstSelection, secondSelection, cards} = this.state;
    //if only choose one or zero cards
    if(!firstSelection || !secondSelection){
      return;
    }
    else{
      //is a match
      if(firstSelection.emojiId === secondSelection.emojiId){
        console.log('match',firstSelection.emojiId);
      }
      //is not a match
      else{
        console.log('not a match',firstSelection.emojiId, secondSelection.emojiId);
      }
      this.setState({
        disabled: false,
        firstSelection: null,
        secondSelection: null,
      })
    }
  }

  newGame = () => {
     //default value of the game;
    this.resetCards();
    this.resetTurns();
  }

  //handle the click event of a card
  handleCardClick = (cardId) =>{
    const {firstSelection, cards} = this.state;
    const clickedCard = cards[cardId];
    //is a second click
    if(firstSelection){
      //handle duplicated single card click
      if(clickedCard === firstSelection){
        return;
      }
      else{
        this.setState({
          secondSelection: clickedCard,
          disabled: true,
        }, 
        //call back after the state changes
        () => {
          this.matchCards();
        });
      }
    }
    // is a first click
    else{
      this.setState({
        firstSelection: clickedCard,
      })
    }
    console.log(clickedCard);
  }

  componentDidMount () {
    this.newGame();
  }
  render() {
    const {time, move, score, difficulty, cards, disabled} = this.state;
    return (
      <div>
        <button onClick={() => this.newGame()}>New Game</button>
        <div className="gameboard">
          {
            cards && (cards.map((card, index) => {
              return (
                <Card
                  key={index}
                  id={index}
                  card={card}
                  disabled={disabled}
                  handleCardClick={(cardId) => this.handleCardClick(cardId)}
                />
              )
            }))
          }
        </div>
        <p>Total Moves: {move.moveSteps}</p>
        <p>Moves Remain: {move.getRemainSteps()}</p>
        <p>Total Score: {score.getScore()}</p>
      </div>
    )
  }
}
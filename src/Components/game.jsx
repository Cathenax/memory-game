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
    const difficulty = new Difficulty();
    const move = new Move();
    const time = new Time();
    this.state = {
      move: move,
      time: time,
      score: score,
      difficulty: difficulty,
      playing: true,
    };
  }

  resetCards = () =>{
    const numOfCards = this.state.difficulty.cardNum / 2;
    const allCard = cardEmojis.slice(0,numOfCards);
    const shuffled = [...allCard,...allCard]
      .sort(() => Math.random() - .5)
      .map((card, index) => {
        return ({...card, disabled:false, key: index})
      });
    this.setState({
      cards: shuffled,
    });
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
    const {firstSelection, secondSelection, difficulty, cards, move, score} = this.state;
    const delayTime = difficulty.getDelayTime();
    var newCards;
    var newScore = score;
    //if only choose one or zero cards
    if(!firstSelection || !secondSelection){
      return;
    }
    else{
      //is a match
      if(firstSelection.emojiId === secondSelection.emojiId){
        // console.log('match',firstSelection.emojiId);
        newCards = cards.map((card) => {
          if(card.key === firstSelection.key){
            return {...card, matchFound : true};
          }else if(card.key === secondSelection.key){
            return {...card, matchFound : true};
          }
          else{
            return card;
          }
        })
        //increment score
        newScore = new Score();
        newScore.setScore(score.getScore()+1);
      }
      //is not a match
      else{
        //flip back the cards
        // console.log('not a match',firstSelection.emojiId, secondSelection.emojiId);
        newCards = cards.map((card) => {
          if(card.key === firstSelection.key){
            return {...card, flipped : false};
          }else if(card.key === secondSelection.key){
            return {...card, flipped : false};
          }
          else{
            return card;
          }
        });
      }
      //increment move
      const newMove = new Move(move.getMaxSteps());
      newMove.setSteps(move.getSteps()+1);
      setTimeout(() => {
        // console.log("Delayed for " + delayTime);
        this.setState({
          firstSelection: null,
          secondSelection: null,
          cards: newCards,
          move: newMove,
          score: newScore,
        });
      }, delayTime);
    }
  }

  newGame = () => {
     //default value of the game;
    this.resetCards();
    this.resetTurns();
  }

  stopOrResume = () => {
    const {playing, cards} = this.state;
    //stop the game
    if(playing){
      //clear the selections
      //diable all the buttons
      const newCards = cards.map((card) => {
        return {...card, disabled:true};
      })
      //stop counting time

      //renew the state
      this.setState({
        playing: false,
        firstSelection: null,
        secondSelection: null,
        cards: newCards,
      })
    }
    //resume the game
    else{
      //enable all the buttons
      const newCards = cards.map((card) => {
        return {...card, disabled:false};
      })
      //start counting time

      //renew the state
      this.setState({
        playing: true,
        firstSelection: null,
        secondSelection: null,
        cards: newCards,
      })
    }
  }

  //handle the click event of a card
  handleCardClick = (cardId) =>{
    const {firstSelection, secondSelection, cards, playing} = this.state;
    const clickedCard = cards[cardId];
    //if not playing
    if(playing === false){
      return;
    }
    //is a second click
    if(firstSelection){
      //handle duplicated single card click
      if(clickedCard.key === firstSelection.key){
        return;
      }
      //handle duplicate click (>2)
      else if(secondSelection){
        return;
      }
      else{
        //flip a card
        const newCards = cards.map((card) => {
          if(card.key === cardId){
            return {...card, flipped:true};
          }
          else{
            return card;
          }
        })
        this.setState({
          secondSelection: clickedCard,
          cards: newCards,
        }, 
        //call back after the state changes
        () => {
          this.matchCards();
        });
      }
    }
    // is a first click
    else{
      //flip a card
      const newCards = cards.map((card) => {
        if(card.key === cardId){
          return {...card, flipped:true};
        }
        else{
          return card;
        }
      })
      this.setState({
        firstSelection: clickedCard,
        cards: newCards,
      })
    }
    // console.log(clickedCard);
  }

  componentDidMount () {
    this.newGame();
  }

  render() {
    const {time, move, score, difficulty, cards, playing} = this.state;
    const columns = Math.sqrt(difficulty.getCardNum());
    return (
      <div>
        <button onClick={() => this.newGame()}>New Game</button>
        <button onClick={() => this.stopOrResume()}>{playing? 'Stop' : 'Resume'}</button>
        <div 
          className="gameboard"
          columns={columns}
        >
          {
            cards && (cards.map((card, index) => {
              return (
                <Card
                  key={index}
                  id={index}
                  card={card}
                  handleCardClick={(cardId) => this.handleCardClick(cardId)}
                />
              )
            }))
          }
        </div>
        <p>Total Moves: {move.getSteps()}</p>
        <p>Moves Remain: {move.getRemainSteps()}</p>
        <p>Total Time: {time.getTime()}</p>
        <p>Time Remain: {time.getRemainTime()}</p>
        <p>Total Score: {score.getScore()}</p>
      </div>
    )
  }
}
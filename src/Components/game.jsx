import React, { Component } from 'react'
import { Button, Modal, Select, Form} from 'antd';

import Card from './card';
import Time from '../Models/Time';
import Move from '../Models/Move';
import Score from '../Models/Score';
import Difficulty from '../Models/Difficulty';
import './game.css'
import { cardEmojis } from '../Utils/cardEmojis';
import MyDB from '../Utils/firebase';

export default class Game extends Component {
  constructor(props) {
    super(props);
    const score = new Score();
    const difficulty = new Difficulty();
    const move = new Move();
    const time = new Time();
    this.state = {
      cards: [],
      move: move,
      time: time,
      score: score,
      difficulty: difficulty,
      playing: true,
      showStatus: false,
    };
    this.diffRef = React.createRef();
    this.db = new MyDB();
  }

  resetMoveAndScore = (dbmove, dbscore) => {
    let newMove, newScore;
    //no data from the db
    if(!dbmove || !dbscore){
      const {move} = this.state;
      newMove = new Move(move.getMaxSteps());
      newScore = new Score();
      
    }
    else{ //load data from the db
      newMove = new Move(dbmove.maxstep, dbmove.step);
      newScore = new Score(dbscore);
    }
    this.setState({
      move: newMove,
      score: newScore,
    })
  }

  resetCards = (dbcards) =>{
    let newCards;
    //no data from db
    if(!dbcards){
      const numOfCards = this.state.difficulty.cardNum / 2;
      const allCard = cardEmojis.slice(0,numOfCards);
      newCards = [...allCard,...allCard]
        .sort(() => Math.random() - .5)
        .map((card, index) => {
          return ({...card, disabled:false, key: index})
        });
    }
    else{
      newCards = dbcards;
      debugger;
    }
    this.setState({
      cards: newCards,
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

  resetTime = (dbtime) => {
    let newTime;
    if(!dbtime){
      newTime = new Time();
    }
    else{
      newTime = new Time(dbtime.maxtime, dbtime.time);
    }
    this.setState({
      time: newTime,
    })
  }

  resetDifficulty = (dbdiffculty) => {
    let newDiff;
    if(!dbdiffculty){
      newDiff = new Difficulty();
    }
    else{
      newDiff = new Difficulty(dbdiffculty.cardnum, dbdiffculty.delaytime);
    }
    this.setState({
      difficulty: newDiff,
    })
  }

  //check two cliked cards are a match or not
  matchCards = () =>{
    const {firstSelection, secondSelection, difficulty, cards, move, score} = this.state;
    const delayTime = difficulty.getDelayTime();
    let newCards;
    let newScore = score;
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
    //Todo: show loading for have a second
    this.resetMoveAndScore();
    this.resetCards();
    this.resetTurns();
  }

  stopOrResume = async() => {
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

  updateSettings = () => {
    const difficultyOption = this.diffRef.current.getFieldsValue().difficulty;
    let cardNumber;
    if(difficultyOption === 'Easy'){
      cardNumber = 16;
    }
    else if(difficultyOption === 'Medium'){
      cardNumber = 36;
    }
    else{
      cardNumber = 64;
    }
    const newDifficulty = new Difficulty(cardNumber);
    this.setState({
      difficulty: newDifficulty,
      showStatus: false,
    },()=> {
      this.newGame();
    })
  }

  openSettings = () => {
    this.setState({
      showStatus:true,
    })
  }

  handleCancel = () => {
    //reset the form
    this.diffRef.current.resetFields();
    this.setState({
      showStatus:false,
    })
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

  handleWindowClose = async(event) => {
    event.preventDefault();
    console.log('window is closing');
    //try to store the data before window close
    await this.saveGameStatus();
  }

  saveGameStatus = async() => {
    //prepare data to store in the firestore
    const {cards, score, time, move, difficulty} = this.state;
    const userScore = score.getScore();
    const userTime = {time:time.getTime(), maxtime: time.getMaxTime()};
    const userMove = {step:move.getSteps(), maxstep:move.getMaxSteps()};
    const userDiff = {cardnum:difficulty.getCardNum(), delaytime: difficulty.getDelayTime()};
    const userData = {score:userScore, time:userTime, cards, move:userMove, difficulty:userDiff};
    await this.db.saveGameStatus(userData);
  }

  getGameStatus = async() => {
    //get game data from firestore db
    await this.db.getGameStatus();
    const userData = this.db.user;
    const {move, score, time, difficulty, cards} = userData;
    debugger;
    if(!userData){
      this.newGame();
    }
    else{
      //load data
      this.resetMoveAndScore(move,score);
      this.resetCards(cards);
      this.resetTurns();
      this.resetDifficulty(difficulty);
      this.resetTime(time);
    }
  }

  async componentDidMount () {
    await this.getGameStatus();
    window.addEventListener('beforeunload', this.handleWindowClose);
  }
  
  render() {
    const {time, move, score, difficulty, cards, playing, showStatus} = this.state;
    const columns = Math.sqrt(difficulty.getCardNum());
    return (
      <div>
        <div className='gameheader'>
          <Button size={'large'} onClick={() => this.newGame()}>New Game</Button>
          <Button size={'large'} onClick={() => this.stopOrResume()}>{playing? 'Stop' : 'Resume'}</Button>
          <Button size={'large'} onClick={() => this.openSettings()}>Settings</Button>
        </div>
        
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
          <Modal 
            title="Settings" 
            open={showStatus} 
            onOk={this.updateSettings} 
            onCancel={this.handleCancel}
            okText="OK and Restart"
          >
            <Form ref={this.diffRef}>
              <Form.Item 
                name='difficulty'
                initialValue={'Easy'}
                label='Difficulty'
              >
                <Select 
                  style={{
                    width: 120,
                  }}
                  options={[
                    {
                      value: 'Easy',
                      label: 'Easy',
                    },
                    {
                      value: 'Medium',
                      label: 'Medium',
                    },
                    {
                      value: 'Hard',
                      label: 'Hard',
                    },
                  ]}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div className='gamefooter'>
          <span>Total Moves: {move.getSteps()}</span> 
          <span>Moves Remain: {move.getRemainSteps()}</span>
          <span>Total Time: {time.getTime()}</span>
          <span>Time Remain: {time.getRemainTime()}</span>
          <span>Total Score: {score.getScore()}</span>
        </div>
        
      </div>
    )
  }
}
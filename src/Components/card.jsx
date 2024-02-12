import React, { Component } from 'react';
import PropTypes from 'prop-types';
import question from '../Utils/question.png';

export default class Card extends Component {
  static propTypes = {
    card: PropTypes.object.isRequired,  //card object from parent component(game)
    disabled: PropTypes.bool.isRequired, 
    handleCardClick: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    const {id, card, disabled, handleCardClick} = this.props;
    const {emoji, emojiId, flipped, matchFound} = card
    this.state = {
      id: id,
      emoji: emoji,
      emojiId: emojiId,
      flipped: flipped,
      matchFound: matchFound,
      disabled: disabled,
      handleCardClick: handleCardClick,
    }
  }
  render() {
    const {id, emoji, emojiId, flipped, matchFound, disabled, handleCardClick} = this.state;
    return (
      <button 
        className={`card ${matchFound ? "matched" : ""}`} 
        disabled={disabled} 
        onClick={() => handleCardClick(id)} 
        data-id={emojiId}
        id={id}
      >
        {flipped ? <div>{emoji}</div> : <img src={question} alt="?" width={80}/>}
      </button>
    )
  }
}

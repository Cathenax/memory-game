import React, { Component } from 'react'
import PropTypes from 'prop-types'
import head from '../Utils/head.svg'

export default class Card extends Component {
  static propTypes = {
    card: PropTypes.object.isRequired,  //card object from parent component(game)
    disabled: PropTypes.bool.isRequired, 
    handleCardClick: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    const {card, disabled, key, handleCardClick} = this.props;
    const {emoji, emojiId, flipped, matchFound} = card
    this.state = {
      key: key,
      emoji: emoji,
      emojiId: emojiId,
      flipped: flipped,
      matchFound: matchFound,
      disabled: disabled,
      handleCardClick: handleCardClick,
    }
  }
  render() {
    const {emoji, emojiId, flipped, matchFound, disabled, handleCardClick} = this.state;
    return (
      <button 
        className={`card ${matchFound ? "matched" : ""}`} 
        disabled={disabled} 
        onClick={handleCardClick} 
        data-id={emojiId}
      >
        {flipped ? <div>{emoji}</div> : <img src={head} alt="head" width="60" />}
      </button>
    )
  }
}

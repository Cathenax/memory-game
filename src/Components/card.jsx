import React, { Component } from 'react';
import PropTypes from 'prop-types';
import question from '../Utils/question.png';
import './card.css';

export default class Card extends Component {
  static propTypes = {
    card: PropTypes.object.isRequired,  //card object from parent component(game)
    handleCardClick: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    const {id, card, handleCardClick} = this.props;
    this.state = {
      id: id,
      card: card,
      handleCardClick: handleCardClick,
    }
  }
  //update the card
  componentDidUpdate(prevProps) {
    if (prevProps.card !== this.props.card) {
        this.setState({ card: this.props.card });
    }
  }
  render() {
    const {id, card, handleCardClick} = this.state;
    const {emoji, emojiId, flipped, matchFound, disabled} = card;
    var status;
    if(matchFound){
      status = true;
    }
    else{
      status = disabled;
    }
    return (
      <button 
        className='container'
        disabled={status} 
        onClick={() => handleCardClick(id)} 
        data-id={emojiId}
        id={id}
      >
        {flipped ? <div className='emoji'>{emoji}</div> : <div className='emoji'>{'❓'}</div>}
      </button>
    )
  }
}

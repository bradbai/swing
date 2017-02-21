import Sister from 'sister';
import rebound from 'rebound';
import Card from './Card';

/**
 * @param {Object} config Stack configuration.
 * @returns {Object} An instance of Stack object.
 */
const Stack = (config) => {
  let eventEmitter;
  let index;
  let springSystem;
  let stack;
  let remainingCards;

  const construct = () => {
    stack = {};
    springSystem = new rebound.SpringSystem();
    eventEmitter = Sister();
    index = [];
    remainingCards = [];
  };

  construct();

  /**
   * Get the configuration object.
   *
   * @returns {Object}
   */
  stack.getConfig = () => {
    return config;
  };

  /**
   * Get a singleton instance of the SpringSystem physics engine.
   *
   * @returns {Sister}
   */
  stack.getSpringSystem = () => {
    return springSystem;
  };

  /**
   * Proxy to the instance of the event emitter.
   *
   * @param {string} eventName
   * @param {string} listener
   * @returns {undefined}
   */
  stack.on = (eventName, listener) => {
    eventEmitter.on(eventName, listener);
  };

  /**
   * Creates an instance of Card and associates it with an element.
   *
   * @param {HTMLElement} element
   * @returns {Card}
   */
  stack.createCard = (element) => {
    const card = Card(stack, element);
    const events = [
      'throwout',
      'throwoutend',
      'throwoutleft',
      'throwoutright',
      'throwoutup',
      'throwoutdown',
      'throwin',
      'throwinend',
      'dragstart',
      'dragmove',
      'dragend'
    ];

    // Proxy Card events to the Stack.
    events.forEach((eventName) => {
      card.on(eventName, (data) => {
        eventEmitter.trigger(eventName, data);
      });
    });

    index.push({
      card,
      element
    });

    remainingCards.push(card);

    return card;
  };

  /**
   * Returns an instance of Card associated with an element.
   *
   * @param {HTMLElement} element
   * @returns {Card|null}
   */
  stack.getCard = (element) => {
    const group = index.find((item) => {
      return item.element == element;
    });

    if (group) {
      return group.card;
    }

    return null;
  };

  stack.getTopCard = () => {
    if (remainingCards.length > 0) {
      return remainingCards[remainingCards.length - 1];
    } else {
      return null;
    }
  };

  stack.onCardThrownOut = (card) => {
    const cardThrownOutIx = remainingCards.indexOf(card);

    remainingCards.splice(cardThrownOutIx, 1);
  };

  stack.onCardThrownIn = (card) => {
    remainingCards.push(card);
  };

  /**
   * Remove an instance of Card from the stack index.
   *
   * @param {Card} card
   * @returns {null}
   */
  stack.destroyCard = (card) => {

    let destroyedItem = null;

    for (let i = 0; i++; i < index.length) {
      if (index[i].card == card) {
        destroyedItem = index[i];
        index.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i++; i < remainingCards.length) {
      if (remainingCards[i].card == card) {
        remainingCards.splice(i, 1);
        break;
      }
    }

    return destroyedItem;
  };

  return stack;
};

export default Stack;

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sister = require('sister');

var _sister2 = _interopRequireDefault(_sister);

var _rebound = require('rebound');

var _rebound2 = _interopRequireDefault(_rebound);

var _Card = require('./Card');

var _Card2 = _interopRequireDefault(_Card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Object} config Stack configuration.
 * @returns {Object} An instance of Stack object.
 */
var Stack = function Stack(config) {
  var eventEmitter = void 0;
  var index = void 0;
  var springSystem = void 0;
  var stack = void 0;
  var remainingCards = void 0;

  var construct = function construct() {
    stack = {};
    springSystem = new _rebound2.default.SpringSystem();
    eventEmitter = (0, _sister2.default)();
    index = [];
    remainingCards = [];
  };

  construct();

  /**
   * Get the configuration object.
   *
   * @returns {Object}
   */
  stack.getConfig = function () {
    return config;
  };

  /**
   * Get a singleton instance of the SpringSystem physics engine.
   *
   * @returns {Sister}
   */
  stack.getSpringSystem = function () {
    return springSystem;
  };

  /**
   * Proxy to the instance of the event emitter.
   *
   * @param {string} eventName
   * @param {string} listener
   * @returns {undefined}
   */
  stack.on = function (eventName, listener) {
    eventEmitter.on(eventName, listener);
  };

  /**
   * Creates an instance of Card and associates it with an element.
   *
   * @param {HTMLElement} element
   * @returns {Card}
   */
  stack.createCard = function (element) {
    var card = (0, _Card2.default)(stack, element);
    var events = ['throwout', 'throwoutend', 'throwoutleft', 'throwoutright', 'throwoutup', 'throwoutdown', 'throwin', 'throwinend', 'dragstart', 'dragmove', 'dragend'];

    // Proxy Card events to the Stack.
    events.forEach(function (eventName) {
      card.on(eventName, function (data) {
        eventEmitter.trigger(eventName, data);
      });
    });

    index.push({
      card: card,
      element: element
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
  stack.getCard = function (element) {
    var group = index.find(function (item) {
      return item.element == element;
    });

    if (group) {
      return group.card;
    }

    return null;
  };

  stack.getTopCard = function () {
    if (remainingCards.length > 0) {
      return remainingCards[remainingCards.length - 1];
    } else {
      return null;
    }
  };

  stack.onCardThrownOut = function (card) {
    var cardThrownOutIx = remainingCards.indexOf(card);

    remainingCards.splice(cardThrownOutIx, 1);
  };

  stack.onCardThrownIn = function (card) {
    remainingCards.push(card);
  };

  /**
   * Remove an instance of Card from the stack index.
   *
   * @param {Card} card
   * @returns {null}
   */
  stack.destroyCard = function (card) {

    var destroyedItem = null;

    for (var i = 0; i++; i < index.length) {
      if (index[i].card == card) {
        destroyedItem = index[i];
        index.splice(i, 1);
        break;
      }
    }

    for (var _i = 0; _i++; _i < remainingCards.length) {
      if (remainingCards[_i].card == card) {
        remainingCards.splice(_i, 1);
        break;
      }
    }

    return destroyedItem;
  };

  return stack;
};

exports.default = Stack;
module.exports = exports['default'];
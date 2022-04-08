import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { readFeedback, saveFeedback } from '../services/localStorage';

class Feedback extends Component {
  componentDidMount() {
    const { name, gravatarEmail, assertionsProps, scoreProps } = this.props;

    const playerImage = md5(gravatarEmail).toString();
    const picture = `https://www.gravatar.com/avatar/${playerImage}`;

    if (!JSON.parse(localStorage.getItem('rankList'))) {
      localStorage.setItem('rankList', JSON.stringify([]));
    }

    const info = {
      name, score: scoreProps, assertions: assertionsProps, picture };
    const storageRanking = readFeedback();

    if (info.name) {
      const hasFeedback = storageRanking.some(
        (feedback) => feedback.name === info.name
        && feedback.score === info.score
        && feedback.assertions === info.assertions
        && feedback.picture === info.picture,
      );

      if (!hasFeedback) saveFeedback([...storageRanking, info]);
    }
  }

  redirectLogin = () => {
    const { history } = this.props;
    history.push('/');
  }

  redirectRanking = () => {
    const { history } = this.props;
    history.push('/ranking');
  }

  render() {
    const { assertionsProps, scoreProps } = this.props;
    const minimumAssertions = 3;

    return (
      <>
        <Header />
        <div
          data-testid="feedback-text"
        >
          {assertionsProps >= minimumAssertions
            ? 'Well Done!' : 'Could be better...'}
        </div>
        <div
          data-testid="feedback-total-question"
        >
          {assertionsProps}
        </div>
        <div
          data-testid="feedback-total-score"
        >
          {scoreProps}
        </div>
        <button
          data-testid="btn-play-again"
          type="button"
          onClick={ this.redirectLogin }
        >
          Play Again
        </button>
        <button
          data-testid="btn-ranking"
          type="button"
          onClick={ this.redirectRanking }
        >
          Ranking
        </button>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  assertionsProps: state.player.assertions,
  scoreProps: state.player.score,
  name: state.player.name,
  gravatarEmail: state.player.gravatarEmail,
});

Feedback.propTypes = {
  assertionsProps: PropTypes.number,
  scoreProps: PropTypes.number,
}.isRequired;

export default connect(mapStateToProps)(Feedback);

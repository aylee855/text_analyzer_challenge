var state = {
  questions: [
    {
      text: "What color is the sky?",
      choices: ["red", "yellow", "blue", "green"],
      correctChoiceIndex: 2
    },
    {
      text: "How many days are there in a year?",
      choices: ["365", "536", "635", "356"],
      correctChoiceIndex: 0
    },
    {
      text: "Who was the first president of the United States of America?",
      choices: ["George Bush", "George Washington", "Donald Trump", "Barack Obama"],
      correctChoiceIndex: 1,
    },
    {
      text: "Which of the below is not a season?",
      choices: ["Spring", "Summer", "Winter", "Autumn"],
      correctChoiceIndex: 3,
    },
    {
      text: "How many stars are on the U.S. flag?",
      choices: ["30", "40", "50", "60"],
      correctChoiceIndex: 2,
    }
  ],
  praises : [
    "Very nice."
  ],

  admonishments: [
    "Come on...try harder."

  ],
  score: 0,
  currentQuestionIndex: 0,
  route: 'start',
  lastAnswerCorrect: false,
  feedbackRandom: 0
};

function setRoute(state, route) {
  state.route = route;
};

function resetGame(state) {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

function answerQuestion(state, answer) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
  if (state.lastAnswerCorrect) {
    state.score++;
  }
  selectFeedback(state);
  setRoute(state, 'incorrect');
};

function selectFeedback(state) {
  state.feedbackRandom = Math.random();
};

function advance(state) {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex === state.questions.length) {
    setRoute(state, 'results');
  }
  else {
    setRoute(state, 'question');
  }
};

function renderApp(state, elements) {
  Object.keys(elements).forEach(function(route) {
    elements[route].hide();
  });
  elements[state.route].show();

  if (state.route === 'start') {
      renderStartPage(state, elements[state.route]);
  }
  else if (state.route === 'question') {
      renderQuestionPage(state, elements[state.route]);
  }
  else if (state.route === 'incorrect') {
    renderIncorrectPage(state, elements[state.route]);
  }
  else if (state.route === 'results') {
    renderResultsPage(state, elements[state.route]);
  }
};

function renderStartPage(state, element) {
};

function renderQuestionPage(state, element) {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
};

function renderIncorrectPage(state, element) {
  renderIncorrectPageHeader(state, element.find(".incorrect-header"));
  renderIncorrectPageText(state, element.find(".incorrect-text"));
  renderNextButtonText(state, element.find(".see-next"));
};

function renderResultsPage(state, element) {
  renderResultsText(state, element.find('.results-text'));
};

function renderQuestionCount(state, element) {
  var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
  element.text(text);
};

function renderQuestionText(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

function renderChoices(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = currentQuestion.choices.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer" value="' + index + '" required>' +
        '<label>' + choice + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderIncorrectPageHeader(state, element) {
  var html = state.lastAnswerCorrect ?
      "<h1 class='answer-correct'>Correct!</h1>" :
      "<h1 class='answer-incorrect'>Wrong answer!</h1>";

  element.html(html);
};

function renderIncorrectPageText(state, element) {
  var choices = state.lastAnswerCorrect ? state.praises : state.admonishments;
  var text = choices[Math.floor(state.feedbackRandom * choices.length)];
  element.text(text);
};

function renderNextButtonText(state, element) {
    var text = state.currentQuestionIndex < state.questions.length - 1 ?
      "Next" : "See test results";
  element.text(text);
};

function renderResultsText(state, element) {
  var text = "You got " + state.score + " out of " +
    state.questions.length + " questions right.";
  element.text(text);
};

var PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'incorrect': $('.incorrect-page'),
  'results': $('.results-page')
};

$("form[name='begin']").submit(function(event) {
  event.preventDefault();
  setRoute(state, 'question');
  renderApp(state, PAGE_ELEMENTS);
});

$(".restart-game").click(function(event){
  event.preventDefault();
  resetGame(state);
  renderApp(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(function(event) {
  event.preventDefault();
  var answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(state, answer);
  renderApp(state, PAGE_ELEMENTS);
});

$(".see-next").click(function(event) {
  advance(state);
  renderApp(state, PAGE_ELEMENTS);
});

$(function() { renderApp(state, PAGE_ELEMENTS); });
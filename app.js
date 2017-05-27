function openAlertWindow() {
  window.open(location.href, location.href, 'menubar=0,resizable=1,width=1000,height=600,titlebar=no');
}

function init() {
  var APP = document.getElementById('app');
  var participantID = window.location.search.replace('?', '').split('=')[1];

  function renderTutorial(){
    console.log('rendering the tutorial');
    var title = document.createElement('h1');
    title.innerHTML = 'Extra Life Alerts';
    APP.appendChild(title);

    var notParticipantSteps = [
      'Sign up with extra life <a target="_blank" href="http://extra-life.org">Extra Life</a>',
      'Navigate to your profile page',
      'Copy your participantID from the URL',
      'Go to http://lanzo.space/extralifealert?participantID=[YOUT participantID HERE]'
    ]
    var steps = [
      'Set up window capture on this page (If using chrome and OBS, you might have to disable hardware acceleration due to black screen -> Settings -> Scroll Down -> Show Advanced Settings -> System -> Uncheck "Use Hardware acceleration when available")',
      'Start Streaming! Your Donations will appear in this window when you get them!'
    ]
    var ol = document.createElement('ol');
    if(!participantID) {
      notParticipantSteps.forEach(function(step){
        var li = document.createElement('li');
        li.innerHTML = step;
        ol.appendChild(li);
      });
    }
    steps.forEach(function(step){
      var li = document.createElement('li');
      li.innerHTML = step;
      ol.appendChild(li);
    });
    APP.appendChild(ol);
    var settingsButton = document.createElement('button');
    settingsButton.innerHTML = 'All Done? Configure Notification >';
    settingsButton.addEventListener('click', function(){
      STATE.changeState('SETTINGS');
    });

    APP.appendChild(settingsButton);
  }
  function renderSettings(){
    console.log('rendering the settings');
    var title = document.createElement('h1');
    title.innerHTML = 'Settings';
    APP.appendChild(title);

    var customImageWrapper = document.createElement('div');
    var customImageLabel = document.createElement('label');
    customImageLabel.innerHTML = 'Custom Image URL';
    var customImageInput = document.createElement('input');
    customImageWrapper.appendChild(customImageLabel);
    customImageWrapper.appendChild(customImageInput);

    var customAudioWrapper = document.createElement('div');
    var customAudioLabel = document.createElement('label');
    customAudioLabel.innerHTML = 'Custom Audio URL';
    var customAudioInput = document.createElement('input');
    customAudioWrapper.appendChild(customAudioLabel);
    customAudioWrapper.appendChild(customAudioInput);

    APP.appendChild(customImageWrapper);
    APP.appendChild(customAudioWrapper);

    var feedButton = document.createElement('button');
    feedButton.innerHTML = 'Save and go to Feed';
    feedButton.addEventListener('click', function(){
      STATE.changeState('FEED');
    });

    APP.appendChild(feedButton);

  }

  function renderFeed(){
    console.log('rendering the feed');
  }

  var config = {
    image: 'http://lanzo.space/extralifealert/fbLogo.jpg',
    audio: 'http://lanzo.space/extralifealert/thanks.ogg'
  }

  var STATE = {
    TUTORIAL: { renderMethod: renderTutorial },
    SETTINGS: { renderMethod: renderSettings },
    FEED: { renderMethod: renderFeed },
    currentState: 'TURORIAL',
    changeState: function(state){
      APP.classList.remove(STATE.currentState.toLowerCase());
      STATE.currentState = state;
      APP.classList.add(STATE.currentState.toLowerCase());
      while (APP.hasChildNodes()) {
        APP.removeChild(APP.lastChild);
      }
      STATE[state].renderMethod();
    }
  }
  STATE.changeState('TUTORIAL');
  window.STATE = STATE;
}

document.addEventListener('DOMContentLoaded', init);

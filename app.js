var test = false;
var donationsQueue = [];
var test2 = false;
var CHECK_INTERVAL = 5000;
var donationsInterval;
var fetchInterval;

function openAlertWindow() {
  window.open(location.href, location.href, 'menubar=0,resizable=1,width=1000,height=600,titlebar=no');
}

function processDonations(donations) {
  var promise = new Promise(function(resolve, reject){
    var sliced = donations.slice(0, 10);
    var currentTime = new Date().getTime();
    if(test) {
      var q = new Date().getTime() - 5;
      sliced.push({
        message: "Hello World",
        createdOn: q,
        donorName: 'thelanzolini',
        avatarImageURL: "//assets.donordrive.com/clients/extralife/img/avatar-constituent-default.gif",
        donationAmount: 5
      });
      test2 = true;
    }

    test = true;

    sliced.forEach(function(donation, index){
      var donationTime = new Date(donation.createdOn).getTime();
      if(currentTime - donationTime < CHECK_INTERVAL){
        donationsQueue.push(donation);
      }
    });

    donationsCache = sliced;
    resolve(sliced);
  });
  return promise;
}

function fetchRecentDonations(participantID) {
  if(test2) return;
  return window.fetch('http://www.extra-life.org/index.cfm?fuseaction=donorDrive.participantDonations&participantID='+ participantID +'&format=json')
    .then(function(response){
      return response.json();
    })
    .then(processDonations)
  ;
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
    customImageInput.setAttribute('type', 'text');
    customImageWrapper.appendChild(customImageLabel);
    customImageWrapper.appendChild(customImageInput);

    var customAudioWrapper = document.createElement('div');
    var customAudioLabel = document.createElement('label');
    customAudioLabel.innerHTML = 'Custom Audio URL';
    var customAudioInput = document.createElement('input');
    customAudioInput.setAttribute('type', 'text');
    customAudioWrapper.appendChild(customAudioLabel);
    customAudioWrapper.appendChild(customAudioInput);

    var tooltip = document.createElement('div');
    tooltip.innerHTML = 'Keep fields blank to default image/audio';

    APP.appendChild(tooltip);
    APP.appendChild(customImageWrapper);
    APP.appendChild(customAudioWrapper);

    var feedButton = document.createElement('button');
    feedButton.innerHTML = 'Save and go to Feed';
    feedButton.addEventListener('click', function(){
      if(!!customImageInput.value){
        config.image = customImageInput.value;
      }
      if(!!customAudioInput.value){
        config.audio = customImageInput.value;
      }
      STATE.changeState('FEED');
    });

    APP.appendChild(feedButton);

  }

  function renderFeed(){
    console.log('rendering the feed');
    console.log(config);
    var donationAlert = document.createElement('div');
    donationAlert.classList.add('hidden', 'donation-alert');
    var donationText = document.createElement('div');

    var audio = document.createElement('audio');
    audio.src = config.audio;

    var donationImg = document.createElement('img');
    donationImg.src = config.image;

    donationAlert.appendChild(donationImg);
    donationAlert.appendChild(donationText);

    APP.appendChild(donationAlert);

    fetchInterval = setInterval(function(){
      fetchRecentDonations(participantID).then(console.log)
    }, CHECK_INTERVAL);

    donationsInterval = setInterval(function(){
      var donation = donationsQueue.pop();
      if(!!donation){
        console.log("NEW DONATION", donation);
        audio.play();
        donationAlert.classList.add('fade');
        donationText.innerHTML = donation.message;
        setTimeout(function(){
          donationText.innerHTML = '';
        }, 4500);
      }
    }, 5000);

  }

  var config = {
    image: 'http://lanzo.space/extralifealert/controller_blue.png',
    audio: 'http://lanzo.space/extralifealert/thanks.ogg'
  }

  var STATE = {
    TUTORIAL: { renderMethod: renderTutorial },
    SETTINGS: { renderMethod: renderSettings },
    FEED: { renderMethod: renderFeed },
    currentState: 'FEED',
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
  STATE.changeState('FEED');
  window.STATE = STATE;
}

document.addEventListener('DOMContentLoaded', init);

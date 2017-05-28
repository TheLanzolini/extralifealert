function openFeedWindow(url, name) {
  window.open(url, name, 'menubar=0,resizable=1,width=1000,height=600,titlebar=no');
}

function init() {
  var APP = document.getElementById('app');
  var participantID = window.location.search.replace('?', '').split('=')[1];

  function renderTutorial(){
    console.log('rendering the tutorial');
    var title = document.createElement('h1');
    title.innerHTML = 'Extra Life Alerts';
    APP.appendChild(title);

    var steps = [
      'Log In/Sign up with extra life <a target="_blank" href="http://extra-life.org">Extra Life</a>',
      'Navigate to your profile page',
      'Copy your participantID from the URL',
      'Continue to the Settings',
      'Customize your alert box (Optional)',
      'Hit Save to generate your alertbox URL',
      'Either Capture the alertbox with Window Capture, or use a BrowserSource Plugin.( <a target="_blank" href="https://obsproject.com/forum/resources/clr-browser-source-plugin-obs-classic-only.22/">OBS</a>, <a target="_blank" href="https://obsproject.com/forum/resources/browser-plugin.115/">OBS Studio</a> )',
      'Start Streaming! Your Donations will appear in this window when you get them!'
    ]
    var ol = document.createElement('ol');
    steps.forEach(function(step){
      var li = document.createElement('li');
      li.innerHTML = step;
      ol.appendChild(li);
    });
    APP.appendChild(ol);
    var settingsButton = document.createElement('button');
    settingsButton.innerHTML = 'Alert Settings >';
    settingsButton.addEventListener('click', function(){
      STATE.changeState('SETTINGS');
    });

    APP.appendChild(settingsButton);

    var faqsWrapper = document.createElement('div');
    var faqsTitle = document.createElement('h1');
    faqsTitle.innerHTML = 'Issues you may have.'
    var faqsContent = document.createElement('div');
    const faqs = [
      'If your chrome window is black when capturing, you may have to disable Hardware Acceleration',
      'Settings -> Scroll Down -> Show Advanced Settings -> System -> "Uncheck Use Hardware Acceleration when available"'
    ]
    faqs.forEach(function(faq){
      var faqElem = document.createElement('div');
      faqElem.innerHTML = faq;
      faqsContent.appendChild(faqElem);
    });

    faqsWrapper.appendChild(faqsTitle);
    faqsWrapper.appendChild(faqsContent);
    APP.appendChild(faqsWrapper);

  }
  function renderSettings(){

    var config = {
      image: 'http://lanzo.space/extralifealert/fbLogo.jpg',
      audio: 'http://lanzo.space/extralifealert/thanks.ogg',
      participantID: ''
    }

    if(localStorage.getItem('config')){
      config = JSON.parse(localStorage.getItem('config'));
    }

    var title = document.createElement('h1');
    title.innerHTML = 'Settings';
    APP.appendChild(title);

    var customImageWrapper = document.createElement('div');
    var customImageLabel = document.createElement('label');
    customImageLabel.innerHTML = 'Custom Image URL';
    var customImageInput = document.createElement('input');
    customImageInput.setAttribute('type', 'text');
    customImageInput.value = config.image;
    customImageWrapper.appendChild(customImageLabel);
    customImageWrapper.appendChild(customImageInput);

    var customAudioWrapper = document.createElement('div');
    var customAudioLabel = document.createElement('label');
    customAudioLabel.innerHTML = 'Custom Audio URL';
    var customAudioInput = document.createElement('input');
    customAudioInput.setAttribute('type', 'text');
    customAudioInput.value = config.audio;
    customAudioWrapper.appendChild(customAudioLabel);
    customAudioWrapper.appendChild(customAudioInput);

    var tooltip = document.createElement('div');
    tooltip.innerHTML = 'Check the debug box to open window with unhidden Alert for OBS fiddling.';

    var participantIDWrapper = document.createElement('div');
    var participantIDLabel = document.createElement('label');
    participantIDLabel.innerHTML = 'participantID';
    var participantIDInput = document.createElement('input');
    participantIDInput.setAttribute('type', 'text');
    participantIDInput.value = config.participantID;
    participantIDWrapper.appendChild(participantIDLabel);
    participantIDWrapper.appendChild(participantIDInput);

    var debugWrapper = document.createElement('div');
    var debugLabel = document.createElement('label');
    debugLabel.innerHTML = 'Debug';
    var debugCheckbox = document.createElement('input');
    debugCheckbox.setAttribute('type', 'checkbox');
    debugCheckbox.checked = config.debug;
    debugWrapper.appendChild(debugLabel);
    debugWrapper.appendChild(debugCheckbox);


    APP.appendChild(participantIDWrapper);
    APP.appendChild(tooltip);
    APP.appendChild(customImageWrapper);
    APP.appendChild(customAudioWrapper);
    APP.appendChild(debugWrapper);

    var urlWrapper = document.createElement('div');
    var urlTooltip = document.createElement('div');
    var urlLink = document.createElement('textarea');
    urlLink.classList.add('url-link', 'hidden');
    urlLink.setAttribute('readonly', '');
    var launchButton = document.createElement('button');
    launchButton.classList.add('hidden');
    launchButton.innerHTML = 'Launch!';

    urlWrapper.appendChild(urlLink);
    urlWrapper.appendChild(launchButton);

    var url;

    var feedButton = document.createElement('button');
    feedButton.innerHTML = 'Save';
    feedButton.addEventListener('click', function(){
      if(!!customImageInput.value){
        config.image = customImageInput.value;
      }
      if(!!customAudioInput.value){
        config.audio = customAudioInput.value;
      }

      config.participantID = participantIDInput.value;

      if(debugCheckbox.checked) {
        config.debug = true;
      }else{
        delete(config.debug);
      }

      localStorage.setItem('config', JSON.stringify(config));

      var configUri = Object.keys(config).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(config[k]);
      }).join('&');

      var u = location.protocol == 'file:' ? 'file:///C:/Users/TheLa/projects/extralifealert/feed/index.html' : 'http://lanzo.space/extralifealert/feed/';
      url = u + '?' + configUri;
      urlLink.innerHTML = url;
      urlLink.classList.remove('hidden');
      launchButton.classList.remove('hidden');
    });

    launchButton.addEventListener('click', function(){
      openFeedWindow(url, 'Extra Life Alert Feed');
    });

    APP.appendChild(feedButton);
    APP.appendChild(urlWrapper);

  }

  var STATE = {
    TUTORIAL: { renderMethod: renderTutorial },
    SETTINGS: { renderMethod: renderSettings },
    currentState: 'TUTORIAL',
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

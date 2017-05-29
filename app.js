function openFeedWindow(url, name) {
  window.open(url, name, 'menubar=0,resizable=1,width=1000,height=600,titlebar=no');
}

function init() {
  var APP = document.getElementById('app');
  var participantID = window.location.search.replace('?', '').split('=')[1];

  function renderTutorial(){
    var title = document.createElement('h1');
    title.innerHTML = 'Extra Life Alerts';
    APP.appendChild(title);

    var steps = [
      'Log In/Sign up with <a target="_blank" href="http://extra-life.org">Extra Life</a>',
      'Navigate to your profile page (top right dropdown -> profile)',
      'Copy your participantID from the URL (the number following "participantID=")',
      'Come back to this page',
      'Click the Settings button below',
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

    var aboutWrapper = document.createElement('div');
    aboutWrapper.classList.add('about');
    var aboutTitle = document.createElement('h1');
    aboutTitle.innerHTML = 'About';
    var aboutText = document.createElement('div');
    const aboutTexts = [
      'This Alert Web App was developed for Extra Life, for free, and can be used for free.',
      'Thank you for your contribution to this great cause.',
      'If you have any issues, comments, concerns or questions, email me: <a href="mailto:thelanzolini@gmail.com">thelanzolini@gmail.com</a>',
      'Developed by TheLanzolini, with some help from Twitch Chat : )'
    ]

    var avatarWrapper = document.createElement('div');
    avatarWrapper.classList.add('avatar-wrapper');
    var avatarImage = document.createElement('img');
    avatarImage.src = 'http://lanzo.space/extralifealert/lanzo_avatar.jpg';
    var avatarTwitch = document.createElement('a');
    avatarTwitch.href = 'http://twitch.tv/thelanzolini';
    avatarTwitch.textContent = 'twitch.tv/thelanzolini';
    var avatarExtraLife = document.createElement('a');
    avatarExtraLife.href = 'https://www.extra-life.org/participant/thelanzolini';
    avatarExtraLife.textContent = 'extra-life.org/participant/thelanzolini';

    avatarWrapper.appendChild(avatarImage);
    avatarWrapper.appendChild(avatarTwitch);
    avatarWrapper.appendChild(avatarExtraLife);

    // <a target="_blank" href="https://www.extra-life.org/participant/thelanzolini">Extra Life Page</a>, <a target="_blank" href="https://www.twitch.tv/thelanzolini">Twitch</a>

    aboutTexts.forEach(function(text){
      var textElem = document.createElement('div');
      textElem.innerHTML = text;
      aboutText.appendChild(textElem);
    });

    aboutWrapper.appendChild(aboutTitle);
    aboutWrapper.appendChild(aboutText);
    aboutWrapper.appendChild(avatarWrapper);

    APP.appendChild(aboutWrapper);

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
    if(config.noImage){
      customImageWrapper.classList.add('invisible');
    }

    var customAudioWrapper = document.createElement('div');
    var customAudioLabel = document.createElement('label');
    customAudioLabel.innerHTML = 'Custom Audio URL';
    var customAudioInput = document.createElement('input');
    customAudioInput.setAttribute('type', 'text');
    customAudioInput.value = config.audio;
    customAudioWrapper.appendChild(customAudioLabel);
    customAudioWrapper.appendChild(customAudioInput);
    if(config.noAudio){
      customAudioWrapper.classList.add('invisible');
    }

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

    var noImageWrapper = document.createElement('div');
    var noImageLabel = document.createElement('label');
    noImageLabel.innerHTML = 'Disable Image';
    var noImageCheckbox = document.createElement('input');
    noImageCheckbox.setAttribute('type', 'checkbox');
    noImageCheckbox.checked = config.noImage;
    noImageWrapper.appendChild(noImageLabel);
    noImageWrapper.appendChild(noImageCheckbox);
    noImageCheckbox.addEventListener('click', function(){
      customImageWrapper.classList[noImageCheckbox.checked ? 'add' : 'remove']('invisible');
    });

    var noAudioWrapper = document.createElement('div');
    var noAudioLabel = document.createElement('label');
    noAudioLabel.innerHTML = 'Disable Audio';
    var noAudioCheckbox = document.createElement('input');
    noAudioCheckbox.setAttribute('type', 'checkbox');
    noAudioCheckbox.checked = config.noAudio;
    noAudioWrapper.appendChild(noAudioLabel);
    noAudioWrapper.appendChild(noAudioCheckbox);
    noAudioCheckbox.addEventListener('click', function(){
      customAudioWrapper.classList[noAudioCheckbox.checked ? 'add' : 'remove']('invisible');
    });

    var debugWrapper = document.createElement('div');
    var debugLabel = document.createElement('label');
    debugLabel.innerHTML = 'Debug';
    var debugCheckbox = document.createElement('input');
    debugCheckbox.setAttribute('type', 'checkbox');
    debugCheckbox.checked = config.debug;
    debugWrapper.appendChild(debugLabel);
    debugWrapper.appendChild(debugCheckbox);


    APP.appendChild(participantIDWrapper);
    APP.appendChild(noImageWrapper);
    APP.appendChild(noAudioWrapper);
    APP.appendChild(customImageWrapper);
    APP.appendChild(customAudioWrapper);
    APP.appendChild(tooltip);
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
      if(!participantIDInput.value){
        alert('participantID Field Left Blank, please enter your participantID');
        return;
      }

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
      if(noImageCheckbox.checked) {
        config.noImage = true;
      }else{
        delete(config.noImage);
      }
      if(noAudioCheckbox.checked) {
        config.noAudio = true;
      }else{
        delete(config.noAudio);
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

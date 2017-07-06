function openFeedWindow(url, name) {
  window.open(url, name, 'menubar=0,resizable=1,width=1000,height=600,titlebar=no');
}

function openRecentWindow(url, name, size, limit){
  window.open(url, name, 'menubar=0,resizable=1,width=300,height=600,title=no');
}

function init() {
  var APP = document.getElementById('app');

  function renderTutorial(){
    var title = document.createElement('h1');
    title.innerHTML = 'Extra Life Alerts';
    APP.appendChild(title);

    var alreadyKnow = document.createElement('div');
    alreadyKnow.classList.add('already-know');
    alreadyKnowText = document.createElement('div');
    alreadyKnowText.innerHTML = 'Have your participantID and know what to do?';
    alreadyKnowButton = document.createElement('button');
    alreadyKnowButton.innerHTML = 'Go Right to Settings >';
    alreadyKnowButton.addEventListener('click', function(){
      STATE.changeState('SETTINGS');
    });
    alreadyKnow.appendChild(alreadyKnowText);
    alreadyKnow.appendChild(alreadyKnowButton);
    APP.appendChild(alreadyKnow);

    var tutorialTitle = document.createElement('h1');
    tutorialTitle.innerHTML = 'Getting Started';
    APP.appendChild(tutorialTitle);

    var steps = [
      'Log In/Sign up with <a target="_blank" href="http://extra-life.org">Extra Life</a>',
      'Navigate to your profile page (top right dropdown -> profile)',
      'Click on the event (Extra Life 2017)',
      'Copy your participantID from the URL (the number following "participantID=")',
      'Come back to this page',
      'Click the Settings button below',
      'Customize your alert box (Optional)',
      'Hit Save to generate your alertbox URL',
      'Either Capture the alertbox with a BrowserSource Plugin for best results.( <a target="_blank" href="https://obsproject.com/forum/resources/clr-browser-source-plugin-obs-classic-only.22/">OBS</a>, <a target="_blank" href="https://obsproject.com/forum/resources/browser-plugin.115/">OBS Studio</a> ) or with Window Capture.',
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
      'Settings -> Scroll Down -> Show Advanced Settings -> System -> "Uncheck Use Hardware Acceleration when available"',
      'If your custom Image/Audio file(s) aren\'t playing, check to see if they are https://',
      'We can only use images and audio under http://'
    ]
    faqs.forEach(function(faq){
      var faqElem = document.createElement('div');
      faqElem.innerHTML = faq;
      faqsContent.appendChild(faqElem);
    });

    faqsWrapper.appendChild(faqsTitle);
    faqsWrapper.appendChild(faqsContent);
    APP.appendChild(faqsWrapper);

    var recentDonationsWrapper = document.createElement('div');
    recentDonationsWrapper.classList.add('recent-donations');
    var recentDonationsTitle = document.createElement('h1');
    recentDonationsTitle.innerHTML = 'Recent Donations Module';
    var recentDonationsText = document.createElement('div');
    recentDonationsText.innerHTML = 'If you would like to display the most recent donations on your stream as well, click the button below';
    var recentDonationsButton = document.createElement('button');
    recentDonationsButton.innerHTML = 'Recent Donations Module >';
    recentDonationsButton.addEventListener('click', function(){
      STATE.changeState('RECENT_DONATIONS');
    });
    recentDonationsWrapper.appendChild(recentDonationsTitle);
    recentDonationsWrapper.appendChild(recentDonationsText);
    recentDonationsWrapper.appendChild(recentDonationsButton);
    APP.appendChild(document.createElement('br'));
    APP.appendChild(recentDonationsWrapper);

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
    avatarTwitch.target = '_blank';
    var avatarExtraLife = document.createElement('a');
    avatarExtraLife.href = 'https://www.extra-life.org/participant/thelanzolini';
    avatarExtraLife.textContent = 'extra-life.org/participant/thelanzolini';
    avatarExtraLife.target = '_blank';
    var avatarGithub = document.createElement('a');
    avatarGithub.href = 'http://github.com/thelanzolini/extralifealert';
    avatarGithub.textContent = 'github.com/thelanzolini/extralifealert';
    avatarGithub.target = '_blank';

    avatarWrapper.appendChild(avatarImage);
    avatarWrapper.appendChild(avatarTwitch);
    avatarWrapper.appendChild(avatarExtraLife);
    avatarWrapper.appendChild(avatarGithub);

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
      participantID: '',
      noImage: false,
      noAudio: false,
      animation: 'fade',
      volume: 50
    }

    if(localStorage.getItem('config')){
      config = JSON.parse(localStorage.getItem('config'));
    }

    var title = document.createElement('h1');
    title.innerHTML = 'Settings';
    APP.appendChild(title);

    var backButton = document.createElement('div');
    backButton.classList.add('back-button');
    backButton.innerHTML = 'Go Back';
    backButton.addEventListener('click', function(){
      STATE.changeState('TUTORIAL');
    });
    APP.appendChild(backButton);

    var customImageWrapper = document.createElement('div');
    var customImageLabel = document.createElement('label');
    customImageLabel.innerHTML = 'Image URL';
    var customImageInput = document.createElement('input');
    customImageInput.setAttribute('type', 'text');
    customImageInput.value = config.image;
    customImageWrapper.appendChild(customImageLabel);
    customImageWrapper.appendChild(customImageInput);
    customImageLabel.setAttribute('for', 'custom-image');
    customImageInput.id = 'custom-image';
    if(config.noImage){
      customImageWrapper.classList.add('invisible');
    }

    var customAudioWrapper = document.createElement('div');
    var customAudioLabel = document.createElement('label');
    customAudioLabel.innerHTML = 'Audio URL';
    var customAudioInput = document.createElement('input');
    customAudioInput.setAttribute('type', 'text');
    customAudioInput.value = config.audio;
    customAudioWrapper.appendChild(customAudioLabel);
    customAudioWrapper.appendChild(customAudioInput);
    customAudioLabel.setAttribute('for', 'custom-audio');
    customAudioInput.id = 'custom-audio';
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
    participantIDLabel.setAttribute('for', 'participantID');
    participantIDInput.id = 'participantID';

    var noImageWrapper = document.createElement('div');
    var noImageLabel = document.createElement('label');
    noImageLabel.innerHTML = 'Enable Image';
    var noImageCheckbox = document.createElement('input');
    noImageCheckbox.setAttribute('type', 'checkbox');
    noImageCheckbox.checked = !config.noImage;
    noImageWrapper.appendChild(noImageLabel);
    noImageWrapper.appendChild(noImageCheckbox);
    noImageCheckbox.addEventListener('click', function(){
      customImageWrapper.classList[!noImageCheckbox.checked ? 'add' : 'remove']('invisible');
    });
    noImageLabel.setAttribute('for', 'no-image');
    noImageCheckbox.id = 'no-image';

    var volumeWrapper = document.createElement('div');
    volumeWrapper.classList.add('volume');
    var volumeLabel = document.createElement('div');
    var volumeLevel = document.createElement('span');
    volumeLevel.innerHTML = (config.volume / 10);
    volumeLabel.setAttribute('for', 'volume');
    volumeLabel.innerHTML = 'Notification Volume';
    var volumeInput = document.createElement('input');
    volumeInput.setAttribute('type', 'range');
    volumeInput.setAttribute('step', '10');
    volumeInput.value = config.volume;
    volumeInput.id = 'volume';
    volumeInput.addEventListener('input', function(){
      volumeLevel.innerHTML = (volumeInput.value / 10);
    });
    volumeWrapper.appendChild(volumeLabel);
    volumeWrapper.appendChild(volumeLevel);
    volumeWrapper.appendChild(volumeInput);

    var noAudioWrapper = document.createElement('div');
    var noAudioLabel = document.createElement('label');
    noAudioLabel.innerHTML = 'Enable Audio';
    var noAudioCheckbox = document.createElement('input');
    noAudioCheckbox.setAttribute('type', 'checkbox');
    noAudioCheckbox.checked = !config.noAudio;
    noAudioWrapper.appendChild(noAudioLabel);
    noAudioWrapper.appendChild(noAudioCheckbox);
    noAudioCheckbox.addEventListener('click', function(){
      customAudioWrapper.classList[!noAudioCheckbox.checked ? 'add' : 'remove']('invisible');
      volumeWrapper.classList[!noAudioCheckbox.checked ? 'add' : 'remove']('invisible');
    });
    noAudioLabel.setAttribute('for', 'no-audio');
    noAudioCheckbox.id = 'no-audio';

    var debugWrapper = document.createElement('div');
    var debugLabel = document.createElement('label');
    debugLabel.innerHTML = 'Debug';
    var debugCheckbox = document.createElement('input');
    debugCheckbox.setAttribute('type', 'checkbox');
    debugCheckbox.checked = config.debug;
    debugWrapper.appendChild(debugLabel);
    debugWrapper.appendChild(debugCheckbox);
    debugLabel.setAttribute('for', 'debug');
    debugCheckbox.id = 'debug';

    var animationWrapper = document.createElement('div');
    var animationLabel = document.createElement('div');
    animationLabel.innerHTML = 'Animation';
    var animations = [
      'fade',
      'slide',
      'swing',
      'drop',
      'newspaper',
      'lightspeed'
    ]
    animationWrapper.appendChild(animationLabel);
    animations.forEach(function(animation, index){
      var animationRadio = document.createElement('input');
      if(!config.animation && index == 0){
        animationRadio.checked = true;
        config.animation = animation;
      }else if(animation == config.animation){
        animationRadio.checked = true;
      }
      animationRadio.setAttribute('type', 'radio');
      var animationRadioLabel = document.createElement('label');
      animationRadioLabel.innerHTML = animation;
      animationRadioLabel.setAttribute('for', animation);
      animationRadio.setAttribute('name', 'animation');
      animationRadio.setAttribute('value', animation);
      animationRadio.id = animation;
      animationRadio.addEventListener('click', function(){
        config.animation = animation;
      });
      animationWrapper.appendChild(animationRadio);
      animationWrapper.appendChild(animationRadioLabel);
    });



    APP.appendChild(participantIDWrapper);
    APP.appendChild(noImageWrapper);
    APP.appendChild(noAudioWrapper);
    APP.appendChild(customImageWrapper);
    APP.appendChild(customAudioWrapper);
    APP.appendChild(document.createElement('br'));
    APP.appendChild(volumeWrapper);
    APP.appendChild(document.createElement('br'));
    APP.appendChild(tooltip);
    APP.appendChild(debugWrapper);
    APP.appendChild(document.createElement('br'));
    APP.appendChild(animationWrapper);

    var urlWrapper = document.createElement('div');
    var urlTooltip = document.createElement('div');
    var urlLink = document.createElement('textarea');
    urlLink.classList.add('url-link', 'hidden');
    urlLink.setAttribute('readonly', '');
    var launchButton = document.createElement('button');
    launchButton.classList.add('hidden');
    launchButton.innerHTML = 'Launch!';
    var copyButton = document.createElement('button');
    copyButton.classList.add('copy-button', 'hidden');
    copyButton.innerHTML = 'Copy to Clipboard';
    var copyText = document.createElement('div');
    copyButton.addEventListener('click', function(){
      urlLink.select();
      try {
        document.execCommand('copy');
        urlLink.blur();
        copyText.innerHTML = 'Copied!';
        setTimeout(function(){ copyText.innerHTML = ''; }, 3000);
      }catch (err) {
        copyText.innerHTML = 'Press Ctrl/Cmd +C to copy';
      }
    });

    urlWrapper.appendChild(urlLink);
    urlWrapper.appendChild(copyText);
    urlWrapper.appendChild(launchButton);
    urlWrapper.appendChild(copyButton);

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
      config.volume = volumeInput.value;

      if(debugCheckbox.checked) {
        config.debug = true;
      }else{
        delete(config.debug);
      }
      if(!noImageCheckbox.checked) {
        config.noImage = true;
      }else{
        delete(config.noImage);
      }
      if(!noAudioCheckbox.checked) {
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
      copyButton.classList.remove('hidden');
    });

    launchButton.addEventListener('click', function(){
      openFeedWindow(url + '&green=true', 'Extra Life Alert Feed');
    });

    APP.appendChild(feedButton);
    APP.appendChild(urlWrapper);

  }

  function renderRecentDonations(){
    var backButton = document.createElement('div');
    backButton.classList.add('back-button');
    backButton.innerHTML = 'Go Back';
    backButton.addEventListener('click', function(){
      STATE.changeState('TUTORIAL');
    });
    APP.appendChild(backButton);
    var recentDonationsTitle = document.createElement('h1');
    recentDonationsTitle.innerHTML = 'Recent Donations Module Settings';
    APP.appendChild(recentDonationsTitle);

    var recentConfig = {
      participantID: '',
      size: 'small',
      limit: 3
    }

    if(localStorage.getItem('recentConfig')){
      recentConfig = JSON.parse(localStorage.getItem('recentConfig'));
    }

    var participantIDWrapper = document.createElement('div');
    var participantIDLabel = document.createElement('label');
    participantIDLabel.innerHTML = 'participantID';
    var participantIDInput = document.createElement('input');
    participantIDInput.setAttribute('type', 'text');
    participantIDInput.value = recentConfig.participantID;
    participantIDWrapper.appendChild(participantIDLabel);
    participantIDWrapper.appendChild(participantIDInput);
    participantIDLabel.setAttribute('for', 'participantID');
    participantIDInput.id = 'participantID';
    APP.appendChild(participantIDWrapper);

    var sizeWrapper = document.createElement('div');
    var sizeTitle = document.createElement('div');
    sizeTitle.innerHTML = 'Size';
    sizeWrapper.appendChild(sizeTitle);
    var sizes = ['small', 'medium', 'large'];
    sizes.forEach(function(size){
      var sizeLabel = document.createElement('label');
      sizeLabel.innerHTML = size;
      sizeLabel.setAttribute('for', size);
      var sizeInput = document.createElement('input');
      sizeInput.setAttribute('type', 'radio');
      sizeInput.setAttribute('name', 'size');
      sizeInput.setAttribute('id', size);
      sizeInput.setAttribute('value', size);
      sizeInput.checked = recentConfig.size == size;
      sizeInput.addEventListener('click', function(){
        recentConfig.size = sizeInput.value;
      });
      sizeWrapper.appendChild(sizeInput);
      sizeWrapper.appendChild(sizeLabel);
    });
    APP.appendChild(sizeWrapper);
    var limitsWrapper = document.createElement('div');
    var limitsTitle = document.createElement('div');
    limitsTitle.innerHTML = 'Limit';
    limitsWrapper.appendChild(limitsTitle);
    var limits = [1, 5, 10, 15, 20];
    limits.forEach(function(limit){
      var limitLabel = document.createElement('label');
      limitLabel.innerHTML = limit;
      limitLabel.setAttribute('for', limit);
      var limitInput = document.createElement('input');
      limitInput.setAttribute('type', 'radio');
      limitInput.setAttribute('name', 'limit');
      limitInput.setAttribute('id', limit);
      limitInput.setAttribute('value', limit)
      limitInput.checked = recentConfig.limit == limit;
      limitInput.addEventListener('click', function(){
        recentConfig.limit = limitInput.value;
      });
      limitsWrapper.appendChild(limitInput);
      limitsWrapper.appendChild(limitLabel);
    });
    APP.appendChild(limitsWrapper);

    var saveButton = document.createElement('button');
    saveButton.innerHTML = 'Save';
    APP.appendChild(saveButton);

    var urlLink = document.createElement('textarea');
    urlLink.classList.add('url-link', 'hidden');
    urlLink.setAttribute('readonly', '');
    APP.appendChild(urlLink);

    var copyButton = document.createElement('button');
    copyButton.classList.add('copy-button', 'hidden');
    copyButton.innerHTML = 'Copy to Clipboard';
    var copyText = document.createElement('div');
    copyButton.addEventListener('click', function(){
      urlLink.select();
      try {
        document.execCommand('copy');
        urlLink.blur();
        copyText.innerHTML = 'Copied!';
        setTimeout(function(){ copyText.innerHTML = ''; }, 3000);
      }catch (err) {
        copyText.innerHTML = 'Press Ctrl/Cmd +C to copy';
      }
    });
    var launchButton = document.createElement('button');
    launchButton.classList.add('hidden');
    launchButton.innerHTML = 'Launch!';

    APP.appendChild(copyText);
    APP.appendChild(launchButton);
    APP.appendChild(copyButton);

    var url;

    saveButton.addEventListener('click', function(){
      recentConfig.participantID = participantIDInput.value;
      localStorage.setItem('recentConfig', JSON.stringify(recentConfig));
      if(!participantIDInput.value){
        alert('participantID Field Left Blank, please enter your participantID');
        return;
      }
      var configUri = Object.keys(recentConfig).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(recentConfig[k]);
      }).join('&');

      var u = location.protocol == 'file:' ? 'file:///C:/Users/TheLa/projects/extralifealert/recent/index.html' : 'http://lanzo.space/extralifealert/recent/';
      url = u + '?' + configUri;

      urlLink.value = url;
      urlLink.classList.remove('hidden');
      launchButton.classList.remove('hidden');
      copyButton.classList.remove('hidden');
    });

    launchButton.addEventListener('click', function(){
      openRecentWindow(url + '&green=true', 'Extra Life Recent Donations', recentConfig.size, recentConfig.limit);
    });


  }

  var STATE = {
    TUTORIAL: { renderMethod: renderTutorial },
    SETTINGS: { renderMethod: renderSettings },
    RECENT_DONATIONS: { renderMethod: renderRecentDonations },
    currentState: 'TUTORIAL',
    changeState: function(state){
      var stateObj = { state: state };
      history.pushState(stateObj, state, "?state="+state);
      APP.classList.remove(STATE.currentState.toLowerCase());
      STATE.currentState = state;
      APP.classList.add(STATE.currentState.toLowerCase());
      while (APP.hasChildNodes()) {
        APP.removeChild(APP.lastChild);
      }
      STATE[state].renderMethod();
    }
  }
  if(location.search){
    var urlState = JSON.parse('{"' + decodeURIComponent(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
    console.log(urlState)
    if(urlState.state){
      STATE.changeState(urlState.state);
    }
  }else{
    STATE.changeState('TUTORIAL');
  }
  window.STATE = STATE;
}

document.addEventListener('DOMContentLoaded', init);

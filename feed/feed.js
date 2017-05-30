var DONATIONS_PER_INTERVAL = 25;
var CHECK_INTERVAL = 120000;
var donationsQueue = [];
var donationsInterval;
var fetchInterval;
var DEBUG = false;

window.testNotification = function(){
  var q = new Date().getTime() - 5;
  donationsQueue.push({
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lacinia massa ac mi facilisis, eu commodo felis dictum. Duis ullamcorper orci at malesuada commodo. Proin imperdiet vulputate mollis.",
    createdOn: q,
    donorName: 'thelanzolini',
    avatarImageURL: "//assets.donordrive.com/clients/extralife/img/avatar-constituent-default.gif",
    donationAmount: 5
  });
}

function processDonations(donations) {
  var promise = new Promise(function(resolve, reject){
    var sliced = donations.slice(0, DONATIONS_PER_INTERVAL);
    var currentTime = new Date().getTime();

    if(DEBUG) {
      var q = new Date().getTime() - 5;
      var debugDonation = {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lacinia massa ac mi facilisis, eu commodo felis dictum. Duis ullamcorper orci at malesuada commodo. Proin imperdiet vulputate mollis.",
        createdOn: q,
        donorName: 'thelanzolini',
        avatarImageURL: "//assets.donordrive.com/clients/extralife/img/avatar-constituent-default.gif",
        donationAmount: 5
      }
      sliced.push(debugDonation);
    }

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
  if(DEBUG){
    var promise = new Promise(function(resolve){
      return resolve([]);
    });
    return promise;
  }
  return window.fetch('https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participantDonations&participantID='+ participantID +'&format=json', { mode: 'cors' })
    .catch(function(error){
      alert('Couldn\'t fetch donations. Check your participantID... or your internet connection')
    })
    .then(function(response){
      if(!response){
        var promise = new Promise(function(resolve, reject){
          resolve([]);
        });
        return promise;
      }
      if(!response.ok){
        alert(response.statusText);
      }
      return response.json();
    })
  ;
}

function renderFeed(){
  var APP = document.getElementById('app');

  var search = location.search.substring(1);
  var config = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')

  var donationAlert = document.createElement('div');
  donationAlert.classList.add('hidden', 'donation-alert');
  var donationText = document.createElement('div');
  donationText.classList.add('donation-alert-text');
  var donationMessage = document.createElement('div');
  donationMessage.classList.add('donation-alert-message');

  if(!config.noAudio){
    var audio = document.createElement('audio');
    audio.src = config.audio;
  }

  if(!config.noImage){
    var donationImg = document.createElement('img');
    donationImg.src = config.image;
    donationAlert.appendChild(donationImg);
  }

  donationAlert.appendChild(donationText);
  donationAlert.appendChild(donationMessage);

  APP.appendChild(donationAlert);

  if(config.debug) {
    DEBUG = true;
    CHECK_INTERVAL = 10000;
  }

  fetchInterval = setInterval(function(){
    fetchRecentDonations(config.participantID).then(processDonations)
  }, CHECK_INTERVAL);

  donationsInterval = setInterval(function(){
    var donation = donationsQueue.pop();
    if(!!donation){
      if(!config.noAudio){
        audio.play();
      }
      donationAlert.classList.add(config.animation);
      donationText.textContent = donation.donorName + ' has donated $' + donation.donationAmount + '!';
      donationMessage.textContent = donation.message;
      setTimeout(function(){
        donationText.innerHTML = '';
        donationAlert.classList.remove(config.animation);
      }, 7000);
    }
  }, 10000);

}

document.addEventListener('DOMContentLoaded', renderFeed)

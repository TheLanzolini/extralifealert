var CHECK_INTERVAL = 120000;
var donationsInterval, APP;

var search = location.search.substring(1);
var config = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')

function processDonations(donations){
  var promise = new Promise(function(resolve, reject){
    resolve(donations.slice(0, config.limit))
  });
  return promise;
}

function fetchRecentDonations(participantID) {
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

function renderDonations(donations){
  while (APP.hasChildNodes()) {
    APP.removeChild(APP.lastChild);
  }

  donations.forEach(function(donation){
    var donationElem = document.createElement('div');
    donationElem.classList.add('donation');
    var donationAvatar = document.createElement('img');
    donationAvatar.src = 'http:' + donation.avatarImageURL;
    var donationContent = document.createElement('div');
    donationContent.classList.add('donation-content');
    var donationName = document.createElement('div');
    donationName.classList.add('donation-name');
    donationName.innerHTML = donation.donorName || 'Anonymous';
    var donationAmount = document.createElement('div');
    donationAmount.classList.add('donation-amount');
    donationContent.appendChild(donationName);
    donationContent.appendChild(donationAmount);
    donationAmount.textContent = '$' + (donation.donationAmount || 'secret amount');
    if(config.size != 'small'){
      donationElem.appendChild(donationAvatar);
    }
    donationElem.appendChild(donationContent);
    APP.appendChild(donationElem);
  });

}

function renderRecent(){
  APP = document.getElementById('app');
  APP.classList.add(config.size);
  if(config.green){
    APP.classList.add('green');
  }

  fetchRecentDonations(config.participantID)
    .then(processDonations)
    .then(renderDonations)
  ;

  donationsInterval = setInterval(function(){
    fetchRecentDonations(config.participantID)
      .then(processDonations)
      .then(renderDonations)
    ;
  }, CHECK_INTERVAL);

}

document.addEventListener('DOMContentLoaded', renderRecent)

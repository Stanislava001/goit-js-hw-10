import './css/styles.css';
import fetchCountries from '/js/fetchCountries';
import CountryListTpl from '/templates/country-list.hbs';
import CountryCardTpl from '/templates/country-card.hbs';

import Notiflix from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;
const debounce = require('lodash/debounce');

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputText, DEBOUNCE_DELAY));
function onInputText(e) {
  e.preventDefault();
  const searchQuery = e.target.value.trim();
  
  if (searchQuery === '') {
        return (refs.countryList.innerHTML = ''), (refs.countryInfo.innerHTML = '');
      }

  fetchCountries(searchQuery).then(countryMarkup).catch(onFetchError);
}


function countryMarkup(countries) {
  const markupCountryList = CountryListTpl(countries);
  const markupCard = CountryCardTpl(countries);
    
  if (countries.length === 1) {
    refs.countryInfo.innerHTML = markupCard;
    refs.countryList.innerHTML = "";

  } else if (countries.length > 1 && countries.length < 10) {
    refs.countryList.innerHTML = markupCountryList;
    refs.countryInfo.innerHTML = "";
  } else if (countries.length > 10 && refs.input.value.trim() !== "") {
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else {
    refs.countryList.innerHTML = markupCountryList;
  }

}

function onFetchError() {
return Notiflix.Notify.failure('Oops, there is no country with that name');
}
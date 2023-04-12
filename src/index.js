// import countryListTpl from '../src/templates/countryListTemplate.hbs'
import notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';


const DEBOUNCE_DELAY = 350;

const userFormSearch = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const clearPage = () => { 
      countryInfoEl.innerHTML = '';
      countryListEl.innerHTML = '';
}

const onSearch = e => {
    const searchQuery = e.target.value.trim();
      if (!searchQuery) {
      clearPage();
        return;
    }

    fetchCountries(searchQuery)
        .then(result => {
            if (result.length > 10) {
                notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
                  clearPage();
                return 
            }
            showFoundCountries(result);
            console.log(result);
        })
        .catch(error => {
            if (error.message === '404') {
                notiflix.Notify.warning('Oops, there is no country with that name.');
              clearPage();
              return;
            } else {
                notiflix.Report.failure(
                    `${error.message}`, 
                    'We don`t know what happened :(' ,
                    'Ok',
                        );
 } });};


userFormSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


const showFoundCountries = (result) => {
  if (result.length >= 2 && result.length <= 10) {
    clearPage();
    createCountryList(result);

  }
  if (result.length === 1) {
    clearPage();
      notiflix.Notify.success(`Yep Yep, we found target country`);

    createCountryCard(result);
  }
}

const createCountryList = (result) => {
  const countryList = result
    .map(({ name, flags }) => {
      return `<li class="country-list__item"><img src="${flags.svg}" alt="${name.common}" width="110" height="60">
  <p> ${name.official}</p></li>`;
    })
    .join('');
  countryListEl.innerHTML = countryList;
  console.log(countryList);
  return countryList;
}

const createCountryCard = (result) => {
  const countryInfo = result
    .map(({ name, capital, population, flags, languages }) => {
        languages = Object.values(languages);

      return `<div class="country-content"><img src="${flags.svg}" alt="${name.common}" width="100" height="50">
  <p class="country-name"> ${name.official}</p></div>
  <ul><li class="country-content-item">Capital: <span> ${capital}</span></li>
  <li class="country-content-item">Population: <span> ${population}</span></li>
  <li class="country-content-item">Languages: <span> ${languages}</span></li></ul>`;
    })
    .join('');
    countryInfoEl.innerHTML = countryInfo;
      console.log(countryInfo);

  return countryInfo;
}







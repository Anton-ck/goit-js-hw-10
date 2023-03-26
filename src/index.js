import countryListTpl from '../src/templates/countryListTemplate.hbs'
import notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';


const DEBOUNCE_DELAY = 300;

const userFormSearch = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const onSearch = e => {
    const searchQuery = e.target.value.trim();
      if (!searchQuery) {
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = '';
        return;
    }

    fetchCountries(searchQuery)
        .then(result => {
            if (result.length > 10) {
                notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
                return 
            }
            showFoundCountries(result);
            console.log(result);
        })
        .catch(error => {
            notiflix.Notify.failure('Oops, there is no country with that name.');
        }).finally((result) => { 
            setTimeout(() => { 
                 userFormSearch.value = '';
            },4000)
           
        });

};


userFormSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


const showFoundCountries = (result) => {
  if (result.length >= 2 && result.length <= 10) {
    countryInfoEl.innerHTML = '';
      createCountryList(result);

  }
  if (result.length === 1) {
    countryListEl.innerHTML = '';
    createCountryCard(result);
  }
}

const createCountryList = (result) => {
  const countryList = result
    .map(({ name, flags }) => {
      return `<li class="country-list__item"><img src="${flags.svg}" alt="${name.common}" width="100" height="50">
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







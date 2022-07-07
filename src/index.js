import './css/styles.css';
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector("#search-box");
const countryContainer = document.querySelector(".country-list");

input.addEventListener('input', debounce((event) => {
    event.preventDefault();

    const countryName = input.value.trim();
    if(countryName === "") {
        return Notify.failure("Oops, there is no country with that name");
    }

    fetchCountry(countryName)
        .then(data => {
            if(data.length > 10) {
                return Notify.info("Too many matches found. Please enter a more specific name.");
            } else if(data.length >= 2 && data.length <= 10) {
                countryContainer.innerHTML = createFewCountriesMarkup(data);
            } else {
                countryContainer.innerHTML = createCountryMarkup(data);
            }
        }
    ); 
}, DEBOUNCE_DELAY)) 

function createCountryMarkup (data) {
    return data
        .map(({ name, capital, population, flags, languages }) => {
            let languagesArr = [];

            for(var key in languages) {
                languagesArr.push(languages[key]);
            }

            return ` 
                <div>
                    <div class="country_title">
                        <img src=${flags.svg} alt="flag" width="35px" height="30px">
                        <h2 class="country_name">${name.official}</h2>
                    </div>
                    <p><b>Capital:</b> ${capital}</p>
                    <p><b>Population:</b> ${population}</p> 
                    <p><b>Languages:</b> ${languagesArr.join(', ').toString()}</p>    
                </div>`   
        })
        .join("");
}

function createFewCountriesMarkup(data) {
    return data
        .map(({ name, flags }) => {
            return ` 
                <div class="country">
                    <img src=${flags.svg} alt="flag" width="35px" height="30px">
                    <p class="countries_name">${name.official}</p>
                </div>`   
        })
        .join("");
}

function fetchCountry(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
        .then(res => {
            if(res.ok) {
                return res.json()
            } else if(res.status = 404) {
                return Notify.failure("Oops, there is no country with that name");
            }
        })
}
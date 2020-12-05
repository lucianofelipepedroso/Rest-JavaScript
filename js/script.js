let tabCountries = null;
let tabFavorites = null;
let allCountries = [];
let favoriteCountries = [];
let countCountries = 0;
let countFavorites = 0;
let totalPopulationList = 0;
let totalPopulationFavorites = 0;
let numberFormat = null;
window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');
  // prettier-ignore
  totalPopulationFavorites = 
  document.querySelector('#totalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

async function fetchCountries() {
  const rest = await fetch('http://restcountries.eu/rest/v2/all');
  const data = await rest.json();
  allCountries = data.map((country) => {
    const { numericCode, population, flag, translations } = country;
    const { pt } = translations;
    return {
      numericCode,
      pt,
      formatPopulation: formatNumber(population),
      population,
      flag,
    };
  });

  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = '<div>';
  allCountries.forEach((country) => {
    const { pt, flag, numericCode, formatPopulation } = country;

    const countryHTML = `
      <div class='country'>
      <div>
        <a id=${numericCode} class="waves-effect waves-light btn">+</a>
      </div>
      <div>
        <img src=${flag} alt=${pt}/>
      </div>
      <div>
        <ul>
          <li>${pt}</li>
          <li>${formatPopulation}</li>
        </ul>
      </div>
      </div>
    `;
    countriesHTML += countryHTML;
  });
  countriesHTML += '</div>';
  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites() {
  let favoritesHTML = '<div>';

  favoriteCountries.forEach((country) => {
    const { pt, flag, numericCode, formatPopulation } = country;

    const favoriteHTML = `
      <div class='country'>
      <div>
        <a id="${numericCode}" class="waves-effect waves-light btn red darken-4">-</a>
      </div>
      <div>
        <img src="${flag}" alt="${pt}"/>
      </div>
      <div>
        <ul>
          <li>${pt}</li>
          <li>${formatPopulation}</li>
        </ul>
      </div>
      </div>
    `;
    favoritesHTML += favoriteHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}
function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return (accumulator += current.population);
  }, 0);

  const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
    return (accumulator += current.population);
  }, 0);

  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
  totalPopulationList.textContent = formatNumber(totalPopulation);
}
function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteCountries = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteCountries.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find(
    (country) => country.numericCode === id
  );
  favoriteCountries = [...favoriteCountries, countryToAdd];

  favoriteCountries.sort((a, b) => {
    return a.pt.localeCompare(b.pt);
  });

  allCountries = allCountries.filter((country) => {
    return country.numericCode !== id;
  });
  render();
}

function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find(
    (country) => country.numericCode === id
  );
  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.pt.localeCompare(b.pt);
  });

  favoriteCountries = favoriteCountries.filter((country) => {
    return country.numericCode !== id;
  });
  render();
}
function formatNumber(number) {
  return numberFormat.format(number);
}

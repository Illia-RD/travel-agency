const card = document.querySelector('.card');

async function loadJsonFile(filePath) {
  try {
    const response = await fetch(filePath);
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Помилка завантаження файлу JSON:', error);
    throw error; // Передача помилки вище для обробки
  }
}
// підставити своє посилання на json файл
const jsonData = await loadJsonFile('https://raw.githubusercontent.com/Illia-RD/travel-agency/main/js/tickets.json');

// Ініціалізація випадаючого списку країн
const countrySelect = new SlimSelect({
  select: '#countrySelect',
  data: countryInf(jsonData),
  settings: { placeholderText: 'Custom Placeholder Text' },
  events: {
    afterChange: handleCountryChange,
  },
});

// Функція для генерації даних для випадаючого списку країн
function countryInf(data) {
  console.log(data);
  return data.countries.map(country => ({
    html: `
    <div class="country-option-wrap">
      <img class="country-flag" src="${country.flag}" height="20" alt="${country.name}" />
      <p class="country-name">${country.name}</p>
    </div>
    `,

    text: country.name,
    value: country.id,
  }));
}

// Обробник зміни вибраної країни
function handleCountryChange() {
  const selectedCountryId = countrySelect.getSelected()[0];

  const selectedCountry = jsonData.countries.find(country => country.id === selectedCountryId);
  console.log(selectedCountry);
  if (selectedCountry) {
    createTicketCard(selectedCountry);
  } else {
    console.log('Країну не знайдено.');
  }
}

// Виклик функції для ініціалізації з дефолтною країною
handleCountryChange();

// Отримання елементу карточки

// Функція для генерації карточки квитка
function createTicketCard(country) {
  // Очищення контенту карточки
  card.innerHTML = '';
  console.log(typeof country.flag);
  // Додавання HTML-структури з інформацією про країну
  card.insertAdjacentHTML(
    'beforeend',
    `
    <img class="country-iamge" src="${country.image}" alt="${country.name}">
    <div class="info">
            <h2>${country.name}</h2>
      <p>${country.description}</p>
      <div class="excursions">
        <h3>Екскурсії:</h3>
        <select id="excursionSelect" multiple></select>
      </div>

      <div class="price">
        <div class="ticet-price">
            <p>Вартість квитка</p>
            <p class="price-value" id="ticet-price" value="${country.ticketPrice}">${country.ticketPrice}</p>
        </div>
        <div class="excursion-price"  >
            <p>Вартість екскурсій</p>
            <p class="excursion-price-value" id="excursion-price" value="0">0</p>
        </div>
      </div>  
    </div>
    <div class="order-wrap">
        <button class="order-btn" type="button" id="create-order-btn">Замовити квиток</button>
    </div>
  `
  );

  // Отримання елементів для подальших операцій
  const orderBtn = document.querySelector('#create-order-btn');
  const ticetPrice = document.querySelector('#ticet-price');
  const excursionPrice = document.querySelector('#excursion-price');

  // Ініціалізація випадаючого списку екскурсій
  const excursionSelect = new SlimSelect({
    select: '#excursionSelect',
    placeholder: 'Виберіть країну',
    settings: {
      showSearch: false,
      hideSelected: true,
      placeholderText: 'Оберіть екскурсію',
    },
    data: addExcursionsData(country.excursions),
    events: {
      afterChange: handleExcursionChange,
    },
  });

  // Функція для генерації даних для випадаючого списку екскурсій
  function addExcursionsData(excursions) {
    const excursionData = excursions.map(excursion => ({
      html: `
        <p class="excursion-option-name">${excursion.name}</p>
        <p class="excursion-option-price">${excursion.price}</p>
      `,
      text: excursion.name,
      value: excursion.price,
    }));
    return excursionData;
  }

  // Обробник зміни вибраних екскурсій
  function handleExcursionChange() {
    const selectedExcursions = excursionSelect.getSelected();

    excursionPrice.textContent = calculateSum(selectedExcursions) || 0;
    excursionPrice.setAttribute('value', calculateSum(selectedExcursions) || 0);
  }

  // Обробник натискання на кнопку "Замовити квиток"
  orderBtn.addEventListener('click', () => {
    let alertContent = {
      name: '',
      ticet: Number(ticetPrice.getAttribute('value')),
      excursion: Number(excursionPrice.getAttribute('value')),
    };
    alert(
      `Замовлено: ${alertContent.name}\nЦіна квитка: ${alertContent.ticet}\nЦіна екскурсій: ${
        alertContent.excursion
      }\nЗагальна ціна: ${alertContent.ticet + alertContent.excursion}`
    );
  });
}
// Функція для обчислення суми значень в масиві
function calculateSum(arr) {
  return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

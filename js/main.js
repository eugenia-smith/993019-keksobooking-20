'use strict';

var ACCOMMODATION_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ACCOMMODATION_TYPES_RUS = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'};
var ACCOMMODATION_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHECKIN_TIME = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var PHOTO_DATA = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
// var TOTAL_COMMERCIALS = 8

var Y_MIN = 130;
var Y_MAX = 630;

var pinDimentions = {
  WIDTH: 65,
  HEIGHT: 84
};

var roomsPriceList = {
  MIN: 1000,
  MAX: 1000000
};

var guestsNumber = {
  MIN: 1,
  MAX: 10
};

var roomsAvailable = {
  MIN: 1,
  MAX: 10
};

var map = document.querySelector('.map');
var mapPin = document.querySelector('.map__pin--main');
var sourcePin = document.querySelector('#pin').content;
var offerCardTemplate = document.querySelector('#card').content;
var mapCard = offerCardTemplate.querySelector('.map__card');
var adsForm = document.querySelector('.ad-form');
var adsFormFields = adsForm.querySelectorAll('.ad-form__element');
var addressInput = document.getElementById('address');
var priceInput = document.getElementById('price');
var titleInput = document.getElementById('title');
var timeInInput = document.getElementById('timein');
var timeOutInput = document.getElementById('timeout');
var roomsAvailableInput = document.getElementById('room_number');
var guestsNumberInput = document.getElementById('capacity');
var housingTypeInput = document.getElementById('type');
var mapFilter = document.querySelector('.map__filters');
var mapSelections = mapFilter.querySelectorAll('select');

var pinBundle = document.querySelector('.map__pins');

// генерирует случайные числа
var getRandomInt = function (min, max) {
  var rand = Math.random() * (max - min + 1) + min;
  return Math.floor(rand);
};


// получает случайные элемент массива
var getRandomArrayElement = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

// получает фрагент массива
var getArrFragment = function (arr) {
  return arr.slice(0, getRandomInt(1, arr.length));
};

// создает массив пинов
var getCommercials = function (num) {
  var commercial = [];
  for (var i = 1; i <= num; i++) {
    commercial[i - 1] = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      location: {
        x: getRandomInt(0, map.offsetWidth),
        y: getRandomInt(Y_MIN, Y_MAX)
      },
      offer: {
        title: 'Объявление ' + i,
        address: getRandomInt(0, map.offsetWidth) + ', ' + getRandomInt(Y_MIN, Y_MAX),
        price: getRandomInt(roomsPriceList.MIN, roomsPriceList.MAX),
        type: getRandomArrayElement(ACCOMMODATION_TYPES),
        rooms: getRandomInt(roomsAvailable.MIN, roomsAvailable.MAX),
        guests: getRandomInt(guestsNumber.MIN, guestsNumber.MAX),
        checkin: getRandomArrayElement(CHECKIN_TIME),
        checkout: getRandomArrayElement(CHECKOUT_TIME),
        features: getArrFragment(ACCOMMODATION_FEATURES),
        description: 'Описание ' + i,
        photos: getArrFragment(PHOTO_DATA)
      }
    };
  }
  return commercial;
};

var getOfferCard = function (pin, newCard) {

  newCard.querySelector('.popup__avatar').src = pin.author.avatar;
  newCard.querySelector('.popup__title').textContent = pin.offer.title;
  newCard.querySelector('.popup__text--address').textContent = pin.offer.address;
  newCard.querySelector('.popup__text--price').textContent = pin.offer.price + ' р. / ночь';
  newCard.querySelector('.popup__type').textContent = ACCOMMODATION_TYPES_RUS[pin.offer.type];
  newCard.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
  newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ' выезд до ' + pin.offer.checkout;
  newCard.querySelector('.popup__features').innerHTML = '';
  newCard.querySelector('.popup__description').textContent = pin.offer.description;
  newCard.querySelector('.popup__photos').src = pin.offer.photos;
  newCard.querySelector('.popup__close').addEventListener('click', function () {
    newCard.remove();
  });

  for (var k = 0; k < pin.offer.features.length; k++) {
    var featuresItem = document.createElement('li');
    featuresItem.classList.add('popup__feature');
    featuresItem.classList.add('popup__feature--' + pin.offer.features[k]);

    newCard.querySelector('.popup__features').appendChild(featuresItem);
  }

  var photosContainer = newCard.querySelector('.popup__photos');
  var image = photosContainer.querySelector('.popup__photo');

  for (var i = 0; i < pin.offer.photos.length; i++) {
    image.src = pin.offer.photos[i];
    photosContainer.append(image);
    image = image.cloneNode(true);
  }
  return newCard;
};

var renderPin = function (pin) {
  var pinElement = sourcePin.querySelector('.map__pin').cloneNode(true);

  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.alt = pin.offer.title;
  pinElement.style = 'left: ' + pin.location.x + 'px; ' + 'top: ' + pin.location.y + 'px;';
  pinElement.setAttribute('data-advert-id', pin.offer.advertId);

  pinElement.addEventListener('click', function () {
    map.appendChild(getOfferCard(pin, newCard));
  });

  return pinElement;
};

var getPinsFragment = function (arr) {
  var clone = document.createDocumentFragment();
  arr.forEach(function (element) {
    clone.append(renderPin(element));
  });
  return clone;
};

var pushPinsToBundle = function (bundle, clone) {
  pinBundle.append(clone);
};

var newCard = mapCard.cloneNode(true);

var pinArr = getCommercials(8);

var renderOfferCard = function () {
  if (mapCard) {
    mapCard.remove();
  }
  map.appendChild(getOfferCard());
};


// переключает режим полей формы
var changeEnablingMode = function (toggles, mode) {
  toggles.forEach(function (set) {
    set.disabled = mode;
  });
};

// деактивация страницы
var deactivatePage = function () {
  changeEnablingMode(adsFormFields, true);
  changeEnablingMode(mapSelections, true);

  mapPin.addEventListener('mousedown', mapPinClickHandler);
  mapPin.addEventListener('keydown', mapPinClickHandler);
};

// активация страницы
var activatePage = function () {
  map.classList.remove('map--faded');
  adsForm.classList.remove('ad-form--disabled');
  changeEnablingMode(adsFormFields, false);
  changeEnablingMode(mapSelections, false);
  var pinAll = getPinsFragment(pinArr);
  pushPinsToBundle(pinBundle, pinAll);
};

var mapPinClickHandler = function () {
  if (event.keyCode === 13 || event.button === 0) {
    mapPin.removeEventListener('mousedown', mapPinClickHandler);
    mapPin.removeEventListener('keydown', mapPinClickHandler);
    activatePage();
  }
};


var inputChangeHandler = function () {
  if (roomsAvailableInput.value === '100' && guestsNumberInput.value !== '0') {
    guestsNumberInput.setCustomValidity('Не для гостей');
    return;
  }

  if (roomsAvailableInput.value !== '100' && guestsNumberInput.value === '0') {
    guestsNumberInput.setCustomValidity('Введите число гостей');
    return;
  }

  if (roomsAvailableInput.value < guestsNumberInput.value) {
    guestsNumberInput.setCustomValidity('Очень много гостей, не хватает комнат');
    return;
  }

  guestsNumberInput.setCustomValidity('');
};

roomsAvailableInput.addEventListener('change', inputChangeHandler);
guestsNumberInput.addEventListener('change', inputChangeHandler);

// значение поля адреса
addressInput.value = Math.round(mapPin.offsetLeft - (pinDimentions.WIDTH / 2))
                  + ', ' + Math.round(mapPin.offsetTop - (pinDimentions.HEIGHT / 2));

// длина инпута с заголовком
var setTitleInputRange = function (isRequired, minLength, maxLength) {
  titleInput.required = isRequired;
  titleInput.setAttribute('minlength', minLength);
  titleInput.setAttribute('maxlength', maxLength);
};

// длина инпута с заголовком
var setPriceInputRange = function (isRequired, maxValue, inputType) {
  priceInput.required = isRequired;
  priceInput.max = maxValue;
  priceInput.type = inputType;
};

// проверка цена-опция
var typePriceCompareHandler = function () {
  switch (housingTypeInput.value) {
    case 'bungalo': priceInput.min = '0';
      break;
    case 'flat': priceInput.min = '1000';
      break;
    case 'house': priceInput.min = '5000';
      break;
    case 'palace': priceInput.min = '10000';
      break;
  }
};

// проверка въезд-выезд
var inOutTimeCompareHandler = function (evt) {
  timeInInput.value = evt.target.value;
  timeOutInput.value = evt.target.value;
};

// getOfferCard(getRandomArrayElement(pinArr), newCard);
// document.querySelector('.map__filters-container').before(newCard);

deactivatePage();

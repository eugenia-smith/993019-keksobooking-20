'use strict';

// массивы данных
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

var locationLimits = {
  xmin: 130,
  xmax: 1000,
  ymin: 130,
  ymax: 630
};

var target = document.querySelector('.map__pins');

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
var getPins = function (num) {
  var arrPins = [];
  for (var i = 1; i <= num; i++) {
    arrPins[i - 1] = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      location: {
        x: getRandomInt(locationLimits.xmin, locationLimits.xmax),
        y: getRandomInt(locationLimits.ymin, locationLimits.ymax)
      },
      offer: {
        title: 'Объявление ' + i,
        address: getRandomInt(locationLimits.xmin, locationLimits.xmax) +
         ', ' + getRandomInt(locationLimits.ymin, locationLimits.ymax),
        price: getRandomInt(1000, 100000),
        type: getRandomArrayElement(ACCOMMODATION_TYPES),
        rooms: getRandomInt(1, 3),
        guests: getRandomInt(0, 2),
        checkin: getRandomArrayElement(CHECKIN_TIME),
        checkout: getRandomArrayElement(CHECKOUT_TIME),
        features: getArrFragment(ACCOMMODATION_FEATURES),
        description: 'Описание ' + i,
        photos: getArrFragment(PHOTO_DATA)
      }
    };
  }
  return arrPins;
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
};

// удаляет класс
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// работа с шаблоном
var pinTemplate = document.querySelector('#pin').content;

var pinArr = getPins(8);

var renderPins = function () {
  for (var i = 0; i < pinArr.length; i++) {
    var clone = pinTemplate.cloneNode(true);
    var btn = clone.querySelector('.map__pin');
    btn.style.left = pinArr[i].location.x + 'px';
    btn.style.top = pinArr[i].location.y + 'px';
    target.appendChild(clone);
  }
};

renderPins();

// работа с шаблоном карточки предложения
var offerCardTemplate = document.querySelector('#card').content;
var mapCard = offerCardTemplate.querySelector('.map__card');

var newCard = mapCard.cloneNode(true);

getOfferCard(getRandomArrayElement(pinArr), newCard);
document.querySelector('.map__filters-container').before(newCard);


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


// никто не знает, будет ли эта функция единственным источником данных
// id остается на откуп внешнему коду
var getAuthor = function (id) {
  var author = {
    avatar: 'img/avatars/user0' + id + '.png',
  };
  return author;
};

// генерирует позицию
var getLocation = function (limits) {
  var location = {};
  location.x = getRandomInt(limits.xmin, limits.xmax);
  location.y = getRandomInt(limits.ymin, limits.ymax);
  return location;
};

// формирует список опций
var getFeatures = function () {
  var featuresArr = [];
  for (var i = 0; i < ACCOMMODATION_FEATURES.length; i++) {
    if (getRandomInt(1, 10) > 5) {
      featuresArr.push(ACCOMMODATION_FEATURES[i]);
    }
  }
  return featuresArr;
};

// подбирает фотографии
var getPhoto = function () {
  var photosArr = [];
  for (var i = 0; i < PHOTO_DATA.length; i++) {
    if (getRandomInt(1, 6) > 3) {
      photosArr.push(PHOTO_DATA[i]);
    }
  }
  return photosArr;
};

// формирует карточку предложения
var getOffer = function (id, location) {
  var offer = {};
  offer.title = 'Объявление ' + id;
  offer.address = location.x + ', ' + location.y;
  offer.price = getRandomInt(1000, 100000);
  offer.type = getRandomArrayElement(ACCOMMODATION_TYPES);
  offer.rooms = getRandomInt(1, 3);
  offer.guests = getRandomInt(0, 2);
  offer.checkin = getRandomArrayElement(CHECKIN_TIME);
  offer.checkout = getRandomArrayElement(CHECKOUT_TIME);
  offer.features = getFeatures();
  offer.description = 'Описание ' + id;
  offer.photos = getPhoto();
  return offer;
};

// создает 1 объект
var getPin = function (id) {
  var pin = {};
  pin.author = getAuthor(id);
  pin.location = getLocation(locationLimits);
  pin.offer = getOffer(id, pin.location);
  return pin;
};

// создает массив пинов
var getPins = function (num) {
  var arrPins = [];
  for (var i = 1; i <= num; i++) {
    arrPins.push(getPin(i));
  }
  return arrPins;
};

// удаляет класс
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// работа с шаблоном
var pinTemplate = document.querySelector('#pin').content;

var pinArr = getPins(8);

for (var i = 0; i < pinArr.length; i++) {
  var clone = pinTemplate.cloneNode(true);
  var btn = clone.querySelector('.map__pin');
  btn.setAttribute('style', 'left: ' + pinArr[i].location.x + 'px; top: ' + pinArr[i].location.y + 'px;');
  var target = document.querySelector('.map__pins');
  target.appendChild(clone);
}

// работа с шаблоном карточки предложения
var offerCardTemplate = document.querySelector('#card').content;
var mapCard = offerCardTemplate.querySelector('.map__card');

var getOfferCard = function (id) {
  var newCard = mapCard.cloneNode(true);

  newCard.querySelector('popup__avatar').src = id.author.avatar;
  newCard.querySelector('popup__title').textContent = id.offer.title;
  newCard.querySelector('popup__text--address').textContent = id.offer.address;
  newCard.querySelector('popup__text--price').textContent = id.offer.price;
  newCard.querySelector('popup__type').textContent = ACCOMMODATION_TYPES_RUS[id.offer.type];
  newCard.querySelector('popup__text--capacity').textContent = id.offer.rooms + ' комнаты для ' + id.offer.guests + ' гостей';
  newCard.querySelector('popup__text--time').textContent = 'Заезд после ' + id.offer.checkin + ' выезд до ' + id.offer.checkout;
  newCard.querySelector('popup__features').innerHTML = '';
  newCard.querySelector('popup__description').textContent = id.offer.description;
  newCard.querySelector('popup__photos').src = id.offer.photos;

  for (var k = 0; k < id.offer.featuresArr.length; k++) {
    var featuresItem = document.createElement('li');
    featuresItem.classList.add('popup__feature popup__feature--' + id.offer.featuresArr[k]);
    mapCard.document.querySelector('popup__features').appendChild(featuresItem);
  }

  for (i = 0; i < id.offer.photosArr.length; i++) {
    var photoItem = document.createElement('img');
    photoItem.src = id.offer.photos[i];
    photoItem.width = 45;
    photoItem.height = 40;
    mapCard.document.querySelector('popup__photos').append(photoItem);
  }

  return newCard;
};

var currentCard = getOfferCard();
document.querySelector('.map__filters-container').before(currentCard);

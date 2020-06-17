"use strict";
var locationLimits = {
  xmin: 130,
  xmax: 630,
  ymin: 130,
  ymax: 630
};

//массивы данных
var accommodationTypes = ['palace', 'flat', 'house', 'bungalo'];
var accommodationFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var checkinTime = ['12:00', '13:00', '14:00'];
var checkoutTime = ['12:00', '13:00', '14:00'];
var photosData = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
'http://o0.github.io/assets/images/tokyo/hotel3.jpg']


//генерирует случайные числа
var getRandomInt = function (min, max) {
  var rand = Math.random() * (max - min + 1) + min;
  return Math.floor(rand);
}


//получает случайные элемент массива
var getRandomArrayElement = function(arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
}


//никто не знает, будет ли эта функция единственным источником данных
//id остается на откуп внешнему коду
var getAuthor = function (id) {
 var author = {
  avatar: 'img/avatars/user0' + id + '.png',
 };
  return author;
}

//генерирует позицию
var getLocation = function (limits) {
 var location = {};
  location.x = getRandomInt(limits.xmin, limits.xmax);
  location.y = getRandomInt(limits.ymin, limits.ymax);
return location;
}

//формирует список опций
var getFeatures = function () {
  var featuresArr = [];
  for (var i = 0; i < accommodationFeatures.length; i++){
    if (getRandomInt(1, 10) > 5){
      featuresArr.push(accommodationFeatures[i]);
    }
  }
  return featuresArr;
}

//подбирает фотографии
var getPhoto = function (){
  var photosArr = [];
  for (var i = 0; i < photosData.length; i++) {
    if (getRandomInt(1, 6) > 3) {
    photosArr.push(photosData[i]);
   }
  }
  return photosArr;
}

//формирует карточку предложения
var getOffer = function (id, location) {
  var offer = {};
  offer.title = 'Объявление ' + id;
  offer.address = location.x + ', ' + location.y;
  offer.price = getRandomInt(1000, 100000);
  offer.type = getRandomArrayElement(accommodationTypes);
  offer.rooms = getRandomInt(1, 10);
  offer.guests = getRandomInt(1, 4);
  offer.checkin = getRandomArrayElement(checkinTime);
  offer.checkout = getRandomArrayElement(checkoutTime);
  offer.features = getFeatures();
  offer.description = 'Описание ' + id;
  offer.photos = getPhoto();
  return offer;
}

//создает 1 объект
var getPin = function (id) {
  var pin = {};
  pin.author = getAuthor(id);
  pin.location = getLocation(locationLimits);
  pin.offer = getOffer(id, pin.location);
  return pin;
}

//создает массив пинов
var getPins = function () {
  var arrPins = [];
  for (var i = 1; i <= 8; i++) {
    arrPins.push(getPin(i))
  }
  return arrPins;
}

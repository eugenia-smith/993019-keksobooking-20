"use strict";
var locationLimits = {
  xmin: 130,
  xmax: 630,
  ymin: 130,
  ymax: 630
};

//генерирует позицию
var createLocation = function (limits){
 var location = {};
  location.x = getRandomInt(limits.xmin, limits.xmax);
  location.y = getRandomInt(limits.ymin, limits.ymax);
return location;
}

//генерирует случайные числа
var getRandomInt = function (min, max) {
  var rand = Math.random() * (max - min + 1) + min;
  Math.floor(rand);
}

//создает 1 объект
var createPin = function (id){
  var pin = {};
  pin.author = getAuthor(id);
  pin.location = createLocation(locationLimits);
}

//никто не знает, будет ли эта функция единственным источником данных
//id остается на откуп внешнему коду
var getAuthor = function (id) {
 var autor = {
  avatar: 'img/avatars/user0' + id + '.png',
 };
}

var createPins = function () {
  var arrPins = [];
}

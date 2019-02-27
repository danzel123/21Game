$(document).ready(function () {

var giveCardBtn = document.getElementById('giveCard');
var stopCard = document.getElementById('stop');
var okBtn = document.getElementById('ok');
var popup = document.querySelector('.modal');
var result = document.getElementById('result');
  var opacityBtn = document.getElementById('opacity');
  var eScore  = document.getElementById('eScore');
  var uScore  = document.getElementById('uScore');

let cardX = 10;
let cardY = 60;
let enemyCardX = 10;
let enemyCardY = 260;
let pointsX = 800;
let pointsY = 20;
let sum = 0;
let sumEnemy = 0;
let enemyPointsX = 800;
let enemyPointsY = 240;
let countCards = 0;
let score = [0,0];

paper.install(window);
paper.setup(document.getElementById('mainCanvas'));


function createDeck(){
  let mas = [];
  for (let i = 6; i<15; i++){
    let ic = i;
    let points = i;
    if (i === 11){
      ic = 'J';
      points = 2;
    }
    if (i === 12){
      ic = 'Q';
      points = 3;
    }
    if (i === 13){
      ic = 'K';
      points = 4;
    }
    if (i === 14){
      ic = 'A';
      points = 11;
    }
    let obj1 = {img: '\u2660', value: `${ic}`, points: `${points}`, color: '#003a7c'};
    let obj2 = {img: '\u2663', value: `${ic}`, points: `${points}`, color: '#3d8629'};
    let obj3 = {img: '\u2666', value: `${ic}`, points: `${points}`, color:'#ffff77'};
    let obj4 = {img: '\u2665', value: `${ic}`, points: `${points}`, color: '#bd310d'};
    mas.push(obj1);
    mas.push(obj2);
    mas.push(obj3);
    mas.push(obj4);
    ic = i;
  }
  return mas;
};

let cards = createDeck();

function randCardFromDeck (cards){
  let cardId = Math.floor(Math.random() * (cards.length));
  let card =  cards[cardId];
  console.log(`Вы взяли ${card.img} ${card.value}, ценностью ${card.points}`);
  cards.splice(cardId, 1);
  return card;
};

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function drawCard(card){
  let cardImg = new Path.Rectangle({
    point: [cardX, cardY],
    size: [130, 180],
    fillColor: card.color,
    strokeColor: 'black',
    strokeWidth: 5
  });
  let text = new PointText(cardX + 95,cardY + 35);
  text.content = card.img;
  text.fontSize = 40;
  text.fontFamily = 'Roboto';

  let number = new PointText(cardX + 10,cardY + 35);
  number.content = card.value;
  number.fontSize = 30;
  text.fontFamily = 'Roboto';
};

let drawEnemyCard = function(card){
  let enemyCardImg = new Path.Rectangle({
    point: [enemyCardX, enemyCardY],
    size: [130, 180],
    fillColor: card.color,
    strokeColor: 'black',
    strokeWidth: 5
  });

  let text = new PointText(enemyCardX + 95,enemyCardY + 35);
  text.content = card.img;
  text.fontSize = 40;
  text.fontFamily = 'Roboto';

  let number = new PointText(enemyCardX + 10,enemyCardY + 35);
  number.content = card.value;
  number.fontSize = 30;
  number.fontFamily = 'Roboto';
};

let sumPoints = function(card){
  let back = new Path.Rectangle({
    point: [pointsX-10, pointsY-25],
    size: [80, 40],
    fillColor: '#27a88e',
    strokeColor: 'black',
    strokeWidth: 1
  });
  sum += Number(card.points);
  let pointsText = new PointText(pointsX, pointsY);
  pointsText.content = sum;
  pointsText.fontSize = 20;

};

function sumEnemyPoints(card){
  let back = new Path.Rectangle({
    point: [enemyPointsX-10, enemyPointsY-25],
    size: [80, 40],
    fillColor: '#27a88e',
    strokeColor: 'black',
    strokeWidth: 1
  });
  sumEnemy += Number(card.points);
  let pointsText = new PointText(enemyPointsX, enemyPointsY);
  pointsText.content = sumEnemy;
  pointsText.fontSize = 20;
  pointsText.fontFamily = 'Roboto';
};

stopCard.addEventListener('click', async function (evt) {
  evt.preventDefault();
  stopCard.classList.add('disabled');
  giveCardBtn.classList.add('disabled');
  let card = randCardFromDeck(cards);
  drawEnemyCard(card);
  sumEnemyPoints(card);
  enemyCardX += 150;
  await sleep(1000);
  card = randCardFromDeck(cards);
  drawEnemyCard(card);
  sumEnemyPoints(card);
  enemyCardX += 150;
  await sleep(1000);
  let perebor = false;
  let random = Math.floor(Math.random() * (5));

  if (sumEnemy > 21) perebor = true;
  while (true) {
    if (perebor === true || sumEnemy >= 21 - random){
      break;
    }
    card = randCardFromDeck(cards);
    drawEnemyCard(card);
    sumEnemyPoints(card);
    enemyCardX += 150;
    await sleep(1000);
  }


  //Победа
  if (sum <= 21 && sum > sumEnemy){
    console.log(`Ты выиграл!`);
    result.innerHTML = 'Ты выиграл!';
    score[0] += 1;
    uScore.innerHTML = `${score[0]}`;
    popup.classList.add("show");
  }
  if (sum <= 21 && sum < sumEnemy && sumEnemy<= 21){
    console.log(`Ты проиграл!`);
    result.innerHTML = 'Ты проиграл!';
    score[1] += 1;
    eScore.innerHTML = `${score[1]}`;
    popup.classList.add("show");
  }

  if(sum <= 21 && sumEnemy > 21){
    console.log(`Ты выиграл! У противника перебор`);
    result.innerHTML = 'Ты выиграл! У противника перебор';
    score[0] += 1;
    uScore.innerHTML = `${score[0]}`;
    popup.classList.add("show");
  }

  if(sum > 21 && sumEnemy > 21){
    console.log(`Ничья! У тебя и противника перебор`);
    result.innerHTML = 'Ничья! У тебя и противника перебор';
    popup.classList.add("show");
  }

  if(sum === sumEnemy){
    console.log(`Ничья! Одинакоове количество очков`);
    result.innerHTML = 'Ничья! Одинакоове количество очков';
    popup.classList.add("show");
  }

  if(sum > 21 && sumEnemy <= 21){
    console.log(`Проиграл! У тебя перебор`);
    result.innerHTML = 'Проиграл! У тебя перебор';
    score[1] += 1;
    eScore.innerHTML = `${score[1]}`;
    popup.classList.add("show");
  }
});

function takeOneCardFromDeck (){
  countCards += 1;
  console.log(countCards);
  if (countCards >= 6){
    return;
  }
  let card = randCardFromDeck(cards);
  drawCard(card);
  sumPoints(card);
  cardX += 150;
};

giveCardBtn.addEventListener("click", function (evt) {
    evt.preventDefault();
    takeOneCardFromDeck();
});

  opacityBtn.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.toggle("opacity");

  });

okBtn.addEventListener("click", function (evt) {
  project.clear();
  cardX = 10;
  cardY = 60;
  enemyCardX = 10;
  enemyCardY = 260;
  pointsX = 800;
  pointsY = 20;
  sum = 0;
  sumEnemy = 0;
  enemyPointsX = 800;
  enemyPointsY = 240;
  countCards = 0;
  cards = createDeck();
  countCards = 0;
  popup.classList.remove("show");
  stopCard.classList.remove('disabled');
  giveCardBtn.classList.remove('disabled');
  startGame();
});

let startGame = function(){
  takeOneCardFromDeck();
  takeOneCardFromDeck();
};

startGame()

  paper.view.draw();

});
 
// constants
const imgs = new Array();

// app variables
var dice1;
var dice2;
var playerScore;
var rollScore;
var rollTextDisplay;
var currentRoundScore = 0;
var turn;
var numPlayers;
var hasWinner;

// images
imgs[0] = 'images/minion_rotate.png'
imgs[1] = 'images/Pos1_tongue.png'
imgs[2] = 'images/Pos2_uninterested.png'
imgs[3] = 'images/Pos3_cupcake.png'
imgs[4] = 'images/Pos4_happy.png'
imgs[5] = 'images/Pos5_dancing.png'
imgs[6] = 'images/Pos6_banana.png'

// cached elements

// event listeners
// $('.roll').on('click', roll);
$('.roll').on('mousedown', rotate);
$('.roll').on('mouseup', function () {
    stopRotate();
    roll();
});
$(document).on('keydown', function (e) {
    if (e.keyCode === 32) {
        rotate();
    }
});
$(document).on('keyup', function (e) {
    if (e.keyCode === 32) {
        stopRotate();
        roll();
    }
});
$('.bank').on('click', bank);
$(document).on('keyup', function (e) {
    if (e.keyCode === 66) {
        bank();
    }
});
$('.newgame').on('click', init);

// functions

// rotate the images of pig dice when mouse is pressed down
function rotate() {
    var rollDice1 = $('#dice1').attr('src', 'images/minion_rotate.png');
    var rollDice2 = $('#dice2').attr('src', 'images/minion_rotate.png');
    $('.rotate').css({
        '-webkit-animation-name': 'rotate',
        '-webkit-animation-duration': '0.3s',
        '-webkit-animation-iteration-count': 'infinite',
        '-webkit-animation-timing-function': 'linear'
    });
}
// stop rotate the images of pig when mouse is released
function stopRotate() {
    $('.rotate').css({
        '-webkit-animation-iteration-count': '1',
        '-webkit-animation-timing-function': 'ease-out'
    });
}

function init() {
    turn = 0;
    numPlayers = 4;
    hasWinner = false;
    playerScore = [0, 0, 0, 0];
    rollScore = 0;
    rollTextDisplay = '';
    currentRoundScore = 0;
    dice1 = ['', 0, 0];
    dice2 = ['', 0, 0];
    render();
}

function calc() {                                   // calculate the result of one rolled pig
    var result; var pos; var pts; var imgIdx;
    var rand = Math.floor(Math.random() * 100);     // randomize a number between 0 to 99
    if (rand <= 31) {                               // p(Silly) = 0.32; range 0-31
        pos = 'Silly';
        pts = 1;
        imgIdx = 1;
    } else if (rand > 31 && rand <= 63) {           // p(Bored) = 0.32; range 32-63
        pos = 'Bored';
        pts = 1;
        imgIdx = 2;
    } else if (rand > 63 && rand <= 79) {           // p(Cupcake) = 0.16; range 64-79
        pos = 'Cupcake';
        pts = 5;
        imgIdx = 3;
    } else if (rand > 79 && rand <= 94) {           // p(Happy) = 0.15; range 80-94
        pos = 'Happy';
        pts = 5;
        imgIdx = 4;
    } else if (rand > 94 && rand <= 98) {           // p(Hula) = 0.04; range 95-98
        pos = 'Hula'
        pts = 10;
        imgIdx = 5;
    } else if (rand > 98) {                         // p(Banana) = 0.01; range 99
        pos = 'Banana'
        pts = 15;
        imgIdx = 6;
    }
    return result = [pos, pts, imgIdx];            // return an array of [random number, points, image index]
}

function roll() {
    dice1 = calc();        // roll dice 1
    dice2 = calc();        // roll dice 2
    checkDice();
    scoreUpdate();
    if (rollTextDisplay === 'Pass the Minions!') {
        turn++;
        turnUpdate();
    }
    render();
}

function checkDice() {
    rollScore = 0;      // initial roll score is 0
    if (dice1[2] === dice2[2]) {                    // if dice1 and dice2 are the same
        if (dice1[2] === 1 || dice1[2] === 2) {     // dice1 and dice2 are the same sider
            rollScore = 1;                          // score is 1
            dice1[2] === 1 ? rollTextDisplay = `Double Silly` : rollTextDisplay = `Double Bored`
        } else {                                    // dice1 and dice2 are not sider
            rollScore = (dice1[1] + dice2[1]) * 2;  // score is double pts
            rollTextDisplay = `Double ${dice1[0]}`;
        }
    } else if (dice1[2] === 1 && dice2[2] === 2) {  // else if dice1 is sider left and dice2 is sider right
        rollScore = 0;
        rollTextDisplay = `Pass the Minions!`;
    } else if (dice1[2] === 2 && dice2[2] === 1) {  // else if dice1 is sider right and dice2 is sider left
        rollScore = 0;
        rollTextDisplay = `Pass the Minions!`;
    }
    else if (dice1[2] !== dice2[2]) {               // if two dice are different
        if (dice1[2] === 1 || dice1[2] === 2) {     // if one dice is a sider and the other is not
            rollScore = Math.max(dice1[1], dice2[1]);   // the sider is worth 0
            rollTextDisplay = `${dice1[0]} and ${dice2[0]}`;
        } else if (dice2[2] === 1 || dice2[2] === 2) {
            rollScore = Math.max(dice1[1], dice2[1]);
            rollTextDisplay = `${dice1[0]} and ${dice2[0]}`;
        }
        else {                                      // if both dice are not the same
            rollScore = dice1[1] + dice2[1];
            rollTextDisplay = `${dice1[0]} and ${dice2[0]}`;
        }
    }
}
function scoreUpdate() {
    rollTextDisplay === 'Pass the Minions!' ? currentRoundScore = 0 : currentRoundScore += rollScore;
}

function bank() {
    switch (turn % numPlayers) {
        case 0: playerScore[0] += currentRoundScore;
            break;
        case 1: playerScore[1] += currentRoundScore;
            break;
        case 2: playerScore[2] += currentRoundScore;
            break;
        case 3: playerScore[3] += currentRoundScore;
            break;
    }
    turn++;
    currentRoundScore = 0;
    render();
}

function turnUpdate() {
    if (hasWinner === true) return;
    playerScore.forEach(function(elem){
        if (elem >= 100) {
            $('button.bank1').prop('disabled', true);
            $('button.bank2').prop('disabled', true);
            $('button.bank3').prop('disabled', true);
            $('button.bank4').prop('disabled', true);
            return; 
        }
    });
    switch (turn % numPlayers) {
        case 0: $('.player1-container').css({ 'opacity': '1' });
            $('button.bank1').prop('disabled', false);
            $('.player2-container').css({ 'opacity': '0.5' });
            $('button.bank2').prop('disabled', true);
            $('.player3-container').css({ 'opacity': '0.5' });
            $('button.bank3').prop('disabled', true);
            $('.player4-container').css({ 'opacity': '0.5' });
            $('button.bank4').prop('disabled', true);
            break;
        case 1: $('.player1-container').css({ 'opacity': '0.5' });
            $('button.bank1').prop('disabled', true);
            $('.player2-container').css({ 'opacity': '1' });
            $('button.bank2').prop('disabled', false);
            $('.player3-container').css({ 'opacity': '0.5' });
            $('button.bank3').prop('disabled', true);
            $('.player4-container').css({ 'opacity': '0.5' });
            $('button.bank4').prop('disabled', true);
            break;
        case 2: $('.player1-container').css({ 'opacity': '0.5' });
            $('button.bank1').prop('disabled', true);
            $('.player2-container').css({ 'opacity': '0.5' });
            $('button.bank2').prop('disabled', true);
            $('.player3-container').css({ 'opacity': '1' });
            $('button.bank3').prop('disabled', false);
            $('.player4-container').css({ 'opacity': '0.5' });
            $('button.bank4').prop('disabled', true);
            break;
        case 3: $('.player1-container').css({ 'opacity': '0.5' });
            $('button.bank1').prop('disabled', true);
            $('.player2-container').css({ 'opacity': '0.5' });
            $('button.bank2').prop('disabled', true);
            $('.player3-container').css({ 'opacity': '0.5' });
            $('button.bank3').prop('disabled', true);
            $('.player4-container').css({ 'opacity': '1' });
            $('button.bank4').prop('disabled', false);
            break;
    }
}

function checkWinner() {
    playerScore.forEach(function(elem, idx) {
        if (elem >= 100) {
            $('.display').html(`Player ${idx+1} Wins!`)
            $('.newgame').css({ 'visibility': 'visible'});
            hasWinner = true;
        }
    });
}

function render() {
    if (hasWinner === true) return;
    $('.newgame').css({ 'visibility': 'hidden' });
    $('#dice1').attr('src', imgs[dice1[2]]);
    $('#dice2').attr('src', imgs[dice2[2]]);
    $('.rollscore').html(`${rollTextDisplay} <br> +${rollScore}`);
    if (currentRoundScore === 0) {
        switch (turn % numPlayers) {
            case 0: $('.display').html(`Player 1's turn!`);
                break;
            case 1: $('.display').html(`Player 2's turn!`);
                break;
            case 2: $('.display').html(`Player 3's turn!`);
                break;
            case 3: $('.display').html(`Player 4's turn!`);
                break;
        }
    } else {
        $('.display').html(`${currentRoundScore}`);
    }
    $('.score1').html(`Points: ${playerScore[0]}`);
    $('.score2').html(`Points: ${playerScore[1]}`);
    $('.score3').html(`Points: ${playerScore[2]}`);
    $('.score4').html(`Points: ${playerScore[3]}`);
    checkWinner();
    turnUpdate();
}

init();
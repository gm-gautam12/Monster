const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACk';
const LOG_EVENT_PLAYER_ATTACK='PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATACK='MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


function getMaxValues (){
    const enteredValue = prompt('maximum life for you and monster', '100');
    
    const parsedValue = parseInt(enteredValue);
    if(isNaN(parsedValue) || parsedValue <= 0){
        throw {message: 'Invalid user input, not a number'};
    }
    return parsedValue;
}

let chosenMaxLife;

try{
 chosenMaxLife = getMaxValues();
}catch (error) {
    console.log(error);
    chosenMaxLife=100;
    alert('you enter a wrong input,default value of 100 was used');
}

// const enteredValue = prompt('maximum life for you and monster', '100');


// let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if(isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife=100;
}
 
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event:ev,
        value:val,
        finalMonsterHealth : monsterHealth,
        finalPlayerHealth: playerHealth
    }
    if(ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry.target = 'MONSTER';
    }
    else if(ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry.target = 'MONSTER';

    }
    else if(ev === LOG_EVENT_MONSTER_ATACK)
    {
        logEntry = {
            event:ev,
            value:val,
            target: 'PLAYER',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    else if(ev === LOG_EVENT_PLAYER_HEAL){
        logEntry = {
            event:ev,
            value:val,
            target: 'PLAYER',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    else if(ev === LOG_EVENT_GAME_OVER)
    {
        logEntry = {
            event:ev,
            value:val,
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    battleLog.push(logEntry);

}


function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATACK,playerDamage,currentMonsterHealth,currentPlayerHealth);

    if(currentPlayerHealth <=0 && hasBonusLife)
    {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be died but the bonus life saved you!");
    }

      if(currentMonsterHealth <= 0 && currentPlayerHealth > 0){
          alert('You Won!');
          writeToLog(LOG_EVENT_GAME_OVER,'PLAYER WON',currentMonsterHealth,currentPlayerHealth);

      }
      else if(currentPlayerHealth <= 0  && currentMonsterHealth > 0)
      {
          alert('Monster Won!');
          writeToLog(LOG_EVENT_GAME_OVER,'MONSTER WON',currentMonsterHealth,currentPlayerHealth);

      }
      else if(currentPlayerHealth <=0 && currentMonsterHealth <=0)
      {
          alert('You have a Draw');
          writeToLog(LOG_EVENT_GAME_OVER,'A DRAW',currentMonsterHealth,currentPlayerHealth);

      }

      if(currentMonsterHealth <= 0 || currentPlayerHealth <=0){
         reset();
      }
}

function attackMonster(mode) {
    let maxDamage;
    let logEvent;
    if(mode === MODE_ATTACK)
    {
        maxDamage=ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    }
    else if(mode === MODE_STRONG_ATTACK){
        maxDamage=STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent,damage,currentMonsterHealth,currentPlayerHealth);

    endRound();
}

function attackHandler() {
 
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {

    attackMonster(MODE_STRONG_ATTACK);

}

function healPlayerHandler() {
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert("you can't heal to more than your max initial health");
        healValue = chosenMaxLife - currentPlayerHealth;
    }
    else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += HEAL_VALUE;
    writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);

    endRound();
}

function printLogHandler() {
     for(let i=0; i<battleLog.length;i++){
    console.log(battleLog[i]);
    }

    // for (const i of battleLog)
    // {
    //     console.log(i);
    // }

    for(const key in battleLog)
    {
        console.log(key);
        console.log(logEntry[key]);   //square brack ke andar string hona chiye
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
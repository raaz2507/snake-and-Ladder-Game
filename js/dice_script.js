// document.addEventListener("DOMContentLoaded", ()=>{
//     const diceObj = new dice();

    
// });


export class Dice{
    #dice;// = document.querySelector('.dice');
    constructor(dice){
        const rollBtn = document.querySelector('.roll');
        this.#dice = dice;
        // this.#dice.addEventListener('click', ()=>{
            
        //     console.log(this.RollDice());    
        // });
    }

    RollDice(){
        const random = Math.floor(Math.random() * 10);

        if (random >= 1 && random <= 6) {
            this.#rollDiceAnimation(random);
            return random;
        }
        else {
            return this.RollDice();
        }
    }

    #rollDiceAnimation(random){
        const dice =  this.#dice;
        dice.style.animation = 'rolling 3s';

        setTimeout(() => {

            switch (random) {
                case 1:
                    dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
                    break;

                case 6:
                    dice.style.transform = 'rotateX(180deg) rotateY(0deg)';
                    break;

                case 2:
                    dice.style.transform = 'rotateX(-90deg) rotateY(0deg)';
                    break;

                case 5:
                    dice.style.transform = 'rotateX(90deg) rotateY(0deg)';
                    break;

                case 3:
                    dice.style.transform = 'rotateX(0deg) rotateY(90deg)';
                    break;

                case 4:
                    dice.style.transform = 'rotateX(0deg) rotateY(-90deg)';
                    break;

                default:
                    break;
            }

            dice.style.animation = 'none';

        }, 2050);
    }
}

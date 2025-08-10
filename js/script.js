class gameDashbord{
    #elemts={};

    constructor(){
        this.#getElements();
        this.#createBord();
        this.#setEvents();
    }

    #getElements(){
        this.#elemts['bord'] = document.getElementById('bord');
        this.#elemts['dice'] = document.getElementById("dice"); 
    }

    #setEvents(){
        const { dice }=this.#elemts;

        dice.addEventListener("click", function () {
            // 🎲 1 से 6 तक random number
            const roll = Math.floor(Math.random() * 6) + 1;

            // 🎯 Dice face update करें
            dice.innerText = roll;

            // 🌀 थोड़ा सा animation
            dice.style.transform = "rotate(360deg) scale(1.2)";
            setTimeout(() => {
                dice.style.transform = "rotate(0deg) scale(1)";
            }, 200);

            // 🔊 Future use: player move, switch, etc.
            console.log("Dice Rolled:", roll);
        });
    }
    #createBord(){
        const {bord}=this.#elemts;
        const boxfeg = document.createDocumentFragment();
        /*snake and leader start*/ 
        const snakes = {
            98: 78,
            62: 19,
            25: 5
        };

        const ladders = {
            4: 14,
            9: 31,
            40: 59
        };
        
        /*snake and leader end*/ 
        
        for (let row = 9; row >= 0; row--) {
            for (let col = 0; col < 10; col++) {
                let number;
                if (row % 2 === 0) {
                    number = row * 10 + col + 1; // Left to Right
                } else {
                    number = row * 10 + (9 - col) + 1; // Right to Left
                }

                addBox(number);
            }
        }
        bord.append(boxfeg);
        

        function addBox(num){
            const newbox= document.createElement('div');
                newbox.classList.add('box');
                newbox.innerText= num;
                if (snakes[num]) {
                    newbox.classList.add('snake');
                    newbox.innerHTML += ' 🐍';
                    newbox.setAttribute('data-info', `To ${snakes[num]}`);
                }
                if (ladders[num]) {
                    newbox.classList.add('ladder');
                    newbox.innerHTML += ' 🪜';
                    newbox.setAttribute('data-info', `To ${ladders[num]}`);
                }
                boxfeg.appendChild(newbox);
        }
        
    }
}
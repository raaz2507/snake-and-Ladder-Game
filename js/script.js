class gameDashbord{
    #elemts={};
    #BoxCenterList={};
    // #snakeLaddersPositionData ={ snakes : { 98: 66, 62: 19, 25: 5 }, ladders : { 4: 14, 9: 31, 40: 59 } }
    #snakeLaddersPositionData ={
        snakes: [
            { start: 98, end: 66, image: './img/snake.png' },
            { start: 62, end: 19, image: './img/snake.png' },
            { start: 25, end: 5,  image: './img/snake.png' }
        ],
        ladders: [
            { start: 4,  end: 14, image: './img/Ladder.png' },
            { start: 9,  end: 31, image: './img/Ladder.png' },
            { start: 40, end: 59, image: './img/Ladder.png' }
        ]
    };
    constructor(){
        this.#getElements();
        this.#createBord();
        this.#setEvents();
        // this.#getBoxCenter();
        this.#loadSnaksLadders_onBord();
    }

    #getElements(){
        this.#elemts['bord'] = document.getElementById('bord');
        this.#elemts['dice'] = document.getElementById("dice"); 
    }
    #getBoxCenter(){
        const { bord }= this.#elemts;
        
        const boxs=  bord.querySelectorAll(':scope > div');

        boxs.forEach((box)=>{
            const rect =  box.getBoundingClientRect();
            const X= Math.floor(rect.left + (rect.width/2)) + window.scrollX;
            const Y= Math.floor(rect.top + (rect.height/2)) + window.scrollY;
            
            // console.log(`box=${box.dataset.box_num}, x= ${X} y=${Y}`);
            this.#BoxCenterList[`${ box.dataset.box_num}`]= {x:X, y: Y};
            // console.log(this.#BoxCenterList[`${ box.dataset.box_num}`]);

        });

        // console.log(this.#BoxCenterList);
    }
    #loadSnaksLadders_onBord(){
        const {bord} =  this.#elemts;
        const {snakes, ladders}= this.#snakeLaddersPositionData;
        this.#getBoxCenter();
        snakes.forEach((obj)=>{
            // crearte img obj
            const snakeImage = new Image(); // नया HTMLImageElement बना
            snakeImage.src = obj.image; // उस image का file path दिया
            snakeImage.classList.add('snakeImg'); // यह जरूरी है
            bord.appendChild(snakeImage);
            positionImage(snakeImage, this.#BoxCenterList[obj.start], this.#BoxCenterList[obj.end])
        });
        ladders.forEach((obj)=>{
            const ladderImage = new Image();
            ladderImage.src = obj.image;
            ladderImage.classList.add('leaderImg')

            bord.appendChild(ladderImage);
            positionImage(ladderImage, this.#BoxCenterList[obj.start], this.#BoxCenterList[obj.end]);
        });

        function positionImage(image, box1center, box2center) {
            const { x:x1, y:y1 } = box1center;
            const { x:x2, y:y2 } = box2center;

            let dx = x2 - x1;
            let dy = y2 - y1;
            let length = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            // console.log( image.naturalHeight );
            // console.log( image.offsetHeight );
            let imgHeight = 80; // तुम्हारी image की height (px में)
            
            // Position को bord के अंदर relative करने के लिए bord का offset निकालो
            const bordRect = bord.getBoundingClientRect();
            const offsetX = x1 - bordRect.left;
            const offsetY = y1 - bordRect.top;

            image.style.width = `${length}px`;
            // image.style.height = `${imgHeight}px`;
            image.style.height = `auto`;
            // image.style.top = (y1 - Math.floor(imgHeight / 2)) + "px"; // center align
            // image.style.left = x1 + "px";
            image.style.top = `${offsetY - imgHeight / 2}px`;
            image.style.left = `${offsetX}px`;
            image.style.transform = `rotate(${angle}deg)`;
        }


    }
    #setEvents(){
        const { dice }=this.#elemts;
        window.addEventListener('resize', () => {
            document.querySelectorAll('.snakeImg').forEach(el => el.remove()); // पुरानी images हटाओ
            document.querySelectorAll('.leaderImg').forEach(el => el.remove());
            this.#loadSnaksLadders_onBord();
        });
        dice.addEventListener("click",rollDice);
        
        function rollDice () {
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
        }
    }
    #createBord(){
        const {bord}=this.#elemts;
        const {snakes: snakeList, ladders: laddersList}= this.#snakeLaddersPositionData;
        
        let snakes = {};
        let ladders = {};
        snakeList.forEach( obj =>{ snakes[obj.start]= obj.end; });
        laddersList.forEach( obj =>{ ladders[obj.start]= obj.end; });
        
        const boxfeg = document.createDocumentFragment();
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
            newbox.innerText = num;
            newbox.dataset.box_num = num;
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
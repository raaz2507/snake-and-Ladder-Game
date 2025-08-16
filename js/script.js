class gameDashbord{
    #elemts={};
    #players={};
    #BoxCenterList={};
    // #snakeLaddersPositionData ={ snakes : { 98: 66, 62: 19, 25: 5 }, ladders : { 4: 14, 9: 31, 40: 59 } }
    #snakeLaddersPositionData ={
        snakes: [
            { start: 98, end: 27, image: './img/snake.png' },
            { start: 62, end: 46, image: './img/snake.png' },
            { start: 25, end: 7,  image: './img/snake.png' },
        ],
        ladders: [
            { start: 4,  end: 22, image: './img/Ladder.png' },
            { start: 9,  end: 31, image: './img/Ladder.png' },
            { start: 40, end: 59, image: './img/Ladder.png' },
            { start: 48, end: 89, image: './img/Ladder.png' },
        ]
    };
    #lastDiceFace =-1;

    constructor(){
        this.#getElements();
        this.#createBord();
        this.#setEvents();
        // this.#getBoxCenter();
        this.#loadSnaksLadders_onBord();
        this.#CreatePlayer();
    }

    #getElements(){
        this.#elemts['bord'] = document.getElementById('bord');
        this.#elemts['dice'] = document.getElementById("dice");

        this.#elemts['toggleScreenBtn'] = document.getElementById('toggleScreenBtn');
        this.#elemts['toggleBtnImg'] = document.getElementById('toggleScreenBtnImg');

        this.#elemts['manualDiceRoll'] = document.getElementById('manualDiceRoll');

        this.#elemts['diceToggleBtn'] = document.getElementById('diceToggleBtn');
    }
    
    
    #setEvents(){
        const { dice , toggleScreenBtn, manualDiceRoll, diceToggleBtn }=this.#elemts;
        window.addEventListener('resize', () => {
            document.querySelectorAll('.snakeImg').forEach(el => el.remove()); // पुरानी images हटाओ
            document.querySelectorAll('.leaderImg').forEach(el => el.remove());
            this.#loadSnaksLadders_onBord();
        });
        dice.addEventListener("click",()=>this.#rollDice() );
        
        toggleScreenBtn.addEventListener('click', ()=> this.#toggleScreen() );
        
        manualDiceRoll.addEventListener('click', (event)=>{
            if (event.target.tagName === 'BUTTON'){
                this.#lastDiceFace = event.target.value;
            }    
        });
        
        diceToggleBtn.addEventListener('change', (event)=>{
            let diceTb = event.target.checked;
            console.log(diceTb);
            if (diceTb){
                manualDiceRoll.classList.add('hide');
                dice.classList.remove('hide');
                document.getElementById('diceInstructions').innerText= "Tap to Roll Dice";
            }else{
                manualDiceRoll.classList.remove('hide');
                dice.classList.add('hide');
                document.getElementById('diceInstructions').innerText= "Select Dice Number";
            }
        });
    }
    
    #CreatePlayer(){
        const {bord} =this.#elemts;
        this.#players['1']={canvas: null, pos:{x:0, y:0}, charecter:{img: './player1.png'}};
        
        this.#players['1'].canvas=createPlayerObj();

        console.log(this.#players[1]);
        trycanvs(this.#players['1'].canvas);
        function trycanvs(canvas){
            const ctx = canvas.getContext('2d');
            // कुछ ड्रॉ करके देखें
            ctx.fillStyle = '#4caf50';
            ctx.fillRect(50, 50, 150, 100);

            ctx.beginPath();
            ctx.arc(320, 200, 60, 0, Math.PI * 2);
            ctx.fillStyle = '#ff7043';
            ctx.fill();
        }
        function createPlayerObj(){
            const canvas = document.createElement('canvas');
            canvas.width= 100;
            canvas.height=100;
            canvas.style.position = 'absolute';
            canvas.style.bottom = 20+ 'px';
            canvas.style.left = 20 + 'px';

            canvas.classList.add('player');
            bord.appendChild(canvas);
            return canvas;
        }
    }
    #toggleScreen() {
        const {toggleBtnImg} = this.#elemts;

        const header = document.getElementsByTagName('header')[0];
        const footer = document.getElementsByTagName('footer')[0];
        if (header.classList.contains('hide')){
            header.classList.remove('hide');
            footer.classList.remove('hide');
            toggleBtnImg.src = "./img/expand-solid-full.svg";
        }else{
            header.classList.add('hide');
            footer.classList.add('hide');
            toggleBtnImg.src = "./img/compress-solid-full.svg";
        }
    }

    #rollDice(){
        const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];
        
        let count = 0;
        let speed = 80; // शुरू में तेज
        const maxRolls = 15; // कितनी बार face बदलेगा

        const interval = setInterval(() => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * diceFaces.length);
            } while (newIndex === this.#lastDiceFace);

            this.#lastDiceFace = newIndex;
            dice.textContent = diceFaces[newIndex];
            dice.style.transform = `rotate(${count * 90}deg)`; // घूमने का illusion

            count++;
            speed += 10; // धीरे-धीरे slow down

            if (count >= maxRolls) {
                clearInterval(interval);
            }
        }, speed);
        
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
  
}
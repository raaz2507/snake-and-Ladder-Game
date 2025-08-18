import { Dice as diceClass } from './dice_script.js';

export class gameDashbord{
    #elemts={};
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
    #players= {1:{playerName:"khushi", pos:0, avatar:1 },};
    #totalPlayers=0;
    #charAvatar={1: {canvasId:"canvas1", file:"./img/pngegg.png", frameWidth: 256, frameHeight: 256, totalFrames:6},
                2: {canvasId:"canvas2", file:"./img/pngegg.png", frameWidth: 256, frameHeight: 256, totalFrames:6},
                3: {canvasId:"canvas3", file:"./img/pngegg.png", frameWidth: 256, frameHeight: 256, totalFrames:6},
                4: {canvasId:"canvas4", file:"./img/pngegg.png", frameWidth: 256, frameHeight: 256, totalFrames:6},
                };

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
        // this.#elemts['dice'] = document.getElementById("dice");
        this.#elemts['dice'] = document.querySelector(".dice");
        this.#elemts['dice_container'] =document.querySelector('.dice_container');
        this.#elemts['toggleScreenBtn'] = document.getElementById('toggleScreenBtn');
        this.#elemts['toggleBtnImg'] = document.getElementById('toggleScreenBtnImg');

        this.#elemts['manualDiceRoll'] = document.getElementById('manualDiceRoll');

        this.#elemts['diceToggleBtn'] = document.getElementById('diceToggleBtn');



        /* pop box elemts*/
        this.#elemts["startNewGameBtn"]= document.getElementById("startNewGameBtn");
        this.#elemts['newPlayerCard'] = document.getElementById('newPlayerCard');

        this.#elemts['playerCount_container'] = document.getElementById('playerCount_container');
        this.#elemts['playerRange'] = document.getElementById('player_count');
        this.#elemts['player_countDis'] = document.getElementById('player_countDis');
        this.#elemts['playerAvtar_container'] = document.getElementById('playerAvtar_container');

        this.#elemts['playerCountForm'] = document.forms['playerCountForm'];
        this.#elemts['player_avatarForm'] = document.forms['player_avatarForm']; 
    }
    
    
    #setEvents(){
        const { dice ,dice_container, toggleScreenBtn, manualDiceRoll, diceToggleBtn }=this.#elemts;
        window.addEventListener('resize', () => {
            document.querySelectorAll('.snakeImg').forEach(el => el.remove()); // पुरानी images हटाओ
            document.querySelectorAll('.leaderImg').forEach(el => el.remove());
            this.#loadSnaksLadders_onBord();
        });
        const diceObj = new diceClass(dice); //dice obj
        
        dice.addEventListener("click",()=>{
            this.#lastDiceFace = diceObj.RollDice();
            // this.#rollDice();
        });
        
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
                dice_container.classList.remove('hide');
                document.getElementById('diceInstructions').innerText= "Tap to Roll Dice";
            }else{
                manualDiceRoll.classList.remove('hide');
                dice_container.classList.add('hide');
                document.getElementById('diceInstructions').innerText= "Select Dice Number";
            }
        });

      


        /*pop up events*/
        const { startNewGameBtn, newPlayerCard } = this.#elemts;
        const { playerRange, player_countDis, playerCount_container, playerAvtar_container } = this.#elemts;
        const { playerCountForm, player_avatarForm } = this.#elemts;

        startNewGameBtn.addEventListener('click', ()=>{
            newPlayerCard.classList.remove('hide');                
        });
        newPlayerCard.addEventListener('click', ( event )=>{
            if (event.target === newPlayerCard){
                newPlayerCard.classList.add('hide');
                
            }
        });
        playerRange.addEventListener('input', () => {
            player_countDis.textContent = `Players: ${playerRange.value}`;
            console.log(playerRange.value)
        });
        playerCountForm.addEventListener('submit', (event)=>{
            event.preventDefault(); // page reload rokne ke liye
            const count = event.target.player_count.value;
            console.log(count);
            this.#totalPlayers = count;
            playerCount_container.classList.add('hide');
            
            this.#genratePlayerForm();
        }); 
    }
    
    #CreatePlayer(){
        const {bord} =this.#elemts;
        
        
        this.#players['1'].canvas=createPlayerObj();

        console.log(this.#players[1]);
        trycanvs(this.#players['1'].canvas);
        
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
    #genratePlayerForm( current_player=1){
        const {playerAvtar_container, newPlayerCard} =  this.#elemts;

        playerAvtar_container.innerHTML = ""; //Empty container
        console.log(current_player);
        
        this.#players[current_player] = {playerName:"", avatar:null };
        const form =  document.createElement('form');

        form.name = `player_avatarForm`;
        form.dataset.playerId = current_player;
        form.method = 'GET';
        form.innerHTML = `<label for="playerName" class="playerNameLabel">Enter Player Name </label>
                            <input type="text" name="playerName" id="playerName" placeholder="player_${current_player}" value="player_${current_player}" required>

                            <label for="chouseAvtar">Chouse Character for your player</label>
                            <div class="avatar-options">
                                ${playerAvtarOpctionGenrator(this.#charAvatar)}
                            </div>
                            <button type="submit">Start....</button>`;
        
        form.addEventListener('submit', (event)=>{
            event.preventDefault();
            const playerId =  parseInt(event.target.dataset.playerId);
            const playerName = event.target.playerName.value;
            const avatarId =   event.target.player_avatar.value;

            this.#players[playerId].avatar = avatarId;
            this.#players[playerId].playerName = playerName;
            console.log(this.#players);
            console.log(playerId, this.#totalPlayers);

            if (playerId < this.#totalPlayers){
                console.log('if con');
                this.#genratePlayerForm(playerId+1);
                
            }else{
                alert("Game started");
                playerAvtar_container.innerHTML=""
                playerAvtar_container.classList.add('hide');
                playerCount_container.classList.remove('hide');

                newPlayerCard.classList.add('hide');
                
            }
        });

        playerAvtar_container.appendChild(form);                               
        for (const [id, avtar]  of Object.entries(this.#charAvatar) ){
            this.#animateAvatar(avtar.canvasId, avtar.file, avtar.frameWidth, avtar.frameHeight, avtar.totalFrames);    
        }
        
        function playerAvtarOpctionGenrator(charAvatar){
            
                let opctions='';
                for (let i=1; i<= Object.keys(charAvatar).length; i++){

                    opctions += ` <!-- Avatar ${i} -->
                    <input type="radio" id="avatar${i}" name="player_avatar" value="${i}" required>
                    <label for="avatar${i}">
                    <canvas id="canvas${i}" width="256" height="256"></canvas>
                    </label>`
                }
                
                return opctions;
        }
        playerAvtar_container.classList.remove('hide');
    }


    #animateAvatar(canvasId, spriteSrc, frameWidth, frameHeight, totalFrames) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");
        const sprite = new Image();
        sprite.src = spriteSrc;

        let frame = 0;
        sprite.onload = () => {
            console.log(sprite);
            setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                sprite,
                frame * frameWidth, 0, frameWidth, frameHeight,
                0, 0, canvas.width, canvas.height
            );
            frame = (frame + 1) % totalFrames;
            }, 120);
        };
    }
}

 // #rollDice(){
    //     const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];
        
    //     let count = 0;
    //     let speed = 80; // शुरू में तेज
    //     const maxRolls = 15; // कितनी बार face बदलेगा

    //     const interval = setInterval(() => {
    //         let newIndex;
    //         do {
    //             newIndex = Math.floor(Math.random() * diceFaces.length);
    //         } while (newIndex === this.#lastDiceFace);

    //         this.#lastDiceFace = newIndex;
    //         dice.textContent = diceFaces[newIndex];
    //         dice.style.transform = `rotate(${count * 90}deg)`; // घूमने का illusion

    //         count++;
    //         speed += 10; // धीरे-धीरे slow down

    //         if (count >= maxRolls) {
    //             clearInterval(interval);
    //         }
    //     }, speed);
        
    // }

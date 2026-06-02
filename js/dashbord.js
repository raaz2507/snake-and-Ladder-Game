import { Dice as diceClass } from './dice_script.js';
import { ladderAnimations, playerAnimations, snakeAnimations } from './animation.js';
import { animateAvatar, applySnakeSpriteAnimation, applySpriteAnimation, playSnakeSlither } from './animation_engine.js';

export class gameDashbord{
    #elemts={};
    #BoxCenterList={};
    // #snakeLaddersPositionData ={ snakes : { 98: 66, 62: 19, 25: 5 }, ladders : { 4: 14, 9: 31, 40: 59 } }
    #snakeLaddersPositionData ={
        snakes: [
            { start: 98, end: 27, animation: snakeAnimations.classic },
            { start: 62, end: 46, animation: snakeAnimations.classic },
            { start: 25, end: 7,  animation: snakeAnimations.classic },
        ],
        ladders: [
            { start: 4,  end: 22, animation: ladderAnimations.classic },
            { start: 9,  end: 31, animation: ladderAnimations.classic },
            { start: 40, end: 59, animation: ladderAnimations.classic },
            { start: 48, end: 89, animation: ladderAnimations.classic },
        ]
    };
    #lastDiceFace =-1;
    #isRollingDice = false;
    #currentPlayerId = 1;
    #players = {}; //= {1:{playerName:"khushi", pos:0, avatar:1, canvas:null },};
    #tempPlayersData={};
    #totalPlayers=0;
    #charAvatar = playerAnimations;
    #confettiInterval = null;
    #gameMessageTimer = null;

    constructor(){
        this.#getElements();
        this.#createBord();
        this.#setEvents();
        // this.#getBoxCenter();
        this.#loadSnaksLadders_onBord();
        this.#players = this.#getPlayerData();
        this.#currentPlayerId = this.#getSavedTurn();
        console.log( this.#players);
        this.#loadPlayerOnBord();
        this.#updateTurnInfo();
    }

    #getElements(){
        this.#elemts['bord'] = document.getElementById('bord');
        this.#elemts['plateform'] = document.getElementById('plateform');
        this.#elemts['completePlateform'] = document.getElementById('completePlateform');
        // this.#elemts['dice'] = document.getElementById("dice");
        this.#elemts['dice'] = document.querySelector(".dice");
        this.#elemts['dice_container'] =document.querySelector('.dice_container');
        this.#elemts['toggleScreenBtn'] = document.getElementById('toggleScreenBtn');
        this.#elemts['toggleBtnImg'] = document.getElementById('toggleScreenBtnImg');
        this.#elemts['toggleScreenText'] = document.getElementById('toggleScreenText');

        this.#elemts['manualDiceRoll'] = document.getElementById('manualDiceRoll');

        this.#elemts['diceToggleBtn'] = document.getElementById('diceToggleBtn');
        this.#elemts['playerTurnInfo'] = document.querySelector('.playerTurnInfo');


        /* pop box elemts*/
        this.#elemts["startNewGameBtn"]= document.getElementById("startNewGameBtn");
        this.#elemts['newGameConfirmDialog'] = document.getElementById('newGameConfirmDialog');
        this.#elemts['confirmNewGameBtn'] = document.getElementById('confirmNewGameBtn');
        this.#elemts['cancelNewGameBtn'] = document.getElementById('cancelNewGameBtn');
        this.#elemts['newPlayerCard'] = document.getElementById('newPlayerCard');

        this.#elemts['playerCount_container'] = document.getElementById('playerCount_container');
        this.#elemts['playerRange'] = document.getElementById('player_count');
        this.#elemts['player_countDis'] = document.getElementById('player_countDis');
        this.#elemts['playerAvtar_container'] = document.getElementById('playerAvtar_container');
        this.#elemts['gameStartMessage'] = document.querySelector('.gameStartMessage');

        this.#elemts['playerCountForm'] = document.forms['playerCountForm'];
        this.#elemts['player_avatarForm'] = document.forms['player_avatarForm']; 
    }
    
    
    #setEvents(){
        const { dice ,dice_container, toggleScreenBtn, manualDiceRoll, diceToggleBtn }=this.#elemts;
        window.addEventListener('resize', () => {
            document.querySelectorAll('.snakeImg').forEach(el => el.remove()); // पुरानी images हटाओ
            document.querySelectorAll('.leaderImg').forEach(el => el.remove());
            this.#loadSnaksLadders_onBord();
            this.#updateAllPlayerPositions();
        });
        const diceObj = new diceClass(dice); //dice obj
        
        dice.addEventListener("click",()=>{
            if (this.#isRollingDice) return;

            this.#isRollingDice = true;
            this.#lastDiceFace = diceObj.RollDice();
            setTimeout(() => {
                this.#playCurrentTurn(this.#lastDiceFace);
            }, diceObj.rollDuration);
            // this.#rollDice();
        });
        
        toggleScreenBtn.addEventListener('click', ()=> this.#toggleScreen() );
        
        manualDiceRoll.addEventListener('click', (event)=>{
            if (event.target.tagName === 'BUTTON'){
                if (this.#isRollingDice) return;

                this.#isRollingDice = true;
                this.#lastDiceFace = event.target.value;
                this.#playCurrentTurn(Number(this.#lastDiceFace));
            }    
        });

        const updateDiceMode = () => {
            let diceTb = diceToggleBtn.checked;
            if (diceTb){
                manualDiceRoll.classList.add('hide');
                dice_container.classList.remove('hide');
                document.getElementById('diceInstructions').innerText= "Tap to Roll Dice";
            }else{
                manualDiceRoll.classList.remove('hide');
                dice_container.classList.add('hide');
                document.getElementById('diceInstructions').innerText= "Select Dice Number";
            }
        };
        const savedDiceMode = localStorage.getItem('diceMode');
        if (savedDiceMode) {
            diceToggleBtn.checked = savedDiceMode === 'dice';
        }
        
        diceToggleBtn.addEventListener('change', ()=>{
            localStorage.setItem('diceMode', diceToggleBtn.checked ? 'dice' : 'manual');
            updateDiceMode();
        });
        updateDiceMode();


        /*pop up events*/
        const { startNewGameBtn, newPlayerCard, newGameConfirmDialog, confirmNewGameBtn, cancelNewGameBtn } = this.#elemts;
        const { playerRange, player_countDis, playerCount_container, playerAvtar_container } = this.#elemts;
        const { playerCountForm, player_avatarForm } = this.#elemts;

        startNewGameBtn.addEventListener('click', ()=>{
            this.#openNewGameConfirmDialog();
        });
        confirmNewGameBtn.addEventListener('click', ()=>{
            this.#closeNewGameConfirmDialog();
            this.#openNewGameSetup();
        });
        cancelNewGameBtn.addEventListener('click', ()=>{
            this.#closeNewGameConfirmDialog();
        });
        newGameConfirmDialog.addEventListener('click', (event)=>{
            if (event.target === newGameConfirmDialog) {
                this.#closeNewGameConfirmDialog();
            }
        });
        document.addEventListener('keydown', (event)=>{
            if (event.key === 'Escape' && !newGameConfirmDialog.classList.contains('hide')) {
                this.#closeNewGameConfirmDialog();
            }
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
            // console.log(count);
            this.#totalPlayers = count;
            playerCount_container.classList.add('hide');
            
            this.#tempPlayersData={}; //this will reset list for genratePlayer Form
            this.#genratePlayerForm();
        }); 
    }
    
    /*player data store methoss start*/
    #storePlayerData(playerData){
        console.log(playerData);
        localStorage.setItem('playersData', JSON.stringify(playerData));
        this.#players= playerData;
    }
    #getPlayerData(){
        let data={};
        try{
            data = localStorage.getItem('playersData');
            data = data ? JSON.parse( data ) : {};
        }catch(e){
            console.error("Corrupted player data in localStorage:", e);
            localStorage.removeItem('playersData'); // corrupted clear
            return {};
        }
        console.log(data);
        return data || {};
    }
    #getSavedTurn(){
        const savedPlayerId = parseInt(localStorage.getItem('currentPlayerId'));
        return Number.isInteger(savedPlayerId) ? savedPlayerId : 1;
    }
    #getPlayerIds(){
        return Object.keys(this.#players).map(Number).sort((a, b) => a - b);
    }
    #getActivePlayerIds(){
        return this.#getPlayerIds().filter(pid => {
            const player = this.#players[pid];
            return !player.completed && (player.pos ?? 0) < 100;
        });
    }
    #getCurrentPlayerId(){
        const playerIds = this.#getActivePlayerIds();
        if (!playerIds.length) return null;

        if (!playerIds.includes(this.#currentPlayerId)) {
            this.#currentPlayerId = playerIds[0];
            this.#storeCurrentTurn();
        }

        return this.#currentPlayerId;
    }
    #storeCurrentTurn(){
        localStorage.setItem('currentPlayerId', this.#currentPlayerId);
    }
    #goToNextTurn(){
        const playerIds = this.#getActivePlayerIds();
        if (!playerIds.length) {
            this.#updateTurnInfo();
            return;
        }

        const currentIndex = playerIds.indexOf(this.#currentPlayerId);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % playerIds.length;
        this.#currentPlayerId = playerIds[nextIndex];
        this.#storeCurrentTurn();
        this.#updateTurnInfo();
    }
    #updateTurnInfo(){
        const { playerTurnInfo } = this.#elemts;
        if (!playerTurnInfo) return;

        const currentPlayerId = this.#getCurrentPlayerId();
        if (!currentPlayerId) {
            playerTurnInfo.innerText = this.#getPlayerIds().length ? "Game Complete" : "Start New Game";
            return;
        }

        const playerName = this.#players[currentPlayerId]?.playerName || `Player ${currentPlayerId}`;
        playerTurnInfo.innerText = `${playerName}'s Turn`;
    }
    #playCurrentTurn(steps){
        const playerId = this.#getCurrentPlayerId();
        if (!playerId || !this.#players[playerId]?.canvas) {
            this.#isRollingDice = false;
            this.#updateTurnInfo();
            return;
        }

        const player = this.#players[playerId];
        if ((!player.pos || player.pos <= 0) && steps !== 1 && steps !== 6) {
            this.#storePlayerData(this.#players);
            this.#goToNextTurn();
            this.#isRollingDice = false;
            return;
        }
        if (player.pos > 0 && player.pos + steps > 100) {
            this.#storePlayerData(this.#players);
            this.#goToNextTurn();
            this.#isRollingDice = false;
            return;
        }

        this.#movePlayer(playerId, steps, () => {
            this.#storePlayerData(this.#players);
            this.#goToNextTurn();
            this.#isRollingDice = false;
        });
    }
    #loadPlayerOnBord(){
        this.#elemts['bord'].querySelectorAll(':scope > .player, :scope > .playerNameTooltip').forEach(player => player.remove());
        for (const pid of Object.keys(this.#players)) {
            this.#spawnPlayer(parseInt(pid));
        }
        this.#updateAllPlayerPositions();
    }
    #updateAllPlayerPositions(){
        for (const pid of Object.keys(this.#players)) {
            const canvas = this.#players[pid].canvas;
            if (!canvas) continue;

            const transition = canvas.style.transition;
            const tooltipTransition = this.#players[pid].tooltip?.style.transition;
            canvas.style.transition = "none";
            if (this.#players[pid].tooltip) this.#players[pid].tooltip.style.transition = "none";
            this.#updatePlayerPosition(parseInt(pid));
            requestAnimationFrame(() => {
                canvas.style.transition = transition;
                if (this.#players[pid].tooltip) this.#players[pid].tooltip.style.transition = tooltipTransition;
            });
        }
    }
    #updateCompletedPlayerPositions(){
        for (const pid of this.#getPlayerIds()) {
            const player = this.#players[pid];
            if (player?.canvas && (player.completed || player.pos >= 100)) {
                this.#updatePlayerPosition(pid);
            }
        }
    }
    #resetGame(){
        this.#players={};
        localStorage.removeItem('playersData');
        localStorage.removeItem('currentPlayerId');
    }
    #resetNewPlayerCard(){
        const {playerAvtar_container, playerCount_container}=this.#elemts;
        playerAvtar_container.innerHTML=""
        playerAvtar_container.classList.add('hide');
        playerCount_container.classList.remove('hide');
    } 
    #openNewGameConfirmDialog(){
        const { newGameConfirmDialog, confirmNewGameBtn } = this.#elemts;
        newGameConfirmDialog.classList.remove('hide');
        confirmNewGameBtn.focus();
    }
    #closeNewGameConfirmDialog(){
        const { newGameConfirmDialog, startNewGameBtn } = this.#elemts;
        newGameConfirmDialog.classList.add('hide');
        startNewGameBtn.focus();
    }
    #openNewGameSetup(){
        const { newPlayerCard } = this.#elemts;
        this.#resetNewPlayerCard();
        newPlayerCard.classList.remove('hide');
    }
    /*player data store methoss end*/ 
/* player movement code start*/ 
    
    #spawnPlayer(playerId) {
        const { bord } = this.#elemts;
        const player = this.#players[playerId];
        const avatar = this.#charAvatar[player.avatar];

        // console.log(this.#charAvatar[player.avatar]);

        const canvas = document.createElement('canvas');
        canvas.width = avatar.canvas?.width ?? avatar.canvasWidth ?? avatar.animations.idle.frameWidth;
        canvas.height = avatar.canvas?.height ?? avatar.canvasHeight ?? avatar.animations.idle.frameHeight;
       
        canvas.style.position = 'absolute';
        canvas.style.transition = "left 0.35s linear, top 0.35s linear"; // smooth move

        canvas.classList.add('player');
        canvas.dataset.playerId = playerId;
        canvas.dataset.playerName =  this.#players[playerId].playerName;
        canvas.title = this.#players[playerId].playerName;

        const tooltip = document.createElement('div');
        tooltip.classList.add('playerNameTooltip');
        tooltip.dataset.playerId = playerId;
        tooltip.innerText = this.#players[playerId].playerName;
        tooltip.title = this.#players[playerId].playerName;

        bord.appendChild(canvas);
        bord.appendChild(tooltip);
        // document.body.appendChild(canvas);

        this.#players[playerId].canvas = canvas;
        this.#players[playerId].tooltip = tooltip;
        if (!this.#players[playerId].pos){
            this.#players[playerId].pos = 0;
        }
        

        // यहां avatar sprite animation apply करो
        applySpriteAnimation(canvas, avatar);
        canvas.addEventListener('mouseenter', () => {
            if (!this.#isRollingDice) canvas.playAnimation('hover');
        });
        canvas.addEventListener('mouseleave', () => {
            if (!this.#isRollingDice) canvas.stopAnimation();
        });
        canvas.addEventListener('pointerdown', () => {
            if (!this.#isRollingDice) canvas.playAnimation('touch');
        });
        canvas.addEventListener('pointerup', () => {
            if (!this.#isRollingDice) canvas.stopAnimation();
        });
        canvas.addEventListener('pointercancel', () => {
            if (!this.#isRollingDice) canvas.stopAnimation();
        });

        this.#applyPlayerDirection(playerId);
        this.#updatePlayerPosition(playerId);
    }
    #movePlayer(playerId, steps, onMoveComplete = () => {}) {
        const player = this.#players[playerId];
        let targetPos = player.pos + steps;

        let currentPos = player.pos;
        const canvas = player.canvas;
        if (currentPos === targetPos) {
            onMoveComplete();
            return;
        }

        // चलते वक्त animation ON
        canvas.startWalk();

        const walkInterval = setInterval(() => {
            const previousPos = currentPos;
            currentPos++;
            player.pos = currentPos;
            this.#setPlayerDirection(playerId, previousPos, currentPos);
            this.#updatePlayerPosition(playerId);

            if (currentPos === targetPos) {
                clearInterval(walkInterval);

                setTimeout(() => {
                // Snake/Ladder check
                const { snakes, ladders } = this.#snakeLaddersPositionData;
                const snake = snakes.find(s => s.start === currentPos);
                const ladder = ladders.find(l => l.start === currentPos);
                const effect = snake ? "fall" : ladder ? "climb" : null;
                const effectEnd = snake?.end ?? ladder?.end;

                if (effect) {
                    this.#setPlayerDirection(playerId, currentPos, effectEnd);
                    if (snake) {
                        this.#animateSnakeBite(playerId, currentPos, effectEnd, snake, () => {
                            onMoveComplete();
                        });
                        return;
                    }

                    player.pos = effectEnd;
                    canvas.playAnimation(effect);
                    if (ladder) ladder.canvas?.playClimb?.();
                    this.#updatePlayerPosition(playerId);
                    setTimeout(() => {
                        if (player.pos >= 100) {
                            player.completed = true;
                            this.#showVictory(playerId);
                            this.#updateCompletedPlayerPositions();
                        }

                        canvas.stopWalk();
                        onMoveComplete();
                    }, 350);
                    return;
                }

                // चलते वक्त animation OFF
                if (player.pos >= 100) {
                    player.completed = true;
                    this.#showVictory(playerId);
                    this.#updateCompletedPlayerPositions();
                }

                canvas.stopWalk();
                onMoveComplete();
                }, 350);
            }
        }, 450);
    }

    #showVictory(playerId) {
        const player = this.#players[playerId];
        if (!player || player.victoryShown) return;

        player.victoryShown = true;
        const rank = this.#getCompletedRank(playerId);
        const playerName = player.playerName || `Player ${playerId}`;
        const overlay = this.#getVictoryOverlay();
        const title = overlay.querySelector('.victory-title');

        title.innerText = `${playerName} reached ${rank}!`;
        overlay.classList.remove('hide');
        this.#startConfetti(overlay);
    }

    #getCompletedRank(playerId) {
        const completedPlayerIds = this.#getPlayerIds().filter(pid => {
            const completedPlayer = this.#players[pid];
            return completedPlayer?.completed || completedPlayer?.pos >= 100 || pid === playerId;
        });

        return this.#formatRank(completedPlayerIds.length);
    }

    #formatRank(rank) {
        const teen = rank % 100;
        if (teen >= 11 && teen <= 13) return `${rank}th`;

        const lastDigit = rank % 10;
        if (lastDigit === 1) return `${rank}st`;
        if (lastDigit === 2) return `${rank}nd`;
        if (lastDigit === 3) return `${rank}rd`;
        return `${rank}th`;
    }

    #getVictoryOverlay() {
        let overlay = document.querySelector('.victory-overlay');
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.className = 'victory-overlay hide';
        overlay.innerHTML = `
            <button class="victory-close" type="button" aria-label="Close victory message">&times;</button>
            <div class="confetti-container"></div>
            <h1 class="victory-title"></h1>
        `;

        overlay.querySelector('.victory-close').addEventListener('click', () => {
            this.#hideVictory(overlay);
        });

        document.body.appendChild(overlay);
        return overlay;
    }

    #hideVictory(overlay = document.querySelector('.victory-overlay')) {
        if (!overlay) return;

        overlay.classList.add('hide');
        clearInterval(this.#confettiInterval);
        this.#confettiInterval = null;
        overlay.querySelector('.confetti-container')?.replaceChildren();
    }

    #startConfetti(overlay) {
        const container = overlay.querySelector('.confetti-container');
        if (!container) return;

        clearInterval(this.#confettiInterval);
        container.replaceChildren();

        const confettiColors = ["#fce18a", "#ff726d", "#b48def", "#f4306d"];
        const confettiAnimations = ["slow", "medium", "fast"];

        this.#confettiInterval = setInterval(() => {
            const confettiEl = document.createElement("div");
            const confettiSize = `${Math.floor(Math.random() * 3) + 7}px`;
            const confettiBackground = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const confettiLeft = `${Math.floor(Math.random() * overlay.offsetWidth)}px`;
            const confettiAnimation = confettiAnimations[Math.floor(Math.random() * confettiAnimations.length)];

            confettiEl.classList.add("confetti", `confetti--animation-${confettiAnimation}`);
            confettiEl.style.left = confettiLeft;
            confettiEl.style.width = confettiSize;
            confettiEl.style.height = confettiSize;
            confettiEl.style.backgroundColor = confettiBackground;

            setTimeout(() => confettiEl.remove(), 3000);
            container.appendChild(confettiEl);
        }, 25);

        setTimeout(() => {
            clearInterval(this.#confettiInterval);
            this.#confettiInterval = null;
        }, 4500);
    }

    #animateSnakeBite(playerId, fromPos, toPos, snake, onComplete = () => {}) {
        const player = this.#players[playerId];
        const canvas = player.canvas;
        const tooltip = player.tooltip;
        const bordRect = this.#elemts['bord'].getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const from = this.#getBoardPosition(fromPos, bordRect);
        const to = this.#getBoardPosition(toPos, bordRect);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy) || 1;
        const waveX = -dy / distance;
        const waveY = dx / distance;
        const amplitude = Math.min(bordRect.width, bordRect.height) / 55;
        const duration = 950;
        const canvasTransition = canvas.style.transition;
        const tooltipTransition = tooltip?.style.transition;
        let startTime = null;

        canvas.style.transition = "none";
        if (tooltip) tooltip.style.transition = "none";
        canvas.playAnimation("slither");
        playSnakeSlither(snake);

        const setPixelPosition = (x, y) => {
            canvas.style.left = `${x - canvasRect.width / 2}px`;
            canvas.style.top = `${y - canvasRect.height / 2}px`;
            canvas.style.bottom = "";
            this.#updatePlayerTooltipPosition(playerId);
        };

        const animate = (time) => {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const wave = Math.sin(progress * Math.PI * 5) * amplitude * (1 - progress * 0.35);
            const x = from.x + dx * eased + waveX * wave;
            const y = from.y + dy * eased + waveY * wave;

            setPixelPosition(x, y);

            if (progress < 1) {
                requestAnimationFrame(animate);
                return;
            }

            player.pos = toPos;
            setPixelPosition(to.x, to.y);
            canvas.style.transition = canvasTransition;
            if (tooltip) tooltip.style.transition = tooltipTransition;
            canvas.stopWalk();
            onComplete();
        };

        requestAnimationFrame(animate);
    }

    #attachBoardSpriteEvents(spriteCanvas) {
        spriteCanvas.addEventListener('mouseenter', () => {
            if (!this.#isRollingDice) spriteCanvas.playHover?.();
        });
        spriteCanvas.addEventListener('mouseleave', () => {
            if (!this.#isRollingDice) spriteCanvas.stopAnimation?.();
        });
        spriteCanvas.addEventListener('pointerdown', () => {
            if (!this.#isRollingDice) spriteCanvas.playTouch?.();
        });
        spriteCanvas.addEventListener('pointerup', () => {
            if (!this.#isRollingDice) spriteCanvas.stopAnimation?.();
        });
        spriteCanvas.addEventListener('pointercancel', () => {
            if (!this.#isRollingDice) spriteCanvas.stopAnimation?.();
        });
    }

    #updatePlayerPosition(playerId) {
        const player = this.#players[playerId];
        const canvas = player.canvas;
        const pos = player.pos;

        // अगर अभी तक board पर नहीं रखा गया
        if (player.completed || (pos >= 100 && !this.#isRollingDice)) {
            this.#updatePlayerCompletePosition(playerId);
            return;
        }

        if (pos <= 0) {
            // start position मान लो box 1 के बाहर corner पर
            this.#updatePlayerStartPosition(playerId);
            return;
        }

        const bordRect = this.#elemts['bord'].getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const { x, y } = this.#getBoardPosition(pos, bordRect);

        const offsetX = x - canvasRect.width / 2;
        const offsetY = y - canvasRect.height / 2;

        canvas.style.left = `${offsetX}px`;
        canvas.style.top = `${offsetY}px`;
        canvas.style.bottom = "";
        this.#updatePlayerTooltipPosition(playerId);
    }

    #updatePlayerTooltipPosition(playerId) {
        const player = this.#players[playerId];
        const canvas = player?.canvas;
        const tooltip = player?.tooltip;
        if (!canvas || !tooltip) return;

        const canvasRect = canvas.getBoundingClientRect();
        const left = parseFloat(canvas.style.left || "0") + canvasRect.width / 2;
        const top = parseFloat(canvas.style.top || "0") - 4;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    #updatePlayerStartPosition(playerId) {
        const { bord, plateform } = this.#elemts;
        const player = this.#players[playerId];
        const canvas = player.canvas;
        if (!canvas || !plateform) return;

        const waitingPlayerIds = this.#getActivePlayerIds().filter(pid => {
            const waitingPlayer = this.#players[pid];
            return waitingPlayer?.canvas && (!waitingPlayer.pos || waitingPlayer.pos <= 0);
        });
        const playerIndex = Math.max(waitingPlayerIds.indexOf(playerId), 0);
        const totalPlayers = Math.max(waitingPlayerIds.length, 1);
        const columns = Math.ceil(Math.sqrt(totalPlayers));
        const rows = Math.ceil(totalPlayers / columns);
        const row = Math.floor(playerIndex / columns);
        const column = playerIndex % columns;
        const bordRect = bord.getBoundingClientRect();
        const plateformRect = plateform.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const cellWidth = plateformRect.width / columns;
        const cellHeight = plateformRect.height / rows;
        const offsetX = plateformRect.left - bordRect.left + column * cellWidth + cellWidth / 2 - canvasRect.width / 2;
        const offsetY = plateformRect.top - bordRect.top + row * cellHeight + cellHeight / 2 - canvasRect.height / 2;

        canvas.style.left = `${offsetX}px`;
        canvas.style.top = `${offsetY}px`;
        canvas.style.bottom = "";
        this.#updatePlayerTooltipPosition(playerId);
    }

    #updatePlayerCompletePosition(playerId) {
        const { bord, completePlateform } = this.#elemts;
        const player = this.#players[playerId];
        const canvas = player.canvas;
        if (!canvas || !completePlateform) return;

        const completedPlayerIds = this.#getPlayerIds().filter(pid => {
            const completedPlayer = this.#players[pid];
            return completedPlayer?.canvas && (completedPlayer.completed || completedPlayer.pos >= 100);
        });
        const playerIndex = Math.max(completedPlayerIds.indexOf(playerId), 0);
        const totalPlayers = Math.max(completedPlayerIds.length, 1);
        const columns = Math.ceil(Math.sqrt(totalPlayers));
        const rows = Math.ceil(totalPlayers / columns);
        const row = Math.floor(playerIndex / columns);
        const column = playerIndex % columns;
        const bordRect = bord.getBoundingClientRect();
        const completePlateformRect = completePlateform.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const cellWidth = completePlateformRect.width / columns;
        const cellHeight = completePlateformRect.height / rows;
        const offsetX = completePlateformRect.left - bordRect.left + column * cellWidth + cellWidth / 2 - canvasRect.width / 2;
        const offsetY = completePlateformRect.top - bordRect.top + row * cellHeight + cellHeight / 2 - canvasRect.height / 2;

        canvas.style.left = `${offsetX}px`;
        canvas.style.top = `${offsetY}px`;
        canvas.style.bottom = "";
        this.#updatePlayerTooltipPosition(playerId);
    }

    #setPlayerDirection(playerId, fromPos, toPos) {
        if (fromPos <= 0 || fromPos > 100 || toPos <= 0 || toPos > 100) return;

        const canvas = this.#players[playerId].canvas;
        const bordRect = this.#elemts['bord'].getBoundingClientRect();
        const fromPosition = this.#getBoardPosition(fromPos, bordRect);
        const toPosition = this.#getBoardPosition(toPos, bordRect);

        if (toPosition.x < fromPosition.x) {
            this.#players[playerId].direction = "left";
        } else if (toPosition.x > fromPosition.x) {
            this.#players[playerId].direction = "right";
        }

        this.#applyPlayerDirection(playerId);
    }

    #applyPlayerDirection(playerId) {
        const player = this.#players[playerId];
        if (!player?.canvas) return;

        player.canvas.style.transform = player.direction === "left" ? "scaleX(-1)" : "scaleX(1)";
    }

    #getBoardPosition(pos, bordRect = this.#elemts['bord'].getBoundingClientRect()) {
        const logicalRow = Math.floor((pos - 1) / 10);
        const logicalCol = (pos - 1) % 10;
        const rowFromTop = 9 - logicalRow;
        const colFromLeft = logicalRow % 2 === 0 ? logicalCol : 9 - logicalCol;
        const cellWidth = bordRect.width / 10;
        const cellHeight = bordRect.height / 10;

        return {
            x: colFromLeft * cellWidth + cellWidth / 2,
            y: rowFromTop * cellHeight + cellHeight / 2,
        };
    }

/* player movement code End*/ 



    #toggleScreen() {
        const {toggleBtnImg, toggleScreenText} = this.#elemts;

        const header = document.getElementsByTagName('header')[0];
        const footer = document.getElementsByTagName('footer')[0];
        if (header.classList.contains('hide')){
            header.classList.remove('hide');
            footer.classList.remove('hide');
            toggleBtnImg.src = "./img/expand-solid-full.svg";
            toggleBtnImg.title = "Full Screen";
            toggleScreenText.innerText = "Enter Full Screen";
        }else{
            header.classList.add('hide');
            footer.classList.add('hide');
            toggleBtnImg.src = "./img/compress-solid-full.svg";
            toggleBtnImg.title = "Exit Full Screen";
            toggleScreenText.innerText = "Exit Full Screen";
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
        for (let number = 1; number <= 100; number++) {
            addBox(number);
        }
        bord.append(boxfeg);
        

        function addBox(num){
            const newbox= document.createElement('div');
            const logicalRow = Math.floor((num - 1) / 10);
            const logicalCol = (num - 1) % 10;
            const gridRow = 10 - logicalRow;
            const gridCol = logicalRow % 2 === 0 ? logicalCol + 1 : 10 - logicalCol;

            newbox.classList.add('box');
            newbox.innerText = num;
            newbox.dataset.box_num = num;
            newbox.style.gridRow = gridRow;
            newbox.style.gridColumn = gridCol;
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
        const bordRect = bord.getBoundingClientRect();
        snakes.forEach((obj)=>{
            const snakeImage = document.createElement('canvas');
            snakeImage.classList.add('snakeImg');
            snakeImage.dataset.snakeStart = obj.start;
            applySnakeSpriteAnimation(snakeImage, obj);
            this.#attachBoardSpriteEvents(snakeImage);
            obj.canvas = snakeImage;
            bord.appendChild(snakeImage);
            positionImage(snakeImage, this.#getBoardPosition(obj.start, bordRect), this.#getBoardPosition(obj.end, bordRect))
        });
        ladders.forEach((obj)=>{
            const ladderImage = document.createElement('canvas');
            ladderImage.classList.add('leaderImg')
            ladderImage.dataset.ladderStart = obj.start;
            ladderImage.width = obj.animation.canvas?.width ?? obj.animation.animations.idle.frameWidth;
            ladderImage.height = obj.animation.canvas?.height ?? obj.animation.animations.idle.frameHeight;
            applySpriteAnimation(ladderImage, obj.animation);
            this.#attachBoardSpriteEvents(ladderImage);
            obj.canvas = ladderImage;

            bord.appendChild(ladderImage);
            positionImage(ladderImage, this.#getBoardPosition(obj.start, bordRect), this.#getBoardPosition(obj.end, bordRect));
        });
function positionImage(image, box1center, box2center) {
    const { x:x1, y:y1 } = box1center;
    const { x:x2, y:y2 } = box2center;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const bordRect = bord.getBoundingClientRect();

    // अब हमेशा relative position निकालें
    const offsetX = x1;
    const offsetY = y1;

    image.style.width = `${length}px`;
    image.style.height = `auto`;
    image.style.left = `${offsetX}px`;
    image.style.top = `${offsetY}px`;
    image.style.transform = `translateY(-50%) rotate(${angle}deg)`;
}
        function positionImage2(image, box1center, box2center) {
            const { x:x1, y:y1 } = box1center;
            const { x:x2, y:y2 } = box2center;

            let dx = x2 - x1;
            let dy = y2 - y1;
            let length = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            // console.log( image.naturalHeight );
            // console.log( image.offsetHeight );
            let imgHeight = 10; // तुम्हारी image की height (px में)
            
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
        
        const boxs=  bord.querySelectorAll(':scope > .box');

        boxs.forEach((box)=>{
            const rect =  box.getBoundingClientRect();
            const X= Math.floor(rect.left + (rect.width/2));
            const Y= Math.floor(rect.top + (rect.height/2));
            
            // console.log(`box=${box.dataset.box_num}, x= ${X} y=${Y}`);
            this.#BoxCenterList[`${ box.dataset.box_num}`]= {x:X, y: Y};
            // console.log(this.#BoxCenterList[`${ box.dataset.box_num}`]);

        });

        // console.log(this.#BoxCenterList);
    }
    #genratePlayerForm( current_player=1){
        const {playerAvtar_container, newPlayerCard, playerCount_container} =  this.#elemts;

        playerAvtar_container.innerHTML = ""; //Empty container
        // console.log(current_player);
        
        this.#tempPlayersData[current_player] = {playerName:"", avatar:null };
        const form =  document.createElement('form');
        const submitButtonText = current_player < this.#totalPlayers ? `Save Player ${current_player}` : "Start Game";

        form.name = `player_avatarForm`;
        form.dataset.playerId = current_player;
        form.method = 'GET';
        form.innerHTML = `<label for="playerName" class="playerNameLabel">Enter Player Name </label>
                            <input type="text" name="playerName" id="playerName" placeholder="player_${current_player}" value="player_${current_player}" required>

                            <label for="chouseAvtar">Chouse Character for your player</label>
                            <div class="avatar-options">
                                ${playerAvtarOpctionGenrator(this.#charAvatar)}
                            </div>
                            <button type="submit">${submitButtonText}</button>`;
        
        form.addEventListener('submit', (event)=>{
            event.preventDefault();
            const playerId =  parseInt(event.target.dataset.playerId);
            const playerName = event.target.playerName.value;
            const avatarId =   event.target.player_avatar.value;

            this.#tempPlayersData[playerId].avatar = avatarId;
            this.#tempPlayersData[playerId].playerName = playerName;
            // console.log(this.#tempPlayersData);
            // console.log(playerId, this.#totalPlayers);

            if (playerId < this.#totalPlayers){
                this.#genratePlayerForm(playerId+1);
                
            }else{
                
                this.#storePlayerData(this.#tempPlayersData);
                this.#tempPlayersData={};
                this.#resetNewPlayerCard(); //reset container
                newPlayerCard.classList.add('hide');

                //store player info
                // this.#resetGame();
                
                this.#currentPlayerId = 1;
                this.#storeCurrentTurn();
                this.#loadPlayerOnBord();
                this.#updateTurnInfo();
                this.#showGameMessage("Game Started");
            }
        });

        playerAvtar_container.appendChild(form);                               
        for (const [id, avtar]  of Object.entries(this.#charAvatar) ){
            animateAvatar(avtar.canvasId, avtar.animations.walk);
        }
        
        function playerAvtarOpctionGenrator(charAvatar){
                const avatarNames = {
                    1: "Red Hero",
                    2: "Robot",
                    3: "Ninja",
                    4: "Royal",
                    5: "Princess",
                    6: "Wizard",
                    7: "Pirate",
                    8: "Explorer",
                    9: "Astronaut",
                    10: "Knight",
                    11: "Fairy",
                    12: "Detective",
                    13: "Villager",
                    14: "Queen",
                    15: "Cyber Ninja",
                    16: "Mermaid",
                };
                let opctions='';
                for (let i=1; i<= Object.keys(charAvatar).length; i++){
                    const avatarName = avatarNames[i] || `Character ${i}`;

                    opctions += ` <!-- Avatar ${i} -->
                    <input type="radio" id="avatar${i}" name="player_avatar" value="${i}" required>
                    <label for="avatar${i}">
                    <canvas id="canvas${i}" width="256" height="256"></canvas>
                    <span class="avatarName">${avatarName}</span>
                    </label>`
                }
                
                return opctions;
        }
        playerAvtar_container.classList.remove('hide');
    }
    #showGameMessage(message){
        const { gameStartMessage } = this.#elemts;
        if (!gameStartMessage) return;

        clearTimeout(this.#gameMessageTimer);
        gameStartMessage.innerText = message;
        gameStartMessage.classList.remove('hide');

        this.#gameMessageTimer = setTimeout(() => {
            gameStartMessage.classList.add('hide');
        }, 1800);
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

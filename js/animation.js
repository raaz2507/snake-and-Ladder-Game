const PLAYER_FRAME_SIZE = 256;
const PLAYER_CANVAS = {
    width: 256,
    height: 256,
};

const createPlayerAnimation = (canvasId, file, speeds) => ({
    name: canvasId,
    canvasId,
    canvas: PLAYER_CANVAS,
    animations: {
        idle: {
            file,
            frameWidth: PLAYER_FRAME_SIZE,
            frameHeight: PLAYER_FRAME_SIZE,
            frameCount: 1,
            columns: 1,
            rows: 1,
            speed: speeds.idle,
            loop: false,
        },
        walk: {
            file,
            frameWidth: PLAYER_FRAME_SIZE,
            frameHeight: PLAYER_FRAME_SIZE,
            frameCount: 6,
            columns: 6,
            rows: 1,
            speed: speeds.walk,
            loop: true,
        },
        climb: {
            file,
            frameWidth: PLAYER_FRAME_SIZE,
            frameHeight: PLAYER_FRAME_SIZE,
            frameCount: 6,
            columns: 6,
            rows: 1,
            speed: speeds.climb,
            loop: true,
        },
        fall: {
            file,
            frameWidth: PLAYER_FRAME_SIZE,
            frameHeight: PLAYER_FRAME_SIZE,
            frameCount: 6,
            columns: 6,
            rows: 1,
            speed: speeds.fall,
            loop: false,
        },
        slither: {
            file,
            frameWidth: PLAYER_FRAME_SIZE,
            frameHeight: PLAYER_FRAME_SIZE,
            frameCount: 6,
            columns: 6,
            rows: 1,
            speed: speeds.slither,
            loop: true,
        },
        hover: {
            file,
            frameWidth: PLAYER_FRAME_SIZE,
            frameHeight: PLAYER_FRAME_SIZE,
            frameCount: 6,
            columns: 6,
            rows: 1,
            speed: speeds.hover ?? speeds.walk,
            loop: true,
        },
        touch: {
            file,
            frameWidth: PLAYER_FRAME_SIZE,
            frameHeight: PLAYER_FRAME_SIZE,
            frameCount: 6,
            columns: 6,
            rows: 1,
            speed: speeds.touch ?? speeds.walk,
            loop: false,
        },
    },
});

export const playerAnimations = {
    1: {
        ...createPlayerAnimation("canvas1", "./img/avatars/player-red.png", {
            idle: 180,
            walk: 110,
            climb: 125,
            fall: 85,
            slither: 75,
        }),
    },
    2: {
        ...createPlayerAnimation("canvas2", "./img/avatars/player-robot.png", {
            idle: 220,
            walk: 150,
            climb: 170,
            fall: 110,
            slither: 95,
        }),
    },
    3: {
        ...createPlayerAnimation("canvas3", "./img/avatars/player-ninja.png", {
            idle: 160,
            walk: 85,
            climb: 95,
            fall: 70,
            slither: 60,
        }),
    },
    4: {
        ...createPlayerAnimation("canvas4", "./img/avatars/player-royal.png", {
            idle: 240,
            walk: 130,
            climb: 145,
            fall: 100,
            slither: 90,
        }),
    },
    5: {
        ...createPlayerAnimation("canvas5", "./img/avatars/player-princess.png", {
            idle: 190,
            walk: 115,
            climb: 130,
            fall: 90,
            slither: 80,
        }),
    },
    6: {
        ...createPlayerAnimation("canvas6", "./img/avatars/player-wizard.png", {
            idle: 210,
            walk: 135,
            climb: 150,
            fall: 100,
            slither: 90,
        }),
    },
    7: {
        ...createPlayerAnimation("canvas7", "./img/avatars/player-pirate.png", {
            idle: 180,
            walk: 105,
            climb: 120,
            fall: 85,
            slither: 75,
        }),
    },
    8: {
        ...createPlayerAnimation("canvas8", "./img/avatars/player-explorer.png", {
            idle: 200,
            walk: 120,
            climb: 135,
            fall: 95,
            slither: 85,
        }),
    },
    9: {
        ...createPlayerAnimation("canvas9", "./img/avatars/player-astronaut.png", {
            idle: 230,
            walk: 145,
            climb: 160,
            fall: 110,
            slither: 100,
        }),
    },
    10: {
        ...createPlayerAnimation("canvas10", "./img/avatars/player-knight.png", {
            idle: 220,
            walk: 140,
            climb: 155,
            fall: 105,
            slither: 95,
        }),
    },
    11: {
        ...createPlayerAnimation("canvas11", "./img/avatars/player-fairy.png", {
            idle: 165,
            walk: 95,
            climb: 110,
            fall: 75,
            slither: 70,
        }),
    },
    12: {
        ...createPlayerAnimation("canvas12", "./img/avatars/player-detective.png", {
            idle: 205,
            walk: 125,
            climb: 140,
            fall: 95,
            slither: 85,
        }),
    },
    13: {
        ...createPlayerAnimation("canvas13", "./img/avatars/player-villager.png", {
            idle: 195,
            walk: 115,
            climb: 130,
            fall: 90,
            slither: 80,
        }),
    },
    14: {
        ...createPlayerAnimation("canvas14", "./img/avatars/player-queen.png", {
            idle: 235,
            walk: 135,
            climb: 150,
            fall: 100,
            slither: 90,
        }),
    },
    15: {
        ...createPlayerAnimation("canvas15", "./img/avatars/player-cyber-ninja.png", {
            idle: 160,
            walk: 85,
            climb: 100,
            fall: 70,
            slither: 60,
        }),
    },
    16: {
        ...createPlayerAnimation("canvas16", "./img/avatars/player-mermaid.png", {
            idle: 210,
            walk: 130,
            climb: 145,
            fall: 95,
            slither: 85,
        }),
    },
};

export const snakeAnimations = {
    classic: {
        canvas: {
            width: 1024,
            height: 333,
        },
        animations: {
            idle: {
                file: "./img/snakes/snake.png",
                frameWidth: 3052,
                frameHeight: 993,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: false,
            },
            bite: {
                file: "./img/snakes/snake-slither.png",
                frameWidth: 1024,
                frameHeight: 333,
                frameCount: 12,
                columns: 12,
                rows: 1,
                speed: 60,
                loop: false,
            },
            hover: {
                file: "./img/snakes/snake-slither.png",
                frameWidth: 1024,
                frameHeight: 333,
                frameCount: 12,
                columns: 12,
                rows: 1,
                speed: 90,
                loop: true,
            },
            touch: {
                file: "./img/snakes/snake-slither.png",
                frameWidth: 1024,
                frameHeight: 333,
                frameCount: 12,
                columns: 12,
                rows: 1,
                speed: 55,
                loop: false,
            },
            slither: {
                file: "./img/snakes/snake-slither.png",
                frameWidth: 1024,
                frameHeight: 333,
                frameCount: 12,
                columns: 12,
                rows: 1,
                speed: 60,
                loop: false,
            },
        },
    },
};

export const ladderAnimations = {
    classic: {
        canvas: {
            width: 800,
            height: 332,
        },
        animations: {
            idle: {
                file: "./img/ladders/Ladder.png",
                frameWidth: 800,
                frameHeight: 332,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: false,
            },
            climb: {
                file: "./img/ladders/Ladder.png",
                frameWidth: 800,
                frameHeight: 332,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: false,
            },
            hover: {
                file: "./img/ladders/Ladder.png",
                frameWidth: 800,
                frameHeight: 332,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: true,
            },
            touch: {
                file: "./img/ladders/Ladder.png",
                frameWidth: 800,
                frameHeight: 332,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: false,
            },
        },
    },
};

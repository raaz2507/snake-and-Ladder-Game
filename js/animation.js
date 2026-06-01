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
        ...createPlayerAnimation("canvas1", "./img/player-red.png", {
            idle: 180,
            walk: 110,
            climb: 125,
            fall: 85,
            slither: 75,
        }),
    },
    2: {
        ...createPlayerAnimation("canvas2", "./img/player-robot.png", {
            idle: 220,
            walk: 150,
            climb: 170,
            fall: 110,
            slither: 95,
        }),
    },
    3: {
        ...createPlayerAnimation("canvas3", "./img/player-ninja.png", {
            idle: 160,
            walk: 85,
            climb: 95,
            fall: 70,
            slither: 60,
        }),
    },
    4: {
        ...createPlayerAnimation("canvas4", "./img/player-royal.png", {
            idle: 240,
            walk: 130,
            climb: 145,
            fall: 100,
            slither: 90,
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
                file: "./img/snake.png",
                frameWidth: 3052,
                frameHeight: 993,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: false,
            },
            bite: {
                file: "./img/snake-slither.png",
                frameWidth: 1024,
                frameHeight: 333,
                frameCount: 12,
                columns: 12,
                rows: 1,
                speed: 60,
                loop: false,
            },
            hover: {
                file: "./img/snake-slither.png",
                frameWidth: 1024,
                frameHeight: 333,
                frameCount: 12,
                columns: 12,
                rows: 1,
                speed: 90,
                loop: true,
            },
            touch: {
                file: "./img/snake-slither.png",
                frameWidth: 1024,
                frameHeight: 333,
                frameCount: 12,
                columns: 12,
                rows: 1,
                speed: 55,
                loop: false,
            },
            slither: {
                file: "./img/snake-slither.png",
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
                file: "./img/Ladder.png",
                frameWidth: 800,
                frameHeight: 332,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: false,
            },
            climb: {
                file: "./img/Ladder.png",
                frameWidth: 800,
                frameHeight: 332,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: false,
            },
            hover: {
                file: "./img/Ladder.png",
                frameWidth: 800,
                frameHeight: 332,
                frameCount: 1,
                columns: 1,
                rows: 1,
                speed: 120,
                loop: true,
            },
            touch: {
                file: "./img/Ladder.png",
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

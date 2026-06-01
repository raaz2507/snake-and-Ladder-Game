const getFrameCount = (animation) => animation.frameCount ?? animation.totalFrames ?? 1;

const getAnimationFrame = (animation, frame) => {
    const frameWidth = animation.frameWidth;
    const frameHeight = animation.frameHeight;
    const columns = animation.columns ?? getFrameCount(animation);
    const sourceFrame = getFrameCount(animation) === 1 ? 0 : frame;

    return {
        x: (sourceFrame % columns) * frameWidth,
        y: Math.floor(sourceFrame / columns) * frameHeight,
        width: frameWidth,
        height: frameHeight,
    };
};

export function applySpriteAnimation(canvas, avatarConfigOrAnimations, frameWidth, frameHeight) {
    const ctx = canvas.getContext("2d");
    const animations = avatarConfigOrAnimations.animations ?? avatarConfigOrAnimations;
    const sprites = {};

    for (const [name, animation] of Object.entries(animations)) {
        sprites[name] = new Image();
        sprites[name].src = animation.file;
    }

    let frame = 0;
    let currentAnimation = "idle";
    let loopAnimation = false;
    let animationId = null;

    const drawFrame = () => {
        const animation = animations[currentAnimation] || animations.idle;
        const sprite = sprites[currentAnimation] || sprites.idle;
        const source = getAnimationFrame({
            frameWidth: animation.frameWidth ?? frameWidth,
            frameHeight: animation.frameHeight ?? frameHeight,
            frameCount: getFrameCount(animation),
            columns: animation.columns,
        }, frame);
        if (!sprite.complete) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(sprite, source.x, source.y, source.width, source.height, 0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
        const animation = animations[currentAnimation] || animations.idle;
        const frameCount = getFrameCount(animation);

        frame++;
        if (frame >= frameCount) {
            if (!loopAnimation) {
                frame = frameCount - 1;
                drawFrame();
                return;
            }
            frame = 0;
        }

        drawFrame();
        animationId = setTimeout(() => requestAnimationFrame(animate), animation.speed);
    };

    canvas.playAnimation = (name, loop = undefined) => {
        if (!animations[name]) name = "idle";
        if (animationId) clearTimeout(animationId);

        currentAnimation = name;
        loopAnimation = loop ?? animations[name].loop ?? true;
        frame = 0;
        drawFrame();
        animate();
    };

    canvas.stopAnimation = () => {
        if (animationId) clearTimeout(animationId);
        canvas.playAnimation("idle", false);
    };

    canvas.startWalk = () => canvas.playAnimation("walk");
    canvas.stopWalk = () => canvas.stopAnimation();
    canvas.playHover = () => canvas.playAnimation("hover");
    canvas.playTouch = () => canvas.playAnimation("touch");
    canvas.playBite = () => canvas.playAnimation("bite");
    canvas.playClimb = () => canvas.playAnimation("climb");
    canvas.playSlither = () => canvas.playAnimation("slither");

    sprites.idle.onload = () => canvas.playAnimation("idle", false);
}

export function applySnakeSpriteAnimation(canvas, snakeData) {
    const animationConfig = snakeData.animation;
    canvas.width = animationConfig.canvas?.width ?? animationConfig.animations.idle.frameWidth;
    canvas.height = animationConfig.canvas?.height ?? animationConfig.animations.idle.frameHeight;
    applySpriteAnimation(canvas, animationConfig);
}

export function playSnakeSlither(snake) {
    snake?.canvas?.playBite?.();
}

export function animateAvatar(canvasId, spriteSrc, frameWidth, frameHeight, totalFrames, animationSpeed = 120) {
    const animation = typeof spriteSrc === "object" ? spriteSrc : {
        file: spriteSrc,
        frameWidth,
        frameHeight,
        frameCount: totalFrames,
        columns: totalFrames,
        speed: animationSpeed,
    };
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (canvas.avatarPreviewTimer) {
        clearInterval(canvas.avatarPreviewTimer);
    }

    canvas.width = animation.frameWidth;
    canvas.height = animation.frameHeight;

    const ctx = canvas.getContext("2d");
    const sprite = new Image();
    sprite.src = animation.file;

    let frame = 0;
    sprite.onload = () => {
        canvas.avatarPreviewTimer = setInterval(() => {
            const source = getAnimationFrame(animation, frame);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                sprite,
                source.x, source.y, source.width, source.height,
                0, 0, canvas.width, canvas.height
            );
            frame = (frame + 1) % getFrameCount(animation);
        }, animation.speed);
    };
}

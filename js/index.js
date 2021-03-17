let stage, w, h, loader, manifest;
let sea, hand, fish;
let fishAlive;  // 小鱼是否存活
let isMouseDown;

const HAND_WIDTH = 75;
const HAND_HEIGHT = 50;

function init() {
    stage = new createjs.StageGL("canvas");

    w = stage.canvas.width;
    h = stage.canvas.height;

    manifest = [
        { src: "fish/swim/swim.png", id: "fish-swim" },
        { src: "fish/touched/1.png", id: "fish-touched-1" },
        { src: "fish/touched/2.png", id: "fish-touched-2" },
        { src: "hand/idle/1.png", id: "hand-idle-1" },
        { src: "hand/touch/touch.png", id: "hand-touch" }
    ];

    loader = new createjs.LoadQueue(false);
    loader.loadManifest(manifest, true, "../assets/");
    loader.addEventListener("complete", handleComplete);
}

function handleComplete() {
    sea = new createjs.Shape();
    sea.graphics.beginFill("#ADD8E6").drawRect(0, 0, w, h);
    sea.cache(0, 0, w, h);

    const spriteSheet = new createjs.SpriteSheet({
        framerate: 10,
        "images": [
            loader.getResult("hand-touch")
        ],
        "frames": { width: HAND_WIDTH, height: HAND_HEIGHT, count: 22 },
        "animations": {
            "touch": [0, 21, "touch", 2]
        }
    });

    // hand = new createjs.Bitmap(loader.getResult("hand-idle-1"));
    hand = new createjs.Sprite(spriteSheet, "touch");
    hand.setTransform(w / 2, h / 2);

    stage.addChild(sea);
    stage.addEventListener("stagemousedown", handleMouseDown);
    stage.addEventListener("stagemousemove", handleMouseMove);
    stage.addEventListener("stagemouseup", handleMouseUp);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

function generateFish() {
    const direction = getRandomIntInclusive(0, 1) === 1 ? 1 : -1;
    fish = new Fish(
        loader,
        direction === 1 ? w : 0, 
        getRandomIntInclusive(60, 150), 
        direction
    );
    stage.addChild(fish);
    fishAlive = true;
}

function handleMouseDown(event) {
    isMouseDown = true;
    handleCollision(event);
}

function handleMouseMove(event) {
    const { stageX, stageY } = event;
    hand.x = stageX;
    hand.y = stageY;

    // if (isMouseDown) {
    //     handleCollision();
    // }
}

function handleMouseUp(event) {
    isMouseDown = false;
}

function handleCollision(event) {
    const { stageX, stageY } = event;
    // 手的触摸盒子
    const handBound = {
        left: stageX,
        right: stageX + HAND_WIDTH / 2,
        top: stageY + HAND_HEIGHT / 2,
        bottom: stageY + HAND_HEIGHT
    };
    if (fishAlive) {
        let fishBound = {
            top: fish.y + 20,
            bottom: fish.y + Fish.HEIGHT
        };
        if (fish.direction === 1) {
            fishBound.left = w - Math.abs(fish.x);
            fishBound.right = w - Math.abs(fish.x + Fish.WIDTH);
        } else {
            fishBound.left = fish.x - Fish.WIDTH;
            fishBound.right = fish.x;
        }

        if (
            handBound.left < fishBound.right &&
            handBound.right > fishBound.left &&
            handBound.top < fishBound.bottom &&
            handBound.bottom > fishBound.top
        ) {
            alert('摸到了');
        }
    }
}

function tick(event) {
    const deltaS = event.delta / 1000;
    // 画布内没有鱼
    if (!fishAlive) {
        generateFish();
    }
    // 小鱼游泳
    fish.x += deltaS * 80 * fish.direction * -1;
    // 鱼游出画布外
    if (
        (fish.direction === 1 && !(fish.x <= 0 && fish.x >= -w - Fish.WIDTH))
        || (fish.direction === -1 && !(fish.x >= 0 && fish.x <= w + Fish.WIDTH))
    ) {
        stage.removeChild(fish);
        fishAlive = false;
    }

    stage.addChild(hand);
    stage.update(event);
}
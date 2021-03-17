(function (window) {

    function Fish(loader, headX, headY, direction) {
        this.Container_constructor();
        
        this.loader = loader;
        this._sprite = null;
        this.direction = direction;
		this.headX = headX;
		this.headY = headY;
		this.index = 0;
		this.count = 0;
		this.imgs = null;

        this.activate();
    }

    const p = createjs.extend(Fish, createjs.Container);

    Fish.WIDTH = 120;
    Fish.HEIGHT = 88;

    p.activate = function() {
        const spriteSheet = new createjs.SpriteSheet({
            framerate: 10,
            "images": [
                this.loader.getResult("fish-swim")
                // this.loader.getResult("fish-touched-1"),
                // this.loader.getResult("fish-touched-2"),
            ],
            "frames": { width: 120, height: 88, count: 18 },
            "animations": {
                "swim": [0, 17, "swim"],
                // "touched": [5, 6, "swim"]
            }
        });
        this._sprite = new createjs.Sprite(spriteSheet, "swim");
        this._sprite.setTransform(this.headX, 0, this.direction * 1, 1);
        this.addChild(this._sprite);
        this.y = this.headY;
    };
    p.gotoAndPlay = function(action) {
        this._sprite.gotoAndPlay(action);
    };

    window.Fish = createjs.promote(Fish, 'Container');

}(window));
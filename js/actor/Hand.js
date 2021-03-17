(function (window) {

    function Hand(loader) {
        this.Shape_constructor();

        this.activate();
    }

    const p = createjs.extend(Hand, createjs.Shape);

    p.activate = function() {
        
    };

    window.Hand = createjs.promote(Hand, 'Shape');

}(window));
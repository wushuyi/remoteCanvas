/**
 * Created by Administrator on 2014/10/27.
 */
(function($){
    $(document).ready(function($){
        var stage = new PIXI.Stage(0xFFFFFF);
        var renderer = PIXI.autoDetectRenderer(500, 400);
        PIXI.AssetLoader([
            "./assets/image/bg.png"
        ])
        var texture = PIXI.Texture.fromImage("./assets/image/bg.png");
        texture.addEventListener('loaded', function(){
            console.log('run');
        });
        var bg = new PIXI.Sprite(texture);
        stage.addChild(bg);
        bg.anchor.x = 0;
        bg.anchor.y = 0;
        bg.position.x = 0;
        bg.position.y = 0;
        renderer.render(stage);
        $('#board').append(renderer.view);
        //requestAnimFrame(animate);
        function animate() {
            requestAnimFrame(animate);
            renderer.render(stage);
        }
    });
})(window.jQuery);
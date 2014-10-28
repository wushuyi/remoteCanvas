/**
 * Created by Administrator on 2014/10/27.
 */
(function($){
    $(document).ready(function($){
        var stage = new PIXI.Stage(0xFFFFFF);
        var renderer = PIXI.autoDetectRenderer(500, 400, null, false, false, true);
        renderer.view.style.display = "block";
        var $board = $('#board');
        $board.append(renderer.view);
        var container = new PIXI.DisplayObjectContainer();
        var loader = new PIXI.AssetLoader([
            "./assets/image/bg.png"
        ]);
        loader.on('onComplete', function(){
            var texture = new PIXI.Texture.fromImage('./assets/image/bg.png');
            var bg = new PIXI.Sprite(texture);
            stage.addChildAt(bg, 0);
            stage.addChildAt(bg, 0);

            window.texture1 = texture;
            renderer.render(stage);
        });
        loader.load();

        function pan(){
            var boardControl = {
                oldP : {

                },
                isDown: false
            };
            $board.off(".board");
            var graphics;
            var glist = [];
            var leth = 0;
            $board.on('mousedown.pan.board touchstart.pan.board', function(e){
                boardControl.isDown = true;
                var P = {
                    type: "down",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };

                boardControl.oldP = P;
                leth += 1;
                glist[leth] = new PIXI.Graphics();
                stage.addChildAt(glist[leth], stage.children.length);
                graphics = glist[leth];
                window.graphics = graphics;
                graphics.lineStyle(2, 0xFF0000, 1);

                graphics.moveTo(P.offsetX, P.offsetY);
                /*
                 graphics = new PIXI.Graphics();
                 stage.addChildAt(graphics, 0);
                 graphics.lineStyle(4, 0xFF0000, 1);
                 */
            });
            $board.on('mousemove.pan.board touchmove.pan.board', function(e){
                if(!boardControl.isDown){
                    return false;
                }
                var P = {
                    type: "move",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };

                //graphics.beginFill(0xFF0000, 1);
                //graphics.drawCircle(P.offsetX , P.offsetY, 4, 4, 2);
                //graphics.endFill();
                //renderer.render(stage);


                //var calX = P.offsetX - boardControl.oldP.offsetX;
                //var calY = P.offsetY - boardControl.oldP.offsetY;
                //var result = Math.pow((calX *calX + calY * calY), 0.5);
                //if(result > 2){
                //    //graphics.lineStyle(1, 0xFF0000, 1);
                //    graphics.beginFill(0xFF0000, 1);
                //    graphics.drawRect(P.offsetX , P.offsetY, 4, 4);
                //    graphics.endFill();
                //}else{
                //
                //}

                graphics.lineTo(P.offsetX , P.offsetY);


                //console.log(result);
                renderer.render(stage);

                //graphics.lineTo(P.offsetX , P.offsetY);
                //renderer.render(stage);
                graphics.moveTo(boardControl.oldP.offsetX, boardControl.oldP.offsetY);
                //console.log(graphics.graphicsData.length);
                boardControl.oldP = P;
            });
            $board.on('mouseup.pan.board mouseout.pan.board touchend.pan.board touchcancel.pan.board', function(e){
                boardControl.isDown = false;
                var P = {
                    type: "up",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };
                boardControl.oldP = {};
                //render(ctx[0], P);
                //console.log(e);
            });
        }
        //pan();
        window.pan = pan;

        function eraser() {
            var baseTexture = new PIXI.BaseTexture.fromImage('./assets/image/bg.png');
            var boardControl = {
                olddian: {},
                isDown: false
            };
            $board.off(".board");
            $board.on('mousedown.eraser.board touchstart.eraser.board', function(e){
                boardControl.isDown = true;
                var P = {
                    type: "down",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };
            });
            $board.on('mousemove.eraser.board touchmove.eraser.board', function(e){
                if(!boardControl.isDown){
                    return false;
                }
                var P = {
                    type: "move",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };

                var texture2 = new PIXI.Texture(baseTexture, new PIXI.Rectangle(P.offsetX , P.offsetY, 30, 30));

                window.texture2 = texture2;
                var eraser = new PIXI.Sprite(texture2);
                eraser.position.x = P.offsetX;
                eraser.position.y = P.offsetY;
                stage.addChildAt(eraser, stage.children.length);
                renderer.render(stage);
            });
            $board.on('mouseup.eraser.board mouseout.eraser.board touchend.eraser.board touchcancel.eraser.board', function(e){
                boardControl.isDown = false;
                var P = {
                    type: "up",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };
            });
        }
        window.eraser = eraser;
        //eraser();

        window.stage = stage;

        window.renderer = renderer;

        /*
        requestAnimFrame(animate);
        function animate() {
            requestAnimFrame(animate);
            renderer.render(stage);
        }
        */
    });
})(window.jQuery);
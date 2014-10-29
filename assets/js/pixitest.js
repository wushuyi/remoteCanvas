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

        var loader = new PIXI.AssetLoader([
            "./assets/image/bg.png"
        ]);
        loader.on('onComplete', function(){
            var bgcontainer = new PIXI.DisplayObjectContainer();
            stage.addChildAt(bgcontainer, 0);

            var texture = new PIXI.Texture.fromImage('./assets/image/bg.png');
            var bg = new PIXI.Sprite(texture);

            bgcontainer.addChild(bg);

            renderer.render(stage);
        });
        loader.load();

        function pen(){
            var boardControl = {
                oldP : {

                },
                isDown: false
            };
            $board.off(".board");
            var pencontainer;
            var graphics;
            var graphicsStep = 0;
            var graphicsDatastep = 0;

            function drawPan(P){
               //console.log(P);
                console.log("graphicsDatastepL " + graphicsDatastep);
                if(!pencontainer){
                    //console.log('run');
                    pencontainer = new PIXI.DisplayObjectContainer();
                    stage.addChildAt(pencontainer, stage.children.length);

                    graphics = new PIXI.Graphics();
                    graphics.lineStyle(2, 0xFF0000, 1);
                    pencontainer.addChild(graphics);
                }else{
                    if(graphicsStep == 1000){
                        pencontainersds = new PIXI.DisplayObjectContainer();
                        stage.addChildAt(pencontainer, stage.children.length);
                        graphicsStep == 0;
                    }
                    if(graphicsDatastep == 1000){
                        graphics = new PIXI.Graphics();
                        graphics.lineStyle(2, 0xFF0000, 1);
                        pencontainer.addChild(graphics);
                        graphicsDatastep = 0;
                        graphicsStep += 1;
                    }
                }

                switch (P.event){
                    case "down":

                        graphics.moveTo(P.offsetX, P.offsetY);
                        break;
                    case "move":
                        graphics.lineTo(P.offsetX , P.offsetY);
                        renderer.render(stage);
                        graphics.moveTo(boardControl.oldP.offsetX, boardControl.oldP.offsetY);
                        graphicsDatastep += 1;
                        break;
                    case "up":

                        break;
                }
            }

            $board.on('mousedown.pen.board touchstart.pen.board', function(e){
                boardControl.isDown = true;
                var P = {
                    type: "pan",
                    event: "down",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };
                drawPan(P);
                boardControl.oldP = P;
            });
            $board.on('mousemove.pen.board touchmove.pen.board', function(e){
                if(!boardControl.isDown){
                    return false;
                }
                var P = {
                    type: "pan",
                    event: "move",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };
                drawPan(P);
                boardControl.oldP = P;
            });
            $board.on('mouseup.pen.board mouseout.pen.board touchend.pen.board touchcancel.pen.board', function(e){
                boardControl.isDown = false;
                var P = {
                    type: "pan",
                    event: "up",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };
                drawPan(P);
                boardControl.oldP = {};
            });
        }
        //pen();
        window.pen = pen;

        function eraser() {
            var baseTexture = new PIXI.BaseTexture.fromImage('./assets/image/bg.png');
            var boardControl = {
                olddian: {},
                isDown: false
            };
            $board.off(".board");



            var erasercontainer;
            var erasercontainerStep = 0;

            function drawEraser(P){
                if(!erasercontainer){
                    erasercontainer = new PIXI.DisplayObjectContainer();
                    stage.addChildAt(erasercontainer, stage.children.length);
                }else{
                    if(erasercontainerStep == 1000){
                        erasercontainer = new PIXI.DisplayObjectContainer();
                        stage.addChildAt(erasercontainer, stage.children.length);
                    }
                }
                switch (P.event){
                    case "down":
                        break;
                    case "move":
                        var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(P.offsetX , P.offsetY, 30, 30));
                        var eraser = new PIXI.Sprite(texture);
                        eraser.position.x = P.offsetX;
                        eraser.position.y = P.offsetY;
                        erasercontainer.addChild(eraser);
                        erasercontainerStep += 1;
                        renderer.render(stage);
                        break;
                    case "up":
                        break;
                }
            }


            $board.on('mousedown.eraser.board touchstart.eraser.board', function(e){
                boardControl.isDown = true;
                var P = {
                    type: "eraser",
                    event: "down",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };

                drawEraser(P);

                boardControl.oldP = P;
            });
            $board.on('mousemove.eraser.board touchmove.eraser.board', function(e){
                if(!boardControl.isDown){
                    return false;
                }
                var P = {
                    type: "eraser",
                    event: "move",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };
                drawEraser(P);
            });
            $board.on('mouseup.eraser.board mouseout.eraser.board touchend.eraser.board touchcancel.eraser.board', function(e){
                boardControl.isDown = false;
                var P = {
                    type: "eraser",
                    event: "up",
                    offsetX : e.offsetX,
                    offsetY : e.offsetY
                };
                boardControl.oldP = P;
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
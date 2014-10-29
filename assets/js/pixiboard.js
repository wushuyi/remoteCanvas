/**
 * author by shuyi.wu on 2014/10/29.
 */
(function($, undefined){
    $(document).ready(function(){

        var myboard = new board($("#board"), {
            width: 500,
            height: 400,
            bgimg: "./assets/image/bg.png"
        });
        myboard.penInit();
        myboard.penInitEvent();
        window.myboard = myboard;
    });

    function board($el, options){
        this.pubEtc = {};
        this.options = {};

        var defaultOptions = {
            width: 500,
            height: 400,
            bgimg: ''
        };
        if(typeof options === "object"){
            $.extend(defaultOptions, options);
        }
        this.options = defaultOptions;
        this.element = $el;

        this.init();
    }
    board.prototype.init = function(){
        var options = this.options;
        var stage = new PIXI.Stage(0xFFFFFF);
        var renderer = PIXI.autoDetectRenderer(options.width, options.height, null, false, false, true);
        renderer.view.style.display = "block";

        var $board = this.element;
        $board.append(renderer.view);

        this.pubEtc = {
            stage: stage,
            renderer: renderer
        };

        this.initBg();
    };

    board.prototype.initBg = function(){
        var options = this.options;
        var pubEtc = this.pubEtc;

        var loader = new PIXI.AssetLoader([ options.bgimg ]);
        loader.on('onComplete', function(){
            var bgcontainer = new PIXI.DisplayObjectContainer();
            pubEtc.stage.addChildAt(bgcontainer, 0);

            // './assets/image/bg.png'
            var texture = new PIXI.Texture.fromImage(options.bgimg);
            var bg = new PIXI.Sprite(texture);
            bgcontainer.addChild(bg);

            pubEtc.renderer.render(pubEtc.stage);
        });
        loader.load();
    };

    board.prototype.penInit = function(){
        this.pubEtc.pen = {};
        this.pubEtc.pen.control = {
            oldPoint : {},
            isDown: false,
            pencontainer: null,
            graphics: null,
            graphicsStep: 0,
            graphicsDatastep: 0
        };
    };
    board.prototype.pendraw = function(drawData){
        var pubEtc = this.pubEtc;
        var control = pubEtc.pen.control;
        if(!control.pencontainer){
            control.pencontainer = new PIXI.DisplayObjectContainer();
            pubEtc.stage.addChildAt(control.pencontainer, pubEtc.stage.children.length);
            control.graphics = new PIXI.Graphics();
            control.pencontainer.addChild(control.graphics);
            control.graphics.lineStyle(2, 0xFF0000, 1);
        }else{
            if(control.graphicsStep == 1000){
                control.pencontainersds = new PIXI.DisplayObjectContainer();
                pubEtc.stage.addChildAt(control.pencontainer, pubEtc.stage.children.length);
                control.graphicsStep = 0;
            }
            if(control.graphicsDatastep == 1000){
                var test = new PIXI.Graphics();
                control.graphics = test;
                control.pencontainer.addChild(control.graphics);
                control.graphics.lineStyle(2, 0xFF0000, 1);
                control.graphicsDatastep = 0;
                control.graphicsStep += 1;
            }
        }

        switch (drawData.event){
            case "down":
                control.graphics.moveTo(drawData.offsetX, drawData.offsetY);
                control.oldPoint = drawData;
                break;
            case "move":
                control.graphics.lineTo(drawData.offsetX , drawData.offsetY);

                pubEtc.renderer.render(pubEtc.stage);
                control.graphics.moveTo(control.oldPoint.offsetX, control.oldPoint.offsetY);
                control.graphicsDatastep += 1;
                control.oldPoint = drawData;
                break;
            case "up":
                control.oldPoint = {};
                break;
        }

        this.sendMessage(drawData);
    };
    board.prototype.penInitEvent = function(){
        var $board = this.element;
        var pubEtc = this.pubEtc;
        var control = pubEtc.pen.control;
        var self = this;
        $board.off(".board");
        $board.on('mousedown.pen.board touchstart.pen.board', function(e){
            control.isDown = true;
            var drawData = {
                type: "pen",
                event: "down",
                offsetX : e.offsetX,
                offsetY : e.offsetY
            };
            self.pendraw(drawData);
        });
        $board.on('mousemove.pen.board touchmove.pen.board', function(e){
            if(!control.isDown){
                return false;
            }
            var drawData = {
                type: "pen",
                event: "move",
                offsetX : e.offsetX,
                offsetY : e.offsetY
            };
            self.pendraw(drawData);
        });
        $board.on('mouseup.pen.board mouseout.pen.board touchend.pen.board touchcancel.pen.board', function(e){
            control.isDown = false;
            var drawData = {
                type: "pan",
                event: "up",
                offsetX : e.offsetX,
                offsetY : e.offsetY
            };
            self.pendraw(drawData);
        });
    };

    board.prototype.initEraser = function(){
        var baseTexture = new PIXI.BaseTexture.fromImage('./assets/image/bg.png');

        this.pubEtc.eraser = {};
        this.pubEtc.eraser.control = {
            oldPoint : {},
            isDown: false,
            eraserContainer: null,
            eraserContainerStep: 0,
            bgBaseTexture: baseTexture
        }
    };
    board.prototype.eraserdraw = function(drawData){
        var pubEtc = this.pubEtc;
        var control = pubEtc.eraser.control;
        if(!control.eraserContainer){
            control.eraserContainer = new PIXI.DisplayObjectContainer();
            pubEtc.stage.addChildAt(control.eraserContainer, pubEtc.stage.children.length);
        }else{
            if(control.eraserContainerStep == 1000){
                control.pencontainersds = new PIXI.DisplayObjectContainer();
                pubEtc.stage.addChildAt(control.eraserContainer, pubEtc.stage.children.length);
                control.eraserContainerStep = 0;
            }
        }

        switch (drawData.event){
            case "down":
                control.oldPoint = drawData;
                break;
            case "move":
                var bgTexture = new PIXI.Texture(control.bgBaseTexture,
                    new PIXI.Rectangle(drawData.offsetX , drawData.offsetY, 30, 30));
                var eraser = new PIXI.Sprite(bgTexture);
                eraser.position.x = drawData.offsetX;
                eraser.position.y = drawData.offsetY;
                control.eraserContainer.addChild(eraser);
                control.erasercontainerStep += 1;
                pubEtc.renderer.render(pubEtc.stage);

                control.oldPoint = drawData;
                break;
            case "up":
                control.oldPoint = {};
                break;
        }

        this.sendMessage(drawData);
    };
    board.prototype.eraserInitEvent = function(){
        var $board = this.element;
        var pubEtc = this.pubEtc;
        var control = pubEtc.eraser.control;
        var self = this;
        $board.off(".board");
        $board.on('mousedown.eraser.board touchstart.eraser.board', function(e){
            control.isDown = true;
            var drawData = {
                type: "eraser",
                event: "down",
                offsetX : e.offsetX,
                offsetY : e.offsetY
            };
            self.eraserdraw(drawData);
        });
        $board.on('mousemove.eraser.board touchmove.eraser.board', function(e){
            if(!control.isDown){
                return false;
            }
            var drawData = {
                type: "eraser",
                event: "move",
                offsetX : e.offsetX,
                offsetY : e.offsetY
            };
            self.eraserdraw(drawData);
        });
        $board.on('mouseup.eraser.board mouseout.eraser.board touchend.eraser.board touchcancel.eraser.board', function(e){
            control.isDown = false;
            var drawData = {
                type: "eraser",
                event: "up",
                offsetX : e.offsetX,
                offsetY : e.offsetY
            };
            self.eraserdraw(drawData);
        });
    };
    board.prototype.sendMessage = function(data){

    };
    board.prototype.onMessage = function(data){

    };

})(window.jQuery);
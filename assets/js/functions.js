(function($){
	(function(factory) {
		if (typeof define === 'function' && define.amd) {
			define(['jquery', 'hammerjs'], factory);
		} else if (typeof exports === 'object') {
			factory(require('jquery'), require('hammerjs'));
		} else {
			factory(jQuery, Hammer);
		}
	}(function($, Hammer) {
		function hammerify(el, options) {
			var $el = $(el);
			if(!$el.data("hammer")) {
				$el.data("hammer", new Hammer($el[0], options));
			}
		}

		$.fn.hammer = function(options) {
			return this.each(function() {
				hammerify(this, options);
			});
		};

		Hammer.Manager.prototype.emit = (function(originalEmit) {
			return function(type, data) {
				originalEmit.call(this, type, data);
				$(this.element).trigger({
					type: type,
					gesture: data
				});
			};
		})(Hammer.Manager.prototype.emit);
	}));
	$(document).ready(function (){
		var canvasEl = [];
		var ctx = [];
		var boardOptions = {
			width: 500,
			height: 400
		};
		$board = $("#board");
		$boardText = $("#boardText");
		canvasEl[0] = $('<canvas></canvas>').appendTo($board).get(0);
		canvasEl[1] = $('<canvas></canvas>').appendTo($board).get(0);
		for(var key in canvasEl){
			var el = canvasEl[key];
			el.width = boardOptions.width;
			el.height = boardOptions.height;
			ctx[key] = el.getContext("2d");
		}

		function eraser(){
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
				render(ctx[0], P);
				//console.log(e);
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
				render(ctx[0], P);
				//console.log(e);
			});
			$board.on('mouseup.eraser.board mouseout.eraser.board touchend.eraser.board touchcancel.eraser.board', function(e){
				boardControl.isDown = false;
				var P = {
					type: "up",
					offsetX : e.offsetX,
					offsetY : e.offsetY
				};
				render(ctx[0], P);
				//console.log(e);
			});
			function render(ctx, P) {
				switch (P.type){
					case "down":
						boardControl.olddian = P;
						break;
					case "move":
						ctx.clearRect(P.offsetX, P.offsetY, 30, 30);
						boardControl.olddian = P;
						break;
					case "up":
						boardControl.olddian = {};
						break;
				}
			}
		}
		function pan(){
			var boardControl = {
				olddian: {},
				isDown: false
			};
			$board.off(".board");
			$board.on('mousedown.pan.board touchstart.pan.board', function(e){
				boardControl.isDown = true;
				var P = {
					type: "down",
					offsetX : e.offsetX,
					offsetY : e.offsetY
				};
				render(ctx[0], P);
				//console.log(e);
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
				render(ctx[0], P);
				//console.log(e);
			});
			$board.on('mouseup.pan.board mouseout.pan.board touchend.pan.board touchcancel.pan.board', function(e){
				boardControl.isDown = false;
				var P = {
					type: "up",
					offsetX : e.offsetX,
					offsetY : e.offsetY
				};
				render(ctx[0], P);
				//console.log(e);
			});
			function render(ctx, P) {
				switch (P.type){
					case "down":
						ctx.beginPath();
						boardControl.olddian = P;
						break;
					case "move":
						ctx.moveTo(boardControl.olddian.offsetX, boardControl.olddian.offsetY);
						ctx.lineTo(P.offsetX, P.offsetY);
						ctx.stroke();
						boardControl.olddian = P;
						break;
					case "up":
						ctx.closePath();
						boardControl.olddian = {};
						break;
				}
			}
		}
		function text(){
			var um = UM.getEditor('myEditor');
			um.addListener( 'ready', function( editor ) {
			});
			var img = new Image();
			um.addListener( 'selectionchange', function( editor ) {
				html2canvas($('#myEditor').get(0), {
					onrendered: function(canvas) {
						var base64Img = canvas.toDataURL();
						img.src = base64Img;
						img.onload = function(){
							ctx[0].drawImage(img, 0, 0);
						};
					}
				});

			});
			var boardControl = {
				olddian: {},
				isDown: false
			};
			$board.off(".board");
			$board.on('mousedown.text.board touchstart.text.board', function(e){
				boardControl.isDown = true;
				var P = {
					type: "down",
					offsetX : e.offsetX,
					offsetY : e.offsetY
				};
				render(ctx[0], P);
				//console.log(e);
			});
			$board.on('mousemove.text.board touchmove.text.board', function(e){
				if(!boardControl.isDown){
					return false;
				}
				var P = {
					type: "move",
					offsetX : e.offsetX,
					offsetY : e.offsetY
				};
				render(ctx[0], P);
				//console.log(e);
			});
			$board.on('mouseup.text.board mouseout.text.board touchend.text.board touchcancel.text.board', function(e){
				boardControl.isDown = false;
				var P = {
					type: "up",
					offsetX : e.offsetX,
					offsetY : e.offsetY
				};
				render(ctx[0], P);
				//console.log(e);
			});
			function render(ctx, P) {
				switch (P.type){
					case "down":
						boardControl.olddian = P;
						$boardText.css({
							top: P.offsetY,
							left: P.offsetX
						});
						break;
					case "move":
						$boardText.css({
							width: P.offsetX - boardControl.olddian.offsetX + 'px',
							height: P.offsetY - boardControl.olddian.offsetY + 'px'
						});
						break;
					case "up":

						boardControl.olddian = {};
						break;
				}
			}
		}
		text();
		window.myBoard = {
			pan: pan,
			eraser: eraser,
			text:text
		};
		/*

		*/
	});
})(window.jQuery);
/**
 * Created by Administrator on 2014/10/28.
 */
var canvasImg = PIXI.Texture.fromCanvas($('#board').find('canvas').get(0));
var newbg = new PIXI.Sprite(canvasImg);
stage.addChildAt(newbg, stage.children.length);
renderer.render(stage);

stage.removeChildren(0, stage.children.length-1);
renderer.render(stage);
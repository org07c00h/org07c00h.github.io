document.addEventListener("DOMContentLoaded", () => {
    var app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x2c3e50
    });
    document.body.appendChild(app.view);

    app.loader.add('magnetic', '/7/Magnetic Wild.json')
        .load(startup);

    function startup()
    {
        var animation = new PIXI.spine.Spine(app.loader.resources["magnetic"].spineData);
        animation.position.set(app.renderer.width / 2, app.renderer.height / 2);
        app.stage.addChild(animation);
        if (animation.state.hasAnimation('5')) {
            animation.state.setAnimation(0, '5', true);
        }
    }
});
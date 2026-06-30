

Cesium.Material._materialCache.addMaterial('PolylineTrailLink', {
    fabric: {
        type: 'PolylineTrailLink',
        uniforms: {

            color: new Cesium.Color.fromCssColorString('#F3D03E'),
            speed: 12
        },

        source: 'czm_material czm_getMaterial(czm_materialInput materialInput) {' +

            'czm_material material = czm_getDefaultMaterial(materialInput);' +

            'vec2 st = materialInput.st;' +

            'float t = czm_frameNumber * speed / 2000.0;' +

            'float pos = fract(t - st.s);' +

            'float light = exp(-pow((pos - 0.5) / 0.2, 2.0));' +

            'material.diffuse = color.rgb * (0.35 + light * 0.65);' +

            'material.alpha = 0.25 + light * 0.75;' +

            'material.emission = color.rgb * light * 1.5;' +
            'return material;' +
            '}'
    }
});

function PolylineTrailLinkMaterialProperty(color, speed) {

    this._color = Cesium.Color.clone(color);

    this._speed = speed || 120;

    this._definitionChanged = new Cesium.Event();

    this._material = undefined;
}

Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {

    isConstant: { get: function() { return false; } },

    definitionChanged: { get: function() { return this._definitionChanged; } }
});

PolylineTrailLinkMaterialProperty.prototype.getType = function() { return 'PolylineTrailLink'; };

PolylineTrailLinkMaterialProperty.prototype.getValue = function(time, result) {

    if (!Cesium.defined(this._material)) {

        var mat = Cesium.Material.fromType('PolylineTrailLink');

        mat.uniforms.color = this._color;
        mat.uniforms.speed = this._speed;

        this._material = mat;
    }
    return this._material;
};

PolylineTrailLinkMaterialProperty.prototype.equals = function(other) { return false; };


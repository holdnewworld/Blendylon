/// <reference path="../../../dist/preview release/babylon.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BABYLON;
(function (BABYLON) {
    var GRIDMaterialDefines = (function (_super) {
        __extends(GRIDMaterialDefines, _super);
        function GRIDMaterialDefines() {
            var _this = _super.call(this) || this;
            _this.TRANSPARENT = false;
            _this.FOG = false;
            _this._keys = Object.keys(_this);
            return _this;
        }
        return GRIDMaterialDefines;
    }(BABYLON.MaterialDefines));
    /**
     * The grid materials allows you to wrap any shape with a grid.
     * Colors are customizable.
     */
    var GridMaterial = (function (_super) {
        __extends(GridMaterial, _super);
        /**
         * constructor
         * @param name The name given to the material in order to identify it afterwards.
         * @param scene The scene the material is used in.
         */
        function GridMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            /**
             * Main color of the grid (e.g. between lines)
             */
            _this.mainColor = BABYLON.Color3.White();
            /**
             * Color of the grid lines.
             */
            _this.lineColor = BABYLON.Color3.Black();
            /**
             * The scale of the grid compared to unit.
             */
            _this.gridRatio = 1.0;
            /**
             * The frequency of thicker lines.
             */
            _this.majorUnitFrequency = 10;
            /**
             * The visibility of minor units in the grid.
             */
            _this.minorUnitVisibility = 0.33;
            /**
             * The grid opacity outside of the lines.
             */
            _this.opacity = 1.0;
            _this._gridControl = new BABYLON.Vector4(_this.gridRatio, _this.majorUnitFrequency, _this.minorUnitVisibility, _this.opacity);
            _this._defines = new GRIDMaterialDefines();
            _this._cachedDefines = new GRIDMaterialDefines();
            return _this;
        }
        /**
         * Returns wehter or not the grid requires alpha blending.
         */
        GridMaterial.prototype.needAlphaBlending = function () {
            return this.opacity < 1.0;
        };
        GridMaterial.prototype._checkCache = function (scene, mesh, useInstances) {
            if (!mesh) {
                return true;
            }
            if (mesh._materialDefines && mesh._materialDefines.isEqual(this._defines)) {
                return true;
            }
            return false;
        };
        GridMaterial.prototype.isReady = function (mesh, useInstances) {
            if (this.checkReadyOnlyOnce) {
                if (this._wasPreviouslyReady) {
                    return true;
                }
            }
            var scene = this.getScene();
            if (!this.checkReadyOnEveryCall) {
                if (this._renderId === scene.getRenderId()) {
                    if (this._checkCache(scene, mesh, useInstances)) {
                        return true;
                    }
                }
            }
            var engine = scene.getEngine();
            var needNormals = true;
            this._defines.reset();
            if (this.opacity < 1.0) {
                this._defines.TRANSPARENT = true;
            }
            // Fog
            if (scene.fogEnabled && mesh && mesh.applyFog && scene.fogMode !== BABYLON.Scene.FOGMODE_NONE && this.fogEnabled) {
                this._defines.FOG = true;
            }
            // Get correct effect      
            if (!this._effect || !this._defines.isEqual(this._cachedDefines)) {
                this._defines.cloneTo(this._cachedDefines);
                scene.resetCachedMaterial();
                // Attributes
                var attribs = [BABYLON.VertexBuffer.PositionKind, BABYLON.VertexBuffer.NormalKind];
                // Effect
                var shaderName = scene.getEngine().getCaps().standardDerivatives ? "grid" : "legacygrid";
                // Defines
                var join = this._defines.toString();
                this._effect = scene.getEngine().createEffect(shaderName, attribs, ["worldViewProjection", "mainColor", "lineColor", "gridControl", "vFogInfos", "vFogColor", "world", "view"], [], join, null, this.onCompiled, this.onError);
            }
            if (!this._effect.isReady()) {
                return false;
            }
            this._renderId = scene.getRenderId();
            this._wasPreviouslyReady = true;
            return true;
        };
        GridMaterial.prototype.bindOnlyWorldMatrix = function (world) {
            var scene = this.getScene();
            this._effect.setMatrix("worldViewProjection", world.multiply(scene.getTransformMatrix()));
            this._effect.setMatrix("world", world);
            this._effect.setMatrix("view", scene.getViewMatrix());
        };
        GridMaterial.prototype.bind = function (world, mesh) {
            var scene = this.getScene();
            // Matrices
            this.bindOnlyWorldMatrix(world);
            // Uniforms
            if (scene.getCachedMaterial() !== this) {
                this._effect.setColor3("mainColor", this.mainColor);
                this._effect.setColor3("lineColor", this.lineColor);
                this._gridControl.x = this.gridRatio;
                this._gridControl.y = Math.round(this.majorUnitFrequency);
                this._gridControl.z = this.minorUnitVisibility;
                this._gridControl.w = this.opacity;
                this._effect.setVector4("gridControl", this._gridControl);
            }
            // View
            if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
                this._effect.setMatrix("view", scene.getViewMatrix());
            }
            // Fog
            BABYLON.MaterialHelper.BindFogParameters(scene, mesh, this._effect);
            _super.prototype.bind.call(this, world, mesh);
        };
        GridMaterial.prototype.dispose = function (forceDisposeEffect) {
            _super.prototype.dispose.call(this, forceDisposeEffect);
        };
        GridMaterial.prototype.clone = function (name) {
            var _this = this;
            return BABYLON.SerializationHelper.Clone(function () { return new GridMaterial(name, _this.getScene()); }, this);
        };
        GridMaterial.prototype.serialize = function () {
            var serializationObject = BABYLON.SerializationHelper.Serialize(this);
            serializationObject.customType = "BABYLON.GridMaterial";
            return serializationObject;
        };
        GridMaterial.Parse = function (source, scene, rootUrl) {
            return BABYLON.SerializationHelper.Parse(function () { return new GridMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        return GridMaterial;
    }(BABYLON.Material));
    __decorate([
        BABYLON.serializeAsColor3()
    ], GridMaterial.prototype, "mainColor", void 0);
    __decorate([
        BABYLON.serializeAsColor3()
    ], GridMaterial.prototype, "lineColor", void 0);
    __decorate([
        BABYLON.serialize()
    ], GridMaterial.prototype, "gridRatio", void 0);
    __decorate([
        BABYLON.serialize()
    ], GridMaterial.prototype, "majorUnitFrequency", void 0);
    __decorate([
        BABYLON.serialize()
    ], GridMaterial.prototype, "minorUnitVisibility", void 0);
    __decorate([
        BABYLON.serialize()
    ], GridMaterial.prototype, "opacity", void 0);
    BABYLON.GridMaterial = GridMaterial;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.gridmaterial.js.map

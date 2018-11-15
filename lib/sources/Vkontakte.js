'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var VkontakteSource =
/*#__PURE__*/
function () {
  function VkontakteSource(props) {
    var _this = this;

    _classCallCheck(this, VkontakteSource);

    _defineProperty(this, "props", null);

    _defineProperty(this, "isCompatible", function () {
      return !!_this.props.vkontakteId;
    });

    _defineProperty(this, "get", function (setState) {
      var vkontakteId = _this.props.vkontakteId;

      var size = _this.getImageSize();

      var url = "https://api.vk.com/method/users.get?user_id=".concat(vkontakteId, "&v=5.8&fields=").concat(size);

      var onError = function onError() {
        return setState(null);
      };

      (0, _utils.fetchJSONP)(url, function (data) {
        var src = data && data.response && data.response[0];
        if (!src) return onError();
        setState({
          sourceName: 'vkontakte',
          src: src
        });
      }, onError);
    });

    this.props = props;
  }

  _createClass(VkontakteSource, [{
    key: "getImageSize",
    value: function getImageSize() {
      var size = this.props.size;
      if (size <= 50) return 'photo_50';
      if (size <= 100) return 'photo_100';
      if (size <= 200) return 'photo_200';
      return 'photo_max';
    }
  }]);

  return VkontakteSource;
}();

exports.default = VkontakteSource;

_defineProperty(VkontakteSource, "propTypes", {
  vkontakteId: _propTypes.default.string
});
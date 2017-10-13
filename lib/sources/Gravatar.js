'use strict';

// import retina from 'is-retina';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const IS_RETINA = retina();

var GravatarSource = function GravatarSource(props) {
    (0, _classCallCheck3.default)(this, GravatarSource);

    _initialiseProps.call(this);

    this.props = props;
};

var _initialiseProps = function _initialiseProps() {
    var _this = this;

    this.props = null;

    this.isCompatible = function () {
        return !!_this.props.email || !!_this.props.md5Email;
    };

    this.get = function (setState) {
        var props = _this.props;

        var email = props.md5Email || (0, _md2.default)(props.email);
        // const size = IS_RETINA ? props.size * 2 : props.size;
        var size = props.size * 2;
        var url = 'https://secure.gravatar.com/avatar/' + email + '?s=' + size + '&d=404';

        setState({ src: url });
    };
};

exports.default = GravatarSource;
module.exports = exports['default'];
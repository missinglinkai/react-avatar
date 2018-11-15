'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {withConfig, ConfigProvider} from './context';
import {getRandomColor, parseSize} from './utils';
import InternalState from './internal-state';

import gravatarSource from './sources/Gravatar';
import facebookSource from './sources/Facebook';
import vkontakteSource from './sources/Vkontakte';
import twitterSource from './sources/Twitter';
import googleSource from './sources/Google';
import skypeSource from './sources/Skype';
import valueSource from './sources/Value';
import srcSource from './sources/Src';
import iconSource from './sources/Icon';
import redirectSource from './sources/AvatarRedirect';

const SOURCES = [
    facebookSource,
    googleSource,
    twitterSource,
    redirectSource('twitter', 'twitterHandle'),
    redirectSource('instagram', 'instagramId'),
    vkontakteSource,
    skypeSource,
    gravatarSource,
    srcSource,
    valueSource,
    iconSource
];

// Collect propTypes for each individual source
const sourcePropTypes = SOURCES.reduce((r, s) => Object.assign(r, s.propTypes), {});

export {getRandomColor} from './utils';
export {ConfigProvider} from './context';

function matchSource(Source, props, cb) {
    const { cache } = props;
    const instance = new Source(props);

    if(!instance.isCompatible(props))
        return cb();

    instance.get((state) => {
        const failedBefore = state &&
            state.hasOwnProperty('src') &&
            cache.hasSourceFailedBefore(state.src);

        if(!failedBefore && state) {
            cb(state);
        } else {
            cb();
        }
    });
}

export
class Avatar extends PureComponent {

    static displayName = 'Avatar'

    static propTypes = {
        // PropTypes defined on sources
        ...sourcePropTypes,

        className: PropTypes.string,
        fgColor: PropTypes.string,
        color: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        email: PropTypes.string,
        md5Email: PropTypes.string,
        src: PropTypes.string,
        srcSet: PropTypes.string,
        facebookId: PropTypes.string,
        googleId: PropTypes.string,
        twitterHandle: PropTypes.string,
        vkontakteId: PropTypes.string,
        skypeId: PropTypes.string,
        colors: PropTypes.arrayOf(PropTypes.string),
        round: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string
        ]),
        style: PropTypes.object,
        size: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        textSizeRatio: PropTypes.number,
        unstyled: PropTypes.bool,
        cache: PropTypes.object,
        onClick: PropTypes.func

    }

    static defaultProps = {
        className: 'sb-avatar',
        innerClassName:'',
        fgColor: '#FFF',
        round: false,
        size: 100,
        textSizeRatio: 3,
        unstyled: false
    }

    constructor(props) {
        super(props);

        this.state = {
            src: null,
            srcSet: null,
            internal: null,
            value: null,
            color: props.color
        };
    }

    componentDidMount() {
        this.fetch();
    }

    componentWillReceiveProps(newProps) {
        let needsUpdate = false;

        // This seems redundant
        //
        // Props that need to be in `state` are
        // `value`, `src` and `color`
        for (const prop in sourcePropTypes)
            needsUpdate = needsUpdate || (newProps[prop] !== this.props[prop]);

        // if ((newProps.srcSet !== this.props.srcSet) || (newProps.name !== this.props.name)) {
        //     needsUpdate = true
        // }

        if (needsUpdate)
            setTimeout(this.fetch, 0);
    }

    componentWillUnmount() {
        if (this.state.internal) {
            this.state.internal.active = false;
        }
    }

    static getRandomColor = getRandomColor
    static ConfigProvider = ConfigProvider

    _createFetcher = (internal) => (errEvent) => {
        const { cache } = this.props;

        if (!internal.isActive(this.state))
            return;

        // Mark img source as failed for future reference
        if( errEvent && errEvent.type === 'error' )
            cache.sourceFailed(errEvent.target.src);

        const pointer = internal.sourcePointer;
        if(SOURCES.length === pointer)
            return;

        const source = SOURCES[pointer];

        internal.sourcePointer++;

        matchSource(source, this.props, (nextState) => {
            if (!nextState)
                return setTimeout(internal.fetch, 0);

            if (!internal.isActive(this.state))
                return;

            // Reset other values to prevent them from sticking (#51)
            nextState = {
                src: null,
                value: null,
                color: null,
                name: null,
                srcSet: null,

                ...nextState
            };

            this.setState(state => {
                // Internal state has been reset => we received new props
                return internal.isActive(state) ? nextState : {};
            });
        });
    }

    fetch = () => {
        const internal = new InternalState();
        internal.fetch = this._createFetcher(internal);

        this.setState({ internal }, internal.fetch);
    };

    _scaleTextNode = (node) => {
        const { unstyled, textSizeRatio } = this.props;

        if (!node || unstyled) return;


        const parent = node.parentNode;

        // Reset font-size such that scaling works correctly (#133)
        parent.style.fontSize = null;

        const textWidth = node.getBoundingClientRect().width;
        if (textWidth < 0)
            return;

        const containerWidth = parent.getBoundingClientRect().width;
        const ratio = containerWidth / textWidth;

        // Set font-size on parent span, otherwise the `table-cell` span
        // will cause alignment issues.
        parent.style.fontSize = `calc((100% * ${ratio}) / ${textSizeRatio})`;
    }

    _renderAsImage() {
        const { className, round, unstyled, name, value } = this.props;
        const { internal } = this.state;
        const size = parseSize(this.props.size);
        const alt = name || value;

        const imageStyle = unstyled ? null : {
            maxWidth: '100%',
            width: size.str,
            height: size.str,
            borderRadius: (round === true ? '100%' : round)
        };

        return (
            <img className={className + ' sb-avatar__image'}
                width={size.str}
                height={size.str}
                style={imageStyle}
                src={this.state.src}
                srcSet={this.state.srcSet}
                alt={alt}
                onError={internal && internal.fetch} />
        );
    }

    _renderAsText() {
        const { className, round, unstyled } = this.props;
        const size = parseSize(this.props.size);

        const initialsStyle = unstyled ? null : {
            width: size.str,
            height: size.str,
            lineHeight: 'initial',
            textAlign: 'center',
            textTransform: 'uppercase',
            color: this.props.fgColor,
            background: this.state.color,
            borderRadius: (round === true ? '100%' : round)
        };

        const tableStyle = unstyled ? null : {
            display: 'table',
            width: '100%',
            height: '100%'
        };

        const spanStyle = unstyled ? null : {
            display: 'table-cell',
            verticalAlign: 'middle'
        };

        return (
            <div className={className + ' sb-avatar__text'}
                style={initialsStyle}>
                <div style={tableStyle}>
                    <span style={spanStyle}>
                        <span ref={this._scaleTextNode} key={this.state.value}>
                            {this.state.value}
                        </span>
                    </span>
                </div>
            </div>
        );
    }

    render() {
        const { className, unstyled, round, style, onClick } = this.props;
        const { src, sourceName } = this.state;
        const size = parseSize(this.props.size);

        const hostStyle = unstyled ? null : {
            display: 'inline-block',
            verticalAlign: 'middle',
            width: size.str,
            height: size.str,
            borderRadius: (round === true ? '100%' : round),
            fontFamily: 'Helvetica, Arial, sans-serif',
            ...style
        };

        const classNames = [ className, 'sb-avatar' ];

        if (sourceName) {
            const source = sourceName.toLowerCase()
                .replace(/[^a-z0-9-]+/g, '-') // only allow alphanumeric
                .replace(/^-+|-+$/g, ''); // trim `-`
            classNames.push('sb-avatar--' + source);
        }

        return (
            <div className={classNames.join(' ')}
                onClick={onClick}
                style={hostStyle}>
                {src ? this._renderAsImage() : this._renderAsText()}
            </div>
        );
    }
}

export default Object.assign(withConfig(Avatar), {
    getRandomColor,
    ConfigProvider
});

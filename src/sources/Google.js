'use strict';

import PropTypes from 'prop-types';
import {fetch} from '../utils';

export default
class GoogleSource {

    static propTypes = {
        googleId: PropTypes.string
    }

    props = null;

    constructor(props) {
        this.props = props;
    }

    isCompatible = () => !!this.props.googleId

    get = (setState) => {
        const { cache, size, googleId } = this.props;
        const url = `https://picasaweb.google.com/data/entry/api/user/${googleId}?alt=json`;

        if (cache.hasSourceFailedBefore(url)) {
            setState(null);
            return;
        }

        fetch(url, (data) => {
            const src = data.entry.gphoto$thumbnail.$t;
            const srcWithCorrectSize = src.replace('s64', 's' + size);
            const srcWithCorrectRetinaSize = src.replace('s64', 's' + size*2);
            setState({
                sourceName: 'google',
                src: srcWithCorrectSize,
                srcSet: srcWithCorrectRetinaSize
            });
        }, () => {
            // on error
            cache.sourceFailed(url);
            setState(null);
        });
    }
}

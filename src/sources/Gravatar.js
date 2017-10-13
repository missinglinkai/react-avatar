'use strict';

import md5 from 'md5';

export default
class GravatarSource {

    props = null;

    constructor(props) {
        this.props = props;
    }

    isCompatible = () => {
        return !!this.props.email || !!this.props.md5Email;
    }

    get = (setState) => {
        const { props } = this;
        const email = props.md5Email || md5(props.email);
        const size = props.size;
        const url = `https://secure.gravatar.com/avatar/${email}?s=${size}&d=404`;
        const setUrl = `https://secure.gravatar.com/avatar/${email}?s=${size * 2}&d=404`;

        setState({src: url, srcSet:setUrl});
    }
}

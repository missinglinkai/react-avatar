'use strict';

export default
class FacebookSource {

    props = null;

    constructor(props) {
        this.props = props;
    }

    isCompatible = () => !!this.props.facebookId

    get = (setState) => {
        const { size, facebookId } = this.props;
        const url = 'https://graph.facebook.com/' +
            `${facebookId}/picture?width=${size}&height=${size}`;
        const retinaUrl = 'https://graph.facebook.com/' +
            `${facebookId}/picture?width=${size}&height=${size*2}`;

        setState({src: url, srcSet:retinaUrl});
    }
}

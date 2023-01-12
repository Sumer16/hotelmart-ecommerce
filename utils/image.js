import ImageUrlBuilder from '@sanity/image-url';

import client from './client';

function urlForThumbnail(src) {
    return ImageUrlBuilder(client).image(src).width(300).url(); // From Sanity for image url
}

export { urlForThumbnail };
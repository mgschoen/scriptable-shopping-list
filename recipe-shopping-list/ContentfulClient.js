const { presentAlert } = importModule('Utils');

/**
 * Contentful Content Delivery API: https://www.contentful.com/developers/docs/references/content-delivery-api/
 */

module.exports = class ContentfulClient {
    constructor(options) {
        if (!options.accessToken) {
            presentAlert('Could not initialize ContentfulClient: missing option "accessToken"');
            return;
        }
        if (!options.spaceId) {
            presentAlert('Could not initialize ContentfulClient: missing option "spaceId"');
            return;
        }
        this.accessToken = options.accessToken;
        this.spaceId = options.spaceId;
        this.environment = options.environment ||  'master';
        this.baseUrl = `http://cdn.contentful.com/spaces/${this.spaceId}/environments/${this.environment}`;

    }

    async fetchEntries(contentType, parameters) {
        // assemble url
        let requestUrl = `${this.baseUrl}/entries?access_token=${this.accessToken}`;
        if (contentType) {
            requestUrl += `&content_type=${contentType}`;
        }
        if (parameters && typeof parameters === 'object') {
            for (let param in parameters) {
                requestUrl += `&${param}=${parameters[param]}`;
            }
        }

        // send request
        let entries = [];
        const request = new Request(requestUrl);
        try {
            const apiResponse = await request.loadJSON();
            entries = apiResponse.items.map(item => {
                const entry = item.fields;
                entry._id = item.sys.id;
                return entry;
            });
        } catch (error) {
            presentAlert('Shoot!', 'Error while requesting entries from the database');
        }
        return entries;
    }
}
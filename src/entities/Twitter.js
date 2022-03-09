const TwitAPI = require('twit');

class Twitter {
    /**
     * Twitter API wrapper
     * @param {Object} tokens the tokens to use for the API
     */
    constructor(tokens) {
        this.client = new TwitAPI(tokens);
    }

    /**
     * Returns the actual user data
     * @returns {Object}
     */
    async getUser() {
        return new Promise((resolve, reject) => {
            this.client.get('account/verify_credentials', (err, data, response) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }

    /**
     * Tweets a message and returns the tweet URL
     * @param {string} message The message to tweet
     */
    tweet(message) {
        this.client.post('statuses/update', {status: message}, function(error, tweet, response) {
            if (!error) {
                console.log(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
            } else {
                throw error;
            }
        });
    }

    /**
     * Tweets a message with a image and returns the tweet URL
     * @param {string} imageLocation The location of the image to upload
     * @param {string} message The message to tweet
     */
    async postImage(imageBase64, message = "") {
        const client = this.client;
        // Make post request on media endpoint. Pass file data as media parameter
        client.post('media/upload', {media_data: imageBase64}, function(error, media, response) {
            if (!error) {
                // Lets tweet it
                const status = {
                    status: message,
                    media_ids: media.media_id_string // Pass the media id string
                }

                client.post('statuses/update', status, function(error, tweet, response) {
                    if (!error) {
                        console.log(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
                    } else {
                        throw error;
                    }
                });
            } else {
                throw error;
            }
        })
    }
}

module.exports = Twitter;
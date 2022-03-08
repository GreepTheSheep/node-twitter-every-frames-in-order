const Twitter = require('./Twitter');
const tokens = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}
const twt = new Twitter(tokens);
const fs = require('fs');
const download = require('download');
const StreamZip = require('node-stream-zip');

class Images {
    constructor() {
        this.imagesData = require('../../images.json');
        this.actualVideo = null;
        this.actualFrame = null;
        this.totalFrames = 0;
        this.dataFile = './cache/actual.json';
        this.executeIntervalProc = null;
        this.dataRecovered = false;
        this.recoverDataIfPossible();
    }

    /**
     * Recovers the data if scipt crashed
     */
    recoverDataIfPossible() {
        if (fs.existsSync(this.dataFile)) {
            let actualData = JSON.parse(fs.readFileSync(this.dataFile));
            this.actualVideo = actualData.actualVideo;
            this.actualFrame = actualData.actualFrame;
            this.dataRecovered = true;
            console.log("Recovered data. Actual video: " + this.actualVideo + " Actual frame: " + this.actualFrame);
        } else this.dataRecovered = true;
    }

    /**
     * Save the actual data
     */
    saveData() {
        let actualData = {
            actualVideo: this.actualVideo,
            actualFrame: this.actualFrame
        }
        fs.writeFileSync(this.dataFile, JSON.stringify(actualData));
        console.log("Saved data. Actual video: " + this.actualVideo + " Actual frame: " + this.actualFrame);
    }

    /**
     * Returns the JSON of the actual state
     * @returns {Object}
     */
    getActual() {
        if (this.actualVideo == null) return {
            identifier: null,
            name: null,
            frame: null,
            totalFrames: null
        }

        const actualVid = this.imagesData.find(i=>i.identifier == this.actualVideo);
        return {
            identifier: actualVid.identifier,
            name: actualVid.name,
            frame: this.actualFrame,
            totalFrames: this.totalFrames
        }
    }

    /**
     * Returns the JSON of all the videos in the images.json file
     * @returns {Object}
     */
    getAll() {
        return this.imagesData.map(i => {
            return {
                identifier: i.identifier,
                name: i.name,
            }
        });
    }

    async post(video = this.actualVideo, frame = this.actualFrame) {
        this.actualVideo = video;
        this.actualFrame = frame;

        if (this.actualVideo == null) this.actualVideo = this.imagesData[0].identifier;
        if (this.actualFrame == null) this.actualFrame = 1;

        const actualVid = this.imagesData.find(i=>i.identifier == this.actualVideo);

        if (!fs.existsSync('./cache/' + actualVid.identifier + '.zip')) {

            if (actualVid.zip_download_link.endsWith('dl=0')) actualVid.zip_download_link.replace('dl=0', 'dl=1');

            console.log("Downloading " + actualVid.identifier + ".zip");
            await download(actualVid.zip_download_link, './cache', { filename: actualVid.identifier + '.zip' });
            console.log("Downloaded " + actualVid.identifier + ".zip");
        }

        const zip = new StreamZip({
            file: './cache/' + actualVid.identifier + '.zip',
            skipEntryNameValidation: true,
            storeEntries: true
        });

        zip.on('ready', async () => {
            let entries = zip.entries();
            delete entries["/"];
            this.totalFrames = Object.keys(entries).length;
            let key = this.actualVideo + "-" + this.actualFrame + ".jpg";
            let file = entries[key];
            if (!file) {
                console.error("File not found: " + key);
                twt.tweet(`${actualVid.name} (${actualVid.identifier}) - ${this.actualFrame} out of ${this.totalFrames}\n\nError: Frame not found.`);
            } else {
                console.log("File found: " + key);
                const base64img = zip.entryDataSync(key).toString('base64');
                const message = `${actualVid.name} (${actualVid.identifier}) - Frame ${this.actualFrame} out of ${this.totalFrames}`;
                twt.postImage(base64img, message);
            }
            zip.close();
            this.actualFrame++;
            if (this.actualFrame > this.totalFrames) {
                this.actualFrame = 1;
                this.actualVideo = this.imagesData[this.imagesData.indexOf(actualVid) + 1].identifier;
                if (this.actualVideo == null) this.actualVideo = this.imagesData[0].identifier;
                fs.unlinkSync('./cache/' + actualVid.identifier + '.zip');
            }
            this.saveData();
        });

    }

    execute(interval = Number(process.env.DELAY_MIN)) {
        if (this.executeIntervalProc) clearInterval(this.executeIntervalProc);

        while (!this.dataRecovered) {
            console.log("Waiting for data recovery...");
        }

        console.log("Executing image tweet with an interval of " + interval + " minutes");
        this.executeIntervalProc = setInterval(()=>{
            console.log("Executing image tweet... Video: " + this.actualVideo + " Frame: " + this.actualFrame);
            this.post();
        }, interval * 60 * 1000);
    }
}

module.exports = Images;
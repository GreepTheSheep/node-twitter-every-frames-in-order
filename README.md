# Every frames in order Twitter Bot
 Twitter bot to post every Frames In Order

## Setup:

Start out by installing the dependencies: `npm i`

Copy the files:
- `.env.example` to `.env`
- `images.example.jsonc` to `images.json`

### Twitter Bot:

Create a Twitter Bot account, then request access to "Elevated" for access to the Twitter API v1.1 [here](https://developer.twitter.com/en/portal/products/elevated).

Then create your tokens [here](https://developer.twitter.com/en/apps), you'll need API keys and access tokens (with its secrets). Paste theres in the .env file

### Images/Frames:

The images are hosted in a .zip file, the best way is to store them in a cloud folder like Dropbox.

Create a folder named like the "identifier" field in the `images.json` file.

Convert your video to frames. The best way is to use ffmpeg.

`ffmpeg -i '.\video.mp4' -filter:v fps=3 -q:v 1 '.\ID\ID-%d.jpg'`

where ID is the identifier of the episode (the `-filter:v fps=3` is the number of frames per second, the best value to not have too many frames is 3, but you are free to set more/less. `-q:v 1` is the compression level, value are from 1 to 31, lower value = better quality).

(an other way is to use the powershell script in `script_convert.ps1`, details are on this file)

Then upload all the frames to the folder.

After that, you can get the .zip download link by sharing the folder in Dropbox, and putting the link in the `images.json` file.

## Running:

The best way to run a server-side script is to use pm2 `npm i -g pm2`. Then you can start with `pm2 start pm2.config.js`.

## API
This project serves with an API to send the actual state of frames.

The default port is `3000`, but you can change it in the `.env` file.

### Routes:

- GET /actual
- GET /all
- GET /user

Thoses routes has no parameters, feel free to check them out.

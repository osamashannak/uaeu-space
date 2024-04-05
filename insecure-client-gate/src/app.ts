import express from 'express';
import * as fs from "fs";
import cookies from "cookie-parser";
import * as zlib from "zlib";
import {setHeaders} from "./utils";

const app = express();

app.use(cookies());

app.use(function (req, res, next) {
    console.log("Connection Started!")
    setHeaders(res);
    console.log("Headers Set!")
    next();
});

app.get('*', function (req, res) {
    fs.readFile('./views/default.html', 'utf8', (err, text) => {
        const acceptEncoding = req.headers['accept-encoding'];

        if (!acceptEncoding || !acceptEncoding.toString().match(/\b(gzip)\b/)) {
            return res.send(text);
        }

        zlib.gzip(text, (err, buffer) => {
            if (err) {
                return res.send(text);
            }

            res.setHeader('Content-Encoding', 'gzip');

            res.send(buffer);
        });
    });


});

(async function initialize() {
    app.listen(3001);
    console.log('Client Gate is running on port 3001');
})()


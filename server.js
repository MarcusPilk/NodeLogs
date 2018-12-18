let express = require('express');
let app = new express();
const axios = require('axios');

const log4js = require('log4js');

log4js.configure(
    {
        appenders: {
            file: {
                type: 'file',
                filename: 'node-app.log',
                maxLogSize: 10 * 1024 * 1024, // = 10Mb
                backups: 2, // keep two backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: 0o0640,
                flags: 'w+'
            },
            dateFile: {
                type: 'dateFile',
                filename: 'node-app.log',
                pattern: 'yyyy-MM-dd-hh',
                compress: true
            },
            out: {
                type: 'stdout'
            }
        },
        categories: {
            default: { appenders: ['file', 'dateFile', 'out'], level: 'trace' }
        }
    }
);

const logger1 = log4js.getLogger("Node-App1");
const logger2 = log4js.getLogger("Node-App2");
const logger3 = log4js.getLogger("Node-App3");
const logger4 = log4js.getLogger("Node-App4");

async function randomLogger(){
    var loggers = [logger1,logger2,logger3,logger4];
    let randomIndex = Math.floor(Math.random() * 4);
    return loggers[randomIndex];
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

app.get('/', async (req,res) => {
    res.send('Loop Started');
    const urls = ['/trace','/debug','/info','/warn','/error','/fatal'];
    for (let i = 0; i < 100; i++) {
        let randomIndex = Math.floor(Math.random() * 6);
        await axios.get('http://localhost:3001' + urls[randomIndex])
            .then()
            .catch(async e => {
                logger1.error(e);
            });
        await sleep(1000);
    }
});

app.get('/trace',async (req,res) => {
    const log = await randomLogger();
    res.send(log.trace("Trace information message"))
});

app.get('/debug',async (req,res) =>{
    const log = await randomLogger();
    res.send(log.debug("Debug information message"))
});

app.get('/info',async (req,res) => {
    const log = await randomLogger();
    res.send(log.info("Info information message"))
});

app.get('/warn',async (req,res) =>{
    const log = await randomLogger();
    res.send(log.warn("Warn information message"))
});

app.get('/error',async (req,res) => {
    const log = await randomLogger();
    res.send(log.error("Error information message"))
});

app.get('/fatal',async (req,res) =>{
    const log = await randomLogger();
    res.send(log.fatal("Fatal information message"))
});

app.listen(3001);

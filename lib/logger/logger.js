const moment   = require("moment");
const logLevel = require("loglevel");
const prefix   = require("loglevel-plugin-prefix");

const {LOGGER} = require("../common/constant");

class Logger {
    static config(){
        return {
            template: "[%t||name=%n||level=%l]",
            levelFormatter(level){
                return level.toLowerCase();
            },
            nameFormatter(name){
                return name.toLowerCase();
            },
            timestampFormatter(date){
                return moment(date).format(LOGGER.FMT);
            },
        };
    }

    static __init__(){
        prefix.reg(logLevel);
        prefix.apply(logLevel, Logger.config());
    }

    static getLogger(level = LOGGER.LEVEL, name = LOGGER.NAME){
        let logger = logLevel.getLogger(name);
        logger.setLevel(level, false);

        return logger;
    }
}

Logger.__init__();

module.exports = Logger;
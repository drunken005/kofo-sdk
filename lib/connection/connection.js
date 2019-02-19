const axios = require("axios");
const {TIMEOUT, HEADERS, SUCCESS_CODE} = require("../common/constant").CONNECTION;
const Logger = require("../logger/logger");

class Connection {
    constructor({identifier, url, level, timeout = TIMEOUT, label = "Connection"}) {
        this.identifier = identifier;
        this.url = url;
        this.level = level;
        this.timeout = timeout;
        this.label = label;
        this.headers = Object.assign({}, HEADERS, !!this.identifier ? this.identifier.headers() : {});
        this.logger = Logger.getLogger(this.level);

        this.provider = axios.create({
            baseURL: this.url,
            timeout: this.timeout,
            headers: this.headers,
        });
    }

    export() {
        return {
            identifier: this.identifier.export(),
            level: this.level,
            url: this.url,
            timeout: this.timeout,
            label: this.label,
            headers: this.headers,
        };
    }

    isSuccess(response) {
        if (SUCCESS_CODE === response.data.respCode) {
            return true;
        }

        let message = `service=${this.label}||status=${response.status}`;
        if (response.data) {
            message += `||respCode=${response.data.respCode}||msg=${response.data.msg}`;
        }

        throw new Error(message);
    }

    exception(err) {
        let message = `service=${this.label}`;

        if (err.response) {
            message += `||status=${err.response.status}`;
            if (err.response.data) {
                message += `||data=${JSON.stringify(err.response.data)}`;
            }
        } else {
            if (err.config) {
                message += `||method=${err.config.method}||url=${err.config.url}`;
            }
            message += `||msg=${err.message}`;
        }

        return message;
    }

    async post(url, body) {
        this.logger.debug(`req=${url}||body=${JSON.stringify(body)}||headers=${JSON.stringify(this.headers)}`);

        if (this.label === 'gateway') {
            let {chain, currency} = this.identifier.export();

            if (chain === 'eos') {
                body = {
                    chain,
                    currency,
                    data: JSON.stringify(body)
                }
            }else{
                body = {
                    chain,
                    currency,
                    data: body
                };
            }
        }

        let response;
        try {
            response = await this.provider.post(url, body);
        } catch (err) {
            let message = this.exception(err);
            this.logger.debug(`res=${url}||message=${message}`);
            throw new Error(message);
        }

        this.isSuccess(response);
        this.logger.debug(`res=${url}||body=${JSON.stringify(response.data)}`);

        return response.data.data;
    }
}

module.exports = Connection;
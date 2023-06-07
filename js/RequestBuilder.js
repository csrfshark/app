class RequestBuilder {

    set method(value) { this._method = value; }

    get method() { return this._method; }

    set url(value) { this._url = value; }

    get url() { return this._url; }

    get body() { return this._body; }

    set body(value) { this._body = value; }

    set dataType(value) { this._dataType = value.toUpperCase(); }

    get dataType() { return this._dataType; }

    set contentType(value) { this._contentType = value; }

    get contentType() { return this._contentType; }

    set accept(value) { this._accept = value; }

    get accept() { return this._accept; }

    set acceptLanguage(value) { this._acceptLanguage = value; }

    get acceptLanguage() { return this._acceptLanguage; }

    set httpVersion(value) { this._httpVersion = value; }

    get httpVersion() { return this._httpVersion; }

    build() {
        this.urlObj = new URL(this._url);

        this.headers = this.#buildHeaders();

        if (this._dataType == 'HTTP') {
            return this.#buildHttp();
        } else if (this._dataType == 'CURL') {
            return this.#buildCurl();
        } else {
            console.error('build function error: unexpected variable value (dataType = ' + this._dataType + ')');
            return false;
        }
    }

    #buildHeaders() {
        let headers = {};

        headers['Host'] = this.urlObj.host;
        headers['User-Agent'] = window.navigator.userAgent;

        if (this.contentType) headers['Content-Type'] = this.contentType;
        if (this.accept) headers['Accept'] = this.accept;
        if (this.acceptLanguage) headers['Accept-Language'] = this.acceptLanguage;

        return headers;
    }

    #buildHttp() {
        const global = this;
        let result = '';

        result += encodeURIComponent(this.method) + " ";

        result += this.urlObj.pathname;
        result += this.urlObj.search + " ";

        if (this.httpVersion) result += this.httpVersion + "\n";

        Object.keys(this.headers).forEach(function (name) {
            result += name + ": " + global.headers[name] + "\n";
        });

        if (this.body) result += "\n" + this.body;

        return result;
    }

    #buildCurl() {
        const global = this;
        let result = "curl ";

        result += "'" + this.url.replace(/(['])/g, "\\$1") + "' ";

        if (this.method) result += "-X " + encodeURIComponent(this.method) + " ";

        if (this.body) result += "--data-raw '" + this.body.replace(/(['])/g, "\\$1") + "' ";

        Object.keys(this.headers).forEach(function (name) {
            result += "-H '" + name + ": " + global.headers[name].replace(/(['])/g, "\\$1") + "' ";
        });

        return result;
    }
}
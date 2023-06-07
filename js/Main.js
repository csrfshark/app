class Main {

    set requestElement(value) {

        this._requestElement = value;

        this.#trackRequest(value);
    }
    get requestElement() { return this._requestElement; }

    set resultElement(value) {

        this._resultElement = value;
    }
    get resultElement() { return this._resultElement; }

    set clearRequestElement(value) {
        this._clearRequestElement = value;
        this.#clearRequest(value);
    }
    get clearRequestElement() { return this._clearRequestElement; }

    set copyRequestElement(value) {
        this._copyRequestElement = value;
        this.#copyRequest(value);
    }
    get copyRequestElement() { return this._copyRequestElement; }

    set copyResultElement(value) {
        this._copyResultElement = value;
        this.#copyResult(value);
    }
    get copyResultElement() { return this._copyResultElement; }

    set copyShareUrlElement(value) {
        this._copyShareUrlElement = value;
        this.#copyShareUrl(value);
    }
    get copyShareUrlElement() { return this._copyShareUrlElement; }

    set fullscreenShareQrCodeElement(value) {
        this._fullscreenShareQrCodeElement = value;
        this.#fullscreenShareQrCode(value);
    }
    get fullscreenShareQrCodeElement() { return this._fullscreenShareQrCodeElement; }

    set decodeRequestElement(value) {
        this._decodeRequestElement = value;
        this.#decodeRequest(value);
    }
    get decodeRequestElement() { return this._decodeRequestElement; }

    set runResultElement(value) {
        this._runResultElement = value;
        this.#runResult(value);
    }
    get runResultElement() { return this._runResultElement; }

    set shareResultElement(value) {
        this._shareResultElement = value;
        this.#shareResult(value);
    }
    get shareResultElement() { return this._shareResultElement; }

    set optionsElement(value) {
        this._optionsElement = value;
        this.#options(value);
    }
    get optionsElement() { return this._optionsElement; }

    set saveOptionsElement(value) {
        this._saveOptionsElement = value;
        this.#saveOptions(value);
    }
    get saveOptionsElement() { return this._saveOptionsElement; }

    set firstVisitAcceptElement(value) {
        this._firstVisitAcceptElement = value;
        this.#firstVisitAccept(value);
    }
    get firstVisitAcceptElement() { return this._firstVisitAcceptElement; }

    set shareWarningAcceptElement(value) {
        this._shareWarningAcceptElement = value;
        this.#shareWarningAccept(value);
    }
    get shareWarningAcceptElement() { return this._shareWarningAcceptElement; }

    set protocolSelectElement(value) {
        this._protocolSelectElement = value;
        this.#protocolSelect(value);
    }
    get protocolSelectElement() { return this._protocolSelectElement; }

    set techniqueSelectElement(value) {
        this._techniqueSelectElement = value;
        this.#techniqueSelect(value);
    }
    get techniqueSelectElement() { return this._techniqueSelectElement; }

    set downloadResultElement(value) {
        this._downloadResultElement = value;
        this.#downloadResult(value);
    }
    get downloadResultElement() { return this._downloadResultElement; }

    set loaderElement(value) { this._loaderElement = value; }
    get loaderElement() { return this._loaderElement; }

    constructor() {

        this.modals = {};
    }

    init() {
        let global = this;

        this.options = new Options();

        $('a[href="#"]').click(function (e) {
            e.preventDefault();
        });

        $('html').attr('data-theme', this.options.theme);

        this.internationalization = new Internationalization();
        this.internationalization.init(this.options.language, this.loaderElement);

        this.resultBuilder = new ResultBuilder();
        this.requestBuilder = new RequestBuilder();

        if (!this.options.firstVisit) this.modal('firstVisitWarning', 'show');

        if (window.location.hash) {

            let shared = new Shared({
                requestBuilder: this.requestBuilder,
                techniqueSelectElement: this.techniqueSelectElement,
                protocolSelectElement: global.protocolSelectElement
            });

            $(this.requestElement).val(this.requestBuilder.build()).trigger('change');

            if (
                !this.options.shareWarningApply ||
                (parseInt(this.options.shareWarningApply) + 604800) <= Math.floor($.now() / 1000)
            ) {
                this.modal('shareWarning', 'show');
            }
        }

        if ($.trim($(this.requestElement).val()).length > 0) this.#renewResult();

        window.onhashchange = function () {
            let shared = new Shared({
                requestBuilder: global.requestBuilder,
                techniqueSelectElement: global.techniqueSelectElement,
                protocolSelectElement: global.protocolSelectElement
            });

            $(global.requestElement).val(global.requestBuilder.build()).trigger('change');
        }
    }

    initModal(name, data) {
        const global = this;

        const requiredAttributes = ['element', 'dismiss'];

        let isError = false;

        $.each(requiredAttributes, function (index, value) {

            if (typeof data[value] === 'undefined') {
                console.error('Main:initModal function error: a required attribute (' + value + ') was not provided');
                isError = true;
                return false;
            }
        });

        if (isError === true) return false;

        this.modals[name] = data;

        $(document).on('click', data.dismiss, function () {
            global.modal(name, 'hide');
        });
    }

    modal(name, action) {
        if (this.modals[name]) {
            switch (action) {
                case 'toggle':
                    $(this.modals[name].element).toggle();
                    break;
                case 'show':
                    $(this.modals[name].element).show();
                    break;
                case 'hide':
                    $(this.modals[name].element).hide();
                    break;
                default:
                    console.error('Main:modal function error: unknown variable value (action = ' + action + ')');
                    break;
            }
        } else {
            console.error('Main:modal function error: unknown variable value (name = ' + name + ')');
        }
    }

    #trackRequest(element) {
        const global = this;

        $(document).on('change input', element, function () {
            global.#renewResult();
        });
    }

    #renewResult() {
        this.resultBuilder.request = $(this.requestElement).val();
        this.resultBuilder.dataType = this.resultBuilder.autoDetectDataType();
        this.resultBuilder.protocol = $(this.protocolSelectElement).val();
        this.resultBuilder.technique = $(this.techniqueSelectElement).val();
        $(this.resultElement).val(this.resultBuilder.build());

        if (this.run_window && !this.run_window.closed) this.run_window.document.body.innerHTML = $(this.resultElement).val();
    }

    #clearRequest(element) {
        const global = this;

        $(document).on('click', element, function () {
            $(global.requestElement).val('');
            $(global.resultElement).val('');
            history.pushState("", document.title, window.location.pathname + window.location.search);
        });
    }

    #decodeRequest(element) {
        const global = this;

        $(document).on('click', element, function () {
            const content = $(global.requestElement).val();
            $(global.requestElement).val(decodeURI(content));
            global.#renewResult();
        });
    }

    #copyRequest(element) {
        const global = this;

        $(document).on('click', element, function () {
            ClipboardJS.copy($(global.requestElement).val());
        });
    }

    #copyShareUrl(element) {
        const global = this;

        $(document).on('click', element, function () {
            ClipboardJS.copy($(global.modals['share'].shareUrlInput).val());
        });
    }

    #fullscreenShareQrCode(element) {
        const global = this;

        $(document).on('click', element, function () {
            let shareUrl = global.#generateShareUrl();

            if (shareUrl.length < 1200) {
                $(global.modals['fullscreenShare'].qrCode).html('').qrcode(global.#generateShareQrCodeOptions(shareUrl, 256));
            } else {
                $(global.modals['fullscreenShare'].qrCode).html('');
            }

            $(global.modals['fullscreenShare'].element).show();
        });
    }

    #copyResult(element) {
        const global = this;

        $(document).on('click', element, function () {
            ClipboardJS.copy($(global.resultElement).val());
        });
    }

    #runResult(element) {
        const global = this;

        $(document).on('click', element, function () {

            if (global.run_window && !global.run_window.closed) return true;

            global.run_window = window.open("", "Title", "");

            global.run_window.document.write($(global.resultElement).val());
        });

        $(window).on('unload', function () {
            if (global.run_window && !global.run_window.closed) global.run_window.close();
        });
    }

    #shareResult(element) {
        const global = this;

        $(document).on('click', element, function () {
            let shareUrl = global.#generateShareUrl();

            $(global.modals['share'].shareUrlInput).val(shareUrl);

            if (shareUrl.length < 1200) {
                $(global.modals['share'].shareUrlQrCode).html('').qrcode(global.#generateShareQrCodeOptions(shareUrl, 128));
                $(global.fullscreenShareQrCodeElement).show();
            } else {
                $(global.modals['share'].shareUrlQrCode).html('');
                $(global.fullscreenShareQrCodeElement).hide();
            }

            global.modal('share', 'show');
        });
    }

    #generateShareUrl() {
        let shareUrl = window.location.protocol + '//' + window.location.host + location.pathname;

        let hash = '';

        try {
            if (this.resultBuilder.body) hash += 'b=' + encodeURIComponent(this.resultBuilder.body);
        } catch (e) { }

        try {
            if (this.resultBuilder.url) hash += '&u=' + encodeURIComponent(this.resultBuilder.url);
        } catch (e) { }

        try {
            if (this.resultBuilder.method) hash += '&m=' + encodeURIComponent(this.resultBuilder.method);
        } catch (e) { }

        try {
            if (this.resultBuilder.technique) hash += '&t=' + encodeURIComponent(this.resultBuilder.technique);
        } catch (e) { }

        try {
            if (this.resultBuilder.dataType) hash += '&dt=' + encodeURIComponent(this.resultBuilder.dataType);
        } catch (e) { }

        try {
            if (this.resultBuilder.protocol) hash += '&p=' + encodeURIComponent(this.resultBuilder.protocol);
        } catch (e) { }

        try {
            if (this.resultBuilder.dataType == 'HTTP') hash += '&hv=' + encodeURIComponent(this.resultBuilder.httpVersion);
        } catch (e) { }

        try {
            if (this.resultBuilder.contentType) hash += '&ct=' + encodeURIComponent(this.resultBuilder.contentType);
        } catch (e) { }

        try {
            if (this.resultBuilder.accept) hash += '&a=' + encodeURIComponent(this.resultBuilder.accept);
        } catch (e) { }

        try {
            if (this.resultBuilder.acceptLanguage) hash += '&al=' + encodeURIComponent(this.resultBuilder.acceptLanguage);
        } catch (e) { }

        if (hash) shareUrl += '#' + hash;

        return shareUrl;
    }

    #generateShareQrCodeOptions(shareUrl, qrSize) {
        let qrOptions = {
            render: 'div',
            minVersion: 1,
            maxVersion: 40,
            ecLevel: 'M',
            size: qrSize,
            background: null,
            text: shareUrl,
            radius: 0,
            quiet: 0,
            mode: 0,
            left: 0,
            top: 0,
        };

        if (this.options.theme == 'dark') { qrOptions.fill = 'var(--color)' } else { qrOptions.fill = 'var(--color)' };

        return qrOptions;
    }

    #options(element) {
        const global = this;

        $(document).on('click', element, function () {

            let selectElements = global.modals['options'].selectElements;

            Object.keys(selectElements).forEach(function (key) {

                $(selectElements[key] + ' > option').each(function () {
                    if (this.value == global.options[key]) {
                        $(this).attr('selected', true);
                    } else {
                        $(this).attr('selected', false);
                    }
                });

                $(selectElements[key]).trigger('change');
            });

            global.modal('options', 'show');
        });
    }

    #saveOptions(element) {
        const global = this;

        $(document).on('click', element, function (event) {
            event.preventDefault();
            let selectElements = global.modals['options'].selectElements;

            let optionsList = {};

            Object.keys(selectElements).forEach(function (key) {
                optionsList[key] = $(selectElements[key]).val();
            });

            let selectedLanguage = optionsList.language;

            let selectedTheme = optionsList.theme;

            optionsList = JSON.stringify(optionsList);

            global.options.import(optionsList);

            $('html').attr('data-theme', selectedTheme);

            global.internationalization.changeLanguage(selectedLanguage, global.loaderElement);
        });
    }

    #firstVisitAccept(element) {
        const global = this;

        $(document).on('click', element, function (event) {
            event.preventDefault();
            let now = Math.floor($.now() / 1000);

            global.options.firstVisit = now;

            global.modal('firstVisitWarning', 'hide');
        });
    }

    #shareWarningAccept(element) {
        const global = this;

        $(document).on('click', element, function (event) {
            event.preventDefault();
            let now = Math.floor($.now() / 1000);

            global.options.shareWarningApply = now;

            global.modal('shareWarning', 'hide');
        });
    }

    #protocolSelect(element) {
        const global = this;

        $(document).on('change', element, function (event) {
            global.#renewResult();
        });
    }

    #techniqueSelect(element) {
        const global = this;

        $(document).on('change', element, function (event) {
            global.#renewResult();
        });
    }

    #downloadResult(element) {
        const global = this;

        $(document).on('click', element, function (event) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent($(global.resultElement).val()));

            element.setAttribute('download', global.resultBuilder.hostname + '_CSRF_POC.html');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        });
    }
}
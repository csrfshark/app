class Shared {

    constructor(params) {

        let hash = window.location.hash.substring(1);

        let hashParams = hash.split('&');

        let hashData = {};

        hashParams.forEach(function (item) {
            let name = item.split('=')[0];
            let value = item.split('=')[1];

            hashData[name] = value;
        });

        if (hashData.b) params.requestBuilder.body = decodeURIComponent(hashData.b);

        if (hashData.u) {
            params.requestBuilder.url = decodeURIComponent(hashData.u);
        } else {
            console.error('Shared:constructor function error: undefined variable value (url)');
            return false;
        }

        if (hashData.m) {
            params.requestBuilder.method = decodeURIComponent(hashData.m);
        } else {
            console.error('Shared:constructor function error: undefined variable value (method)');
            return false;
        }

        if (hashData.t) {
            $(params.techniqueSelectElement).val(decodeURIComponent(hashData.t)).trigger('change');
        } else {
            console.error('Shared:constructor function error: undefined variable value (technique)');
            return false;
        }

        if (hashData.p) {
            $(params.protocolSelectElement).val(decodeURIComponent(hashData.p)).trigger('change');
        } else {
            console.error('Shared:constructor function error: undefined variable value (protocol)');
            return false;
        }

        if (hashData.dt) {
            params.requestBuilder.dataType = decodeURIComponent(hashData.dt);
        } else {
            console.error('Shared:constructor function error: undefined variable value (dataType)');
            return false;
        }

        if (hashData.ct) params.requestBuilder.contentType = decodeURIComponent(hashData.ct);

        if (hashData.a) params.requestBuilder.accept = decodeURIComponent(hashData.a);

        if (hashData.al) params.requestBuilder.acceptLanguage = decodeURIComponent(hashData.al);

        if (hashData.hv) params.requestBuilder.httpVersion = decodeURIComponent(hashData.hv);

        return true;

    }

}
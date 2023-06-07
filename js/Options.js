class Options {

    set language(value) { localStorage.setItem('language', value); }

    get language() { return localStorage.getItem('language'); }

    set theme(value) { localStorage.setItem('theme', value); }

    get theme() { return localStorage.getItem('theme'); }

    set firstVisit(value) { localStorage.setItem('firstVisit', value); }

    get firstVisit() { return localStorage.getItem('firstVisit'); }

    set shareWarningApply(value) { localStorage.setItem('shareWarningApply', value); }

    get shareWarningApply() { return localStorage.getItem('shareWarningApply'); }

    constructor() {
        if (!this.theme || !this.language) this.setDefaults();
    }

    setDefaults() {
        let userLanguage = (navigator.language).substr(0, 2);

        switch (userLanguage) {
            case 'ru':
                this.language = 'ru';
                break;

            case 'uk':
                this.language = 'uk';
                break;

            case 'es':
                this.language = 'es';
                break;

            default:
                this.language = 'en';
                break;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
    }

    export() {

        let exportData = {};

        for (var i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            exportData[key] = value;
        }

        let href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData));
        let a = document.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('download', 'settings.json');

        document.body.appendChild(a);
        a.click();

        setTimeout(function () {
            document.body.removeChild(a);
        }, 0);
    }

    import(jsonString) {
        let json = JSON.parse(jsonString);

        $.each(json, function (key, item) {
            if (localStorage.getItem(key)) {
                localStorage.setItem(key, item);
            }
        });
    }
}
class Internationalization {

    init(language, loaderElement) {
        $(loaderElement).show();

        i18next.use(i18nextHttpBackend).init({
            debug: false,
            lng: language,
            fallbackLng: 'en',
            backend: {
                loadPath: 'locales/{{lng}}.json'
            },

        }, (err, t) => {
            if (err) return console.error(err);
            jqueryI18next.init(i18next, $, { useOptionsAttr: true });

            this.#rerender(language, loaderElement);
        });
    }

    changeLanguage(language, loaderElement) {
        $(loaderElement).show();

        i18next.changeLanguage(language, () => {
            this.#rerender(language, loaderElement);
        });
    }

    #rerender(language, loaderElement) {
        $('body').localize();
        $('title').text($.t('head.title'));

        $('select').select2();

        $('html').attr('lang', language);

        setTimeout(function () {
            $(loaderElement).hide();
        }, 300);
    }

}
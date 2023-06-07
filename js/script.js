$(function () {

    let main = new Main();

    main.requestElement = '.js-request';
    main.resultElement = '.js-result';

    main.initModal('share', {
        element: '.js-share-modal',
        dismiss: '.js-dismiss-modal-button',
        shareUrlInput: '.js-share-url-input',
        shareUrlQrCode: '.js-share-url-qr-code',
    });

    main.copyShareUrlElement = '.js-copy-share-url-button';

    main.fullscreenShareQrCodeElement = '.js-fullscreen-share-qr-code-button';

    main.initModal('fullscreenShare', {
        element: '.js-share-fullscreen-qr-code-modal',
        dismiss: '.js-dismiss-fullscreen-share-modal-button',
        qrCode: '.js-share-fullscreen-qr-code'
    });

    main.shareResultElement = '.js-share-button';

    main.protocolSelectElement = '.js-protocol-select';

    main.techniqueSelectElement = '.js-technique-select';

    main.initModal('options', {
        element: '.js-options-modal',
        dismiss: '.js-dismiss-modal-button',
        selectElements: {
            language: '.options-language',
            theme: '.options-theme'
        }
    });

    main.optionsElement = '.js-options-button';

    main.saveOptionsElement = '.js-apply-options-modal-button';

    main.initModal('shareWarning', {
        element: '.js-share-warning-modal',
        dismiss: '.js-dismiss-modal-button',
    });

    main.shareWarningAcceptElement = '.js-apply-share-warning-modal-button';

    main.initModal('firstVisitWarning', {
        element: '.js-first-visit-warning-modal',
        dismiss: '.js-dismiss-modal-button',
    });

    main.firstVisitAcceptElement = '.js-apply-first-visit-warning-modal-button';

    main.clearRequestElement = '.js-clear-button';

    main.copyRequestElement = '.js-copy-request-button';

    main.copyResultElement = '.js-copy-response-button';

    main.decodeRequestElement = '.js-decode-button';

    main.runResultElement = '.js-run-button';

    main.downloadResultElement = '.js-download-response-button';

    main.loaderElement = '.loader';

    main.init();
});
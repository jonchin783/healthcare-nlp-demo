$(document).ready(function () {
    $('.ui.dropdown')
        .dropdown()
    ;

    $('.menu .item')
        .tab()
    ;

    $('.message .close')
        .on('click', function() {
            $(this)
                .closest('.message')
                .transition('fade')
            ;
        })
    ;
    $('.sidebar')
        .sidebar({
            dimPage: false,
            closable: false,
            scrollLock: true,
            debug: false,
            verbose: false,
            delaySetup: true

        })
        .sidebar('attach events', '#vk-header-icon-a')
        .sidebar('setting', 'transition', 'push');

});


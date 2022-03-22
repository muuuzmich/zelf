(function () {
    let d = document;
    let modal = false;
    let mobileMenu = false;
    let mobHeaderShown = false;
    let els = d.getElementsByClassName('modal_btn');
    let headerButton = d.getElementsByClassName('header--btn')[0];
    let modalBtnText = headerButton.innerHTML;
    let modalBtnCloseText = headerButton.dataset.close;

    d.getElementById('open-menu').addEventListener('click', (e) => {
        if (modal) {
            toggleModal();
            return;
        }
        toggleMenu();
    });

    [].forEach.call(els, function (el) {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal(Boolean(e.target.dataset.keep_header));
        })
    });

    function toggleModal(keephader = false) {
        if (mobileMenu) toggleMenu();
        d.getElementsByTagName('body')[0].classList.toggle('modal');
        if (!keephader) {
            d.getElementById('site-header').classList.toggle('full');
        }
        if(window.innerWidth > 767)
            d.querySelector('.site-header__content:not(.site-header__content--fixed)').classList.toggle('hidden');

        d.getElementById('site-header-mobile').classList.add('full');
        d.getElementById('modal-wrapper').classList.toggle('open');
        d.getElementById('open-menu').classList.toggle('close');
        headerButton.classList.toggle('btn--inverted');
        modal = !modal;
        headerButton.innerHTML = modal ? modalBtnCloseText : modalBtnText
    }


    function toggleMenu(e) {
        d.getElementById('open-menu').classList.toggle('close');
        d.getElementsByTagName('body')[0].classList.toggle('modal');
        d.getElementById('mobile-menu').classList.toggle('opened');
        d.getElementsByClassName('site-header--mobile')[0].classList.add('full');
        mobileMenu = !mobileMenu;
    }

})();
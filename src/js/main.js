(function () {
    const d = document;
    const m = Math;

    //Подгрузка других видео для мобильных устройств
    if (window.innerWidth < 400) {
        [].forEach.call(d.querySelectorAll('video.tmp'), (vid) => {
            vid.src = vid.dataset.mobSrc ? vid.dataset.mobSrc : vid.dataset.src;
        })
    } else {
        [].forEach.call(d.querySelectorAll('video.tmp'), (vid) => {
            vid.src = vid.dataset.src;
        })
    }

    let scrollr;
    let shaking;
    let section = null;
    let h = window.innerHeight;
    let w = window.innerWidth;
    let cX = null;
    let cY = null;
    let shakeX;
    let shakeY;
    let forced = false;
    let mobSphere = d.getElementById('mobile-sphere');


    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
        get: function () {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        }
    });

    //Генератор движения шара на главной
    setInterval(() => {
        shakeX = m.random() * (m.floor(m.random() * 2) === 1 ? 1 : -1) / 2;
        shakeY = m.random() * (m.floor(m.random() * 2) === 1 ? 1 : -1) / 2;
    }, 200);

    d.addEventListener('DOMContentLoaded', () => {
        if (window.innerWidth > 767) {
            //Инициализация десктоп библиотек

            AOS.init();
            scrollr = skrollr.init({
                smoothScrolling: true,
                smoothScrollingDuration: 350,
                mobileCheck: function () {
                    //hack - forces mobile version to be off
                    return false;
                }
            });
            shaking = setInterval(() => {
                moveBall(shakeX, shakeY);
            }, 700);
            //Очень стрёмный кусок для старта видео в секции когда скролл доходит к ней
            d.addEventListener('scroll', (e) => {
                forced = true;
                if (window.pageYOffset + h / 2 > h && section < 1) {
                    section = 2;
                    let vid = d.querySelector(`section:nth-of-type(${section}) video.tmp`);
                    vid.play();
                }
                if (window.pageYOffset + h / 2 > h * 3.75 && section < 4) {
                    section = 4;
                    let vid = d.querySelector(`section:nth-of-type(${section}) video.tmp`);
                    vid.play();
                }
                if (window.pageYOffset + h / 2 > h * 5.25 && section < 5) {
                    section = 5;
                    let vid = d.querySelector(`section:nth-of-type(${section}) video.tmp`);
                    setTimeout(() => {
                        vid.play();
                    }, 1000)

                }
            });

        } else {
            //mobile
            AOS.init({
                offset: window.innerHeight / 2,
            });

            shaking = setInterval(() => {
                moveMobileBall(shakeX, shakeY);
            }, 700);


            // Кусок для обхода low power mode на айфонах. Форсит старт воспроизведения видео
            const forcePlay = () => {
                if (forced) return;
                d.getElementById('video-placeholder').style.opacity = '0';
                // let vid = d.getElementById('#mobile-sphere');
                const videoElements = d.getElementsByTagName('video');
                [].forEach.call(videoElements, (vid) => {
                    vid.play();
                });

                [].forEach.call(d.querySelectorAll('video.tmp'), (vid) => {
                    vid.pause();
                });
                forced = true;
            };
            d.getElementsByTagName('body')[0].addEventListener('click', forcePlay);
            d.getElementsByTagName('body')[0].addEventListener('touchstart', forcePlay);


            //Очень стрёмный кусок для старта видео в секции когда скролл доходит к ней
            d.addEventListener('scroll', (e) => {
                if (window.pageYOffset > (h - h / 2)) {
                    section = 2;
                    let vid = d.querySelector(`section:nth-of-type(${section}) video.tmp`);
                    vid.play();
                }
                if (window.pageYOffset > (h - h / 2) * 4) {
                    section = 4;
                    let vid = d.querySelector(`section:nth-of-type(${section}) video.tmp`);
                    vid.play();
                }
                if (window.pageYOffset > (h - h / 2) * 5) {
                    section = 5;
                    let vid = d.querySelector(`section:nth-of-type(${section}) video.tmp`);
                    setTimeout(() => {
                        vid.play();
                    }, 1000)

                }
            });
        }

        //Отвечает за появление шапки сайта при скролле.
        d.addEventListener('scroll', (e) => {
            if (window.pageYOffset > 200) {
                //Так же убирает генератор движения шара и обнуляет позицию. Чтоб он не двигался на месте иконки
                clearInterval(shaking);
                moveBall(0, 0);
                d.querySelector('.site-header.site-header--mobile').classList.add('full');
            } else {
                d.querySelector('.site-header.site-header--mobile').classList.remove('full');
            }
        });

        // disable skrollr if the window is resized below 768px wide
        window.addEventListener('resize', () => {
            if (scrollr && window.innerWidth <= 767) {
                scrollr.destroy();
                clearInterval(shaking);
                moveBall(0, 0);
                scrollr = undefined;
            }
        });

        //Убирает заглушку на месте шара в моб версии после загрузки видео
        mobSphere.oncanplaythrough = () => {
            if (!mobSphere.paused)
                d.getElementById('video-placeholder').style.opacity = '0';
        }
    });
    //Движение шара
    function moveBall(x, y) {
        d.getElementById("sphere").style.transform = `translate3d(${x * 5}px, ${y * 5}px, 0)
        rotate(${m.round((m.random() < 0.5 ? -1 : 1) * m.random() * 50) / 10}deg)
        `;
    }
    //Движение шара в моб версии
    function moveMobileBall(x, y) {
        d.getElementById("mobile-sphere").style.transform = `translate3d(${x * 5}px, ${y * 5}px, 0)
        rotate(${m.round((m.random() < 0.5 ? -1 : 1) * m.random() * 50) / 10}deg)
        `;
    }

})();
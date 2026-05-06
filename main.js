document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Fallback: reveal all after 1.5s
    setTimeout(() => {
        revealElements.forEach(el => {
            if (!el.classList.contains('active')) {
                el.classList.add('active');
            }
        });
    }, 1500);

    // 2. Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
            }
        });
    });

    // 3. Center Scroll for Mobile Pricing Slider
    if (window.innerWidth <= 600) {
        const swiperContainer = document.querySelector('.swiper-container');
        if (swiperContainer) {
            setTimeout(() => {
                swiperContainer.scrollTo({ left: 200, behavior: 'smooth' });
            }, 500);
        }
    }

    // 4. Marquee — seamless infinite loop via requestAnimationFrame
    // Clones items INSIDE the same flex track (no second carousel element).
    // Measures real pixel width only after all images (originals + nested) have loaded.
    function initMarquee(track) {
        if (!track) return;

        const speed = parseFloat(track.dataset.speed) || 0.6; // px per frame
        const originals = Array.from(track.children);

        // Clone each item and append to the same track
        originals.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        let offset = 0;
        let halfWidth = 0;

        function measure() {
            halfWidth = track.scrollWidth / 2;
        }

        function tick() {
            offset += speed;
            if (offset >= halfWidth) offset -= halfWidth;
            track.style.transform = `translateX(-${offset}px)`;
            requestAnimationFrame(tick);
        }

        // Collect all images inside originals (root or nested)
        const images = originals.flatMap(el =>
            el.tagName === 'IMG' ? [el] : Array.from(el.querySelectorAll('img'))
        );

        if (images.length === 0) {
            measure();
            requestAnimationFrame(tick);
            return;
        }

        let loaded = 0;
        function onSettled() {
            loaded++;
            if (loaded === images.length) {
                measure();
                requestAnimationFrame(tick);
            }
        }

        images.forEach(img => {
            if (img.complete) onSettled();
            else {
                img.addEventListener('load', onSettled);
                img.addEventListener('error', onSettled);
            }
        });
    }

    document.querySelectorAll('.marquee-track').forEach(initMarquee);

    // 5. Opt-in popup
    const optinOverlay = document.getElementById('optinOverlay');
    const optinClose = document.getElementById('optinClose');
    const optinForm = document.getElementById('optinForm');

    function openOptin() {
        if (!optinOverlay) return;
        optinOverlay.classList.add('is-open');
        optinOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('optin-locked');
        const firstInput = optinOverlay.querySelector('input, select');
        if (firstInput) setTimeout(() => firstInput.focus(), 350);
    }

    function closeOptin() {
        if (!optinOverlay) return;
        optinOverlay.classList.remove('is-open');
        optinOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('optin-locked');
    }

    // Hijack any CTA pointing to the chat URL → open popup instead
    document.querySelectorAll('a[href*="quero-contratar"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openOptin();
        });
    });

    if (optinClose) optinClose.addEventListener('click', closeOptin);
    if (optinOverlay) {
        optinOverlay.addEventListener('click', (e) => {
            if (e.target === optinOverlay) closeOptin();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && optinOverlay && optinOverlay.classList.contains('is-open')) closeOptin();
    });

    if (optinForm) {
        optinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!optinForm.checkValidity()) {
                optinForm.reportValidity();
                return;
            }
            const data = Object.fromEntries(new FormData(optinForm).entries());
            // TODO: integrar envio (webhook, CRM, etc). Por enquanto apenas redireciona com os dados na URL.
            console.log('Opt-in submitted:', data);
            const params = new URLSearchParams(data).toString();
            window.location.href = 'qualificacao.html?' + params;
        });
    }

    // 6. Anti-Samba Script (Prevenção de Scroll Horizontal no Mobile)
    // Identifica dinamicamente elementos que estão largos demais e os ajusta.
    function preventHorizontalOverflow() {
        if (window.innerWidth <= 600) {
            const viewportWidth = document.documentElement.clientWidth;
            
            // Força no html e body para garantir
            document.documentElement.style.overflowX = 'hidden';
            document.body.style.overflowX = 'hidden';
            document.documentElement.style.width = '100%';
            document.body.style.width = '100%';

            document.querySelectorAll('body *').forEach(el => {
                // Ignorar componentes que possuem rolagem horizontal intencional
                if (el.closest('.marquee-track') || el.closest('.pricing-cards') || el.closest('.cases-marquee-track') || el.closest('.marquee-container') || el.closest('.cases-marquee')) {
                    return;
                }
                
                const rect = el.getBoundingClientRect();
                // Se o elemento estiver vazando pela direita ou for mais largo que a tela
                if (rect.right > viewportWidth || rect.width > viewportWidth) {
                    el.style.maxWidth = '100%';
                    el.style.boxSizing = 'border-box';
                    // Se for um texto muito longo sem espaços, quebra a linha
                    const computedStyle = window.getComputedStyle(el);
                    if (computedStyle.display !== 'inline') {
                        el.style.wordBreak = 'break-word';
                    }
                }
            });
        } else {
            // Remove as regras se voltar para desktop
            document.documentElement.style.overflowX = '';
            document.body.style.overflowX = 'hidden'; // Mantém o do CSS original
            document.documentElement.style.width = '';
            document.body.style.width = '';
        }
    }

    // Roda no início, no load (quando imagens carregam) e no resize
    preventHorizontalOverflow();
    window.addEventListener('load', preventHorizontalOverflow);
    window.addEventListener('resize', preventHorizontalOverflow);
    // Roda novamente após 1s para garantir que fontes/animações não quebraram o layout
    setTimeout(preventHorizontalOverflow, 1000);
});

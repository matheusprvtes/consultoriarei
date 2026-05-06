document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('qualForm');
    const steps = Array.from(form.querySelectorAll('.qual-step'));
    const totalSteps = steps.length;

    const btnBack = document.getElementById('qualBtnBack');
    const btnNext = document.getElementById('qualBtnNext');
    const btnSubmit = document.getElementById('qualBtnSubmit');

    const progressBar = document.getElementById('qualProgressBar');
    const currentStepLabel = document.getElementById('qualCurrentStep');
    const totalStepsLabel = document.getElementById('qualTotalSteps');
    const percentLabel = document.getElementById('qualPercent');

    const successScreen = document.getElementById('qualSuccess');

    let currentStep = 1;

    totalStepsLabel.textContent = totalSteps;

    // Pré-popula campos de contato a partir da query string (vindos do opt-in)
    const params = new URLSearchParams(window.location.search);
    if (params.get('nome')) {
        const nomeInput = document.getElementById('qualNome');
        if (nomeInput) nomeInput.value = params.get('nome');
    }
    if (params.get('email')) {
        const emailInput = document.getElementById('qualEmail');
        if (emailInput) emailInput.value = params.get('email');
    }
    if (params.get('whatsapp')) {
        const whatsInput = document.getElementById('qualWhats');
        if (whatsInput) whatsInput.value = params.get('whatsapp');
    }

    function updateProgress() {
        const percent = Math.round((currentStep / totalSteps) * 100);
        progressBar.style.width = percent + '%';
        currentStepLabel.textContent = currentStep;
        percentLabel.textContent = percent + '%';
    }

    function showStep(stepIndex) {
        steps.forEach((step, idx) => {
            step.classList.toggle('is-active', idx === stepIndex - 1);
        });

        btnBack.disabled = stepIndex === 1;

        if (stepIndex === totalSteps) {
            btnNext.hidden = true;
            btnSubmit.hidden = false;
        } else {
            btnNext.hidden = false;
            btnSubmit.hidden = true;
        }

        updateProgress();

        // Scroll suave para o topo do form
        const formTop = form.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: formTop, behavior: 'smooth' });
    }

    function validateStep(stepIndex) {
        const step = steps[stepIndex - 1];
        const inputs = step.querySelectorAll('input[required]');

        if (inputs.length === 0) return true;

        // Para radio: verificar se algum do grupo foi selecionado
        const radioGroups = new Set();
        let hasRadios = false;
        inputs.forEach(input => {
            if (input.type === 'radio') {
                hasRadios = true;
                radioGroups.add(input.name);
            }
        });

        if (hasRadios) {
            for (const groupName of radioGroups) {
                const checked = step.querySelector(`input[name="${groupName}"]:checked`);
                if (!checked) {
                    showStepError(step, 'Por favor, selecione uma opção para continuar.');
                    return false;
                }
            }
        }

        // Para inputs de texto/email/tel
        for (const input of inputs) {
            if (input.type === 'radio') continue;
            if (!input.value.trim()) {
                showStepError(step, 'Por favor, preencha o campo obrigatório.');
                input.focus();
                return false;
            }
            if (input.type === 'email' && !input.checkValidity()) {
                showStepError(step, 'Por favor, insira um e-mail válido.');
                input.focus();
                return false;
            }
        }

        clearStepError(step);
        return true;
    }

    function showStepError(step, message) {
        let errorEl = step.querySelector('.qual-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'qual-error';
            step.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.classList.add('is-visible');
    }

    function clearStepError(step) {
        const errorEl = step.querySelector('.qual-error');
        if (errorEl) errorEl.classList.remove('is-visible');
    }

    btnNext.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Auto-avanço para radios (exceto na última etapa que tem múltiplos campos)
    steps.forEach((step, idx) => {
        const stepNumber = idx + 1;
        const radios = step.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                clearStepError(step);
                // Auto-avança após pequeno delay para feedback visual
                if (stepNumber < totalSteps) {
                    setTimeout(() => {
                        if (currentStep === stepNumber) {
                            currentStep++;
                            showStep(currentStep);
                        }
                    }, 350);
                }
            });
        });
    });

    // Permitir Enter para avançar
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (currentStep < totalSteps) {
                btnNext.click();
            } else {
                btnSubmit.click();
            }
        }
    });

    // Formatação leve do WhatsApp (apenas números)
    const whatsInput = document.getElementById('qualWhats');
    if (whatsInput) {
        whatsInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Submissão final
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const data = Object.fromEntries(new FormData(form).entries());
        // Mescla com dados do opt-in (query string)
        params.forEach((value, key) => {
            if (!data[key]) data[key] = value;
        });

        // TODO: integrar envio real (webhook, CRM, etc)
        console.log('Qualificação completa:', data);

        // Redireciona para a página de obrigado preservando dados na query string
        const finalParams = new URLSearchParams(data).toString();
        window.location.href = 'obrigado.html?' + finalParams;
    });

    // Inicializa
    showStep(1);
});

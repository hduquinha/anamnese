document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.add('active');
            }
        });
        // Scroll to top of form
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Handle "Outros" functionality
    const otherRadios = document.querySelectorAll('.other-option');
    
    otherRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                const formGroup = e.target.closest('.form-group');
                const optionsDiv = formGroup.querySelector('.options');
                const otherInputDiv = formGroup.querySelector('.other-input');
                
                optionsDiv.style.display = 'none';
                otherInputDiv.style.display = 'block';
                otherInputDiv.querySelector('input').focus();
            }
        });
    });

    // Handle "Voltar" buttons
    const backButtons = document.querySelectorAll('.btn-back-options');
    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const formGroup = e.target.closest('.form-group');
            const optionsDiv = formGroup.querySelector('.options');
            const otherInputDiv = formGroup.querySelector('.other-input');
            const inputs = optionsDiv.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            
            optionsDiv.style.display = 'block';
            otherInputDiv.style.display = 'none';
            
            // Uncheck all inputs in this group
            inputs.forEach(input => input.checked = false);
        });
    });
});
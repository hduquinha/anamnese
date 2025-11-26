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

    // Handle Form Submission
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        // Remove inline onclick if it exists (it's in HTML, but we can override or just ignore if we use addEventListener and preventDefault if it was a submit type, but it is button type)
        submitBtn.removeAttribute('onclick'); 
        
        submitBtn.addEventListener('click', async () => {
            const formData = {};
            
            // Helper to get values
            const getValue = (name) => {
                const formGroup = document.querySelector(`input[name="${name}"]`)?.closest('.form-group') || document.querySelector(`textarea[name="${name}"]`)?.closest('.form-group');
                if (!formGroup) return '';

                // Check if "Outros" text input is visible
                const otherInputDiv = formGroup.querySelector('.other-input');
                if (otherInputDiv && otherInputDiv.style.display !== 'none') {
                    return otherInputDiv.querySelector('input').value;
                }

                // Handle Checkboxes (Multiple values)
                const checkboxes = formGroup.querySelectorAll(`input[name="${name}"]:checked`);
                if (checkboxes.length > 0 && checkboxes[0].type === 'checkbox') {
                    return Array.from(checkboxes).map(cb => cb.value).join(', ');
                }

                // Handle Radio (Single value)
                const radio = formGroup.querySelector(`input[name="${name}"]:checked`);
                if (radio) {
                    return radio.value;
                }

                // Handle Text/Textarea
                const textInput = formGroup.querySelector(`input[name="${name}"], textarea[name="${name}"]`);
                if (textInput) {
                    return textInput.value;
                }

                return '';
            };

            // Map fields
            formData.nome = getValue('nome');
            formData.telefone = getValue('telefone');
            formData.cidade = getValue('cidade');
            formData.q1 = getValue('q1');
            formData.q2 = getValue('q2');
            formData.q_medo = getValue('q_medo');
            formData.q4 = getValue('q4');
            formData.q5 = getValue('q5');
            formData.q6 = getValue('q6');
            formData.q7 = getValue('q7');
            formData.q8 = getValue('q8');
            formData.q9 = getValue('q9');
            formData.q10 = getValue('q10');
            formData.q11 = getValue('q11'); // Renda necessária (renumbered)

            try {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                const response = await fetch('http://localhost:3000/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Formulário enviado com sucesso!');
                    window.location.reload();
                } else {
                    alert('Erro ao enviar: ' + result.message);
                    submitBtn.textContent = 'Enviar';
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro de conexão com o servidor.');
                submitBtn.textContent = 'Enviar';
                submitBtn.disabled = false;
            }
        });
    }
});
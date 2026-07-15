// js/contact.js

/**
 * Valida un campo individual en tiempo real aplicando los estilos del CSS corporativo
 * y actualizando los atributos de accesibilidad ARIA correspondientes.
 * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - El campo de formulario a evaluar.
 * @returns {boolean} true si el campo cumple con las reglas de validación, de lo contrario false.
 */
export function validateField(inputElement) {
  const fieldGroup = inputElement.closest('.field-group');
  const errorId = inputElement.getAttribute('aria-describedby');
  const errorElement = errorId ? document.getElementById(errorId) : null;
  
  let isValid = true;
  let errorMessage = '';

  // Validaciones básicas de especificación
  if (inputElement.required && !inputElement.value.trim()) {
    isValid = false;
    errorMessage = 'Este campo es obligatorio.';
  } else if (inputElement.type === 'email' && inputElement.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputElement.value.trim())) {
      isValid = false;
      errorMessage = 'Por favor, ingresa un correo electrónico válido.';
    }
  }

  // Actualización del feedback visual e interactivo acordado
  if (fieldGroup) {
    if (isValid) {
      fieldGroup.classList.remove('has-error');
      fieldGroup.classList.add('has-success');
      inputElement.setAttribute('aria-invalid', 'false');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.setAttribute('hidden', 'true');
      }
    } else {
      fieldGroup.classList.remove('has-success');
      fieldGroup.classList.add('has-error');
      inputElement.setAttribute('aria-invalid', 'true');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.removeAttribute('hidden');
      }
    }
  }

  return isValid;
}

/**
 * Maneja el evento de envío del formulario. Valida todos los campos y simula el éxito del envío.
 * @param {Event} event - El evento de submit del formulario.
 */
export function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const inputs = Array.from(form.querySelectorAll('input, textarea'));
  
  let formIsValid = true;
  
  inputs.forEach(input => {
    const isFieldValid = validateField(input);
    if (!isFieldValid) formIsValid = false;
  });

  if (formIsValid) {
    // Implementar visualización de éxito en la UI sin recargar
    const successAlert = document.getElementById('contact-success-alert');
    if (successAlert) {
      successAlert.removeAttribute('hidden');
      form.reset();
      
      // Limpiar clases de éxito visual después de reiniciar el formulario
      inputs.forEach(input => {
        const fieldGroup = input.closest('.field-group');
        if (fieldGroup) fieldGroup.classList.remove('has-success');
      });
    }
  }
}
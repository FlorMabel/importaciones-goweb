/**
 * Validaciones reutilizables para formularios del admin
 * Retornan string de error o null si es válido
 */

export const required = (v) => (!v && v !== 0) ? 'Este campo es obligatorio' : null;

export const minLength = (min) => (v) =>
  v && v.length < min ? `Mínimo ${min} caracteres` : null;

export const maxLength = (max) => (v) =>
  v && v.length > max ? `Máximo ${max} caracteres` : null;

export const isNumber = (v) =>
  v !== '' && v !== null && v !== undefined && isNaN(Number(v)) ? 'Debe ser un número' : null;

export const minValue = (min) => (v) =>
  v !== '' && Number(v) < min ? `Mínimo ${min}` : null;

export const isSlug = (v) =>
  v && !/^[a-z0-9ñ]+(?:-[a-z0-9ñ]+)*$/.test(v) ? 'Solo minúsculas, números y guiones' : null;

export const isUrl = (v) => {
  if (!v) return null;
  try { new URL(v); return null; }
  catch { return 'URL inválida'; }
};

export const isEmail = (v) =>
  v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido' : null;

/**
 * Ejecuta múltiples validadores sobre un valor
 * @returns {string|null} Primer error encontrado o null
 */
export function validate(value, ...validators) {
  for (const fn of validators) {
    const error = fn(value);
    if (error) return error;
  }
  return null;
}

/**
 * Valida un objeto completo contra un schema de reglas
 * @param {Object} data - Datos a validar
 * @param {Object} rules - { fieldName: [validator1, validator2, ...] }
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateForm(data, rules) {
  const errors = {};
  let valid = true;
  for (const [field, validators] of Object.entries(rules)) {
    const error = validate(data[field], ...validators);
    if (error) {
      errors[field] = error;
      valid = false;
    }
  }
  return { valid, errors };
}

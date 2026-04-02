export function normalizeCpf(value = '') {
  return String(value).replace(/\D/g, '');
}

export function isValidCpfFormat(value = '') {
  return normalizeCpf(value).length === 11;
}

export function formatCpf(value = '') {
  const digits = normalizeCpf(value);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

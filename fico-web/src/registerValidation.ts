const EMAIL_PATTERN =
  /^(?:[a-zA-Z0-9_'^&\+{}=~!#$%*?`|\/.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export type RegisterFormState = {
  email: string;
  password: string;
  fullName: string;
  kvkkAccepted: boolean;
};

export type RegisterFormErrors = {
  email?: string;
  password?: string;
  fullName?: string;
  kvkkAccepted?: string;
};

export function validateRegisterForm(state: RegisterFormState): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  if (!EMAIL_PATTERN.test(state.email.trim())) {
    errors.email = "Lutfen gecerli bir email girin.";
  }
  if (!PASSWORD_PATTERN.test(state.password)) {
    errors.password = "Sifre en az 8 karakter, 1 buyuk harf ve 1 rakam icermelidir.";
  }
  if (!state.fullName.trim()) {
    errors.fullName = "Ad soyad zorunludur.";
  }
  if (!state.kvkkAccepted) {
    errors.kvkkAccepted = "Kayit icin KVKK onayi zorunludur.";
  }
  return errors;
}

export function canSubmitRegister(state: RegisterFormState): boolean {
  return Object.keys(validateRegisterForm(state)).length === 0;
}

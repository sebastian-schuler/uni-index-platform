
const EmailPattern: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PasswordPattern: RegExp = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,64}$/;

const DisplayNamePattern: RegExp = /^([a-z\s]){4,32}$/i;


export const isEmailValid = (email: string): boolean => {
    return EmailPattern.test(email.toLowerCase());
}

export const isPasswordValid = (password: string): boolean => {
    return PasswordPattern.test(password);
}

export const isDisplayNameValid = (displayName: string): boolean => {
    return DisplayNamePattern.test(displayName);
}



export interface LocaleItem { 
    id: string, 
    text: string 
}

export const localeArray: LocaleItem[] = [
    { id: "en", text: "English" },
    { id: "de", text: "Deutsch" },
    { id: "es", text: "Español" },
    { id: "zh", text: "汉语" },
    { id: "hi", text: "Hindī" },
    { id: "pt", text: "Português" },
    { id: "ru", text: "русский язык" },
]

export const getLanguageNameById = (localeId: string) => {
    let res = localeId;
    localeArray.forEach(val => {
        if (localeId === val.id)
            res = val.text;
    })
    return res;
}

export const getLanguageById = (localeId: string) => {
    return localeArray.find(val => val.id === localeId);
}

// export const getLanguageThemeById = (localeId: string) => {
//     let res: SupportedLocales = "enUS";
//     localeArray.forEach(val => {
//         if (localeId === val.id)
//             res = val.themeCode;
//     })
//     return res;
// }
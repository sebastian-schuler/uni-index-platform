export type LinkableCity = {
    State: {
        Country: {
            url: string;
        };
        url: string;
    };
    name: string;
    url: string;
};

export type LinkableInstitution = {
    InstitutionLocation: {
        City: {
            State: {
                Country: {
                    url: string;
                };
            };
        };
    }[];
    name: string;
    url: string;
};

export type LinkableSubject = {
    SubjectHasSubjectTypes: {
        SubjectType: {
            url: string;
        };
    }[];
    url: string;
    name: string;
};

// TODO - add more types
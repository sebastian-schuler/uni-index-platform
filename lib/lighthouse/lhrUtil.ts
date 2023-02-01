export const LHR_SCORE_BREAKPOINTS = {
    good: 75,
    average: 50,
    poor: 0,
}

export const LHR_SCORE_COLORS = {
    good: '#51cf66',
    average: '#ff922b',
    poor: '#ff6b6b',
    informative: '#474747',
}

export const getLhrScoreColor = (score: number) => {
    if (score > LHR_SCORE_BREAKPOINTS.good) {
        return 'green';
    }
    if (score > LHR_SCORE_BREAKPOINTS.average) {
        return 'orange';
    }
    return 'red';
}
export const getScoreColor = (score: number) => {
    if (score >= 90) {
        return 'green';
    }
    if (score >= 50) {
        return 'cyan.5';
    }
    return 'red';
}
type Color = {
    r: number;
    g: number;
    b: number;
}

export const interpolateBetweenColors = (
    fromColor: Color,
    toColor: Color,
    percent: number
) => {
    const delta = percent / 100;
    const r = Math.round(toColor.r + (fromColor.r - toColor.r) * delta);
    const g = Math.round(toColor.g + (fromColor.g - toColor.g) * delta);
    const b = Math.round(toColor.b + (fromColor.b - toColor.b) * delta);

    return `rgb(${r}, ${g}, ${b})`;
};
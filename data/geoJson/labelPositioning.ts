
// Not imported to avoid importing leaflet, smart? 
type Direction = 'right' | 'left' | 'top' | 'bottom' | 'center' | 'auto';

const labelPositioning: Map<string, { direction: Direction, offset: [number, number] }> = new Map([
    ["DE_BE", { direction: "top", offset: [0, 0] }],
    ["DE_HB", { direction: "left", offset: [0, 0] }],
    ["DE_BB", { direction: "bottom", offset: [30,20] }],
    ["DE_RP", { direction: "top", offset: [0,0] }],
    ["DE_NW", { direction: "top", offset: [0,0] }],
    ["DE_HE", { direction: "top", offset: [0,0] }],
    ["DE_MV", { direction: "right", offset: [0,0] }],
    ["DE_SH", { direction: "left", offset: [-30,20] }],
])

export default labelPositioning;
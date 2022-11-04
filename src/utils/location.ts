export interface SourceLocation  {
    row: number;
    col: number;
};
export function createLocation() {
    return { row: 0, col: 0 };
}
export function forkLocation(location: SourceLocation) {
    return { ...location};
}
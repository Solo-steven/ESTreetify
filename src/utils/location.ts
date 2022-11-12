/**
 *  Based on ESTree spec: https://github.com/estree/estree/blob/master/es5.md#node-objects
 *  Source Location is used for mapping tokens or ASTs to original file location.
 */
export interface Position {
    row: number;
    col: number;
};
export function createPosition(): Position {
    return { row: 0, col: 0};
}
export function forkPosition(target: Position): Position {
    return {...target};
}
export interface SourceLocation  {
    start: Position
    end: Position; 
};
export function createLocation() {
    return { start: createPosition(), end: createPosition() }
}
export function forkLocation(location: SourceLocation) {
    return { start: forkPosition(location.start), end: forkPosition(location.end)};
}
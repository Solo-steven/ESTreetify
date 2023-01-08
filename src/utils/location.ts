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
export function clonePosition(target: Position): Position {
    return {...target};
}
export interface SourceLocation  {
    start: Position
    end: Position; 
};
export function createLocation() {
    return { start: createPosition(), end: createPosition() }
}
export function cloneLocation(location: SourceLocation) {
    return { start: clonePosition(location.start), end: clonePosition(location.end)};
}
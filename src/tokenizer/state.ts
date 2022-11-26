import type {Position} from "@/src/utils/location";
import {forkPosition, createPosition} from "@/src/utils/location";
/** 
 *  Context Interface is used for reading Code String
 *  @property {number} pointer: current pointer to code string.
 *  @property {number} position: current position that current pointer is in source file.
 */
 export interface Context {
    position: Position;
    pointer: number;
}
/**
 * this function is utils function that init a Context type Object.
 * @returns {Context} - new context start from 0, current point and position is 0.
 */
export function createContext (): Context {
    return { pointer: 0, position: createPosition()};
}
/**
 * forkContext function is used for forking a exsied context, majorly used 
 * when you need to remainder start context of token.
 * @param {Context} target - target context that you want to fork
 * @returns {Context} - new context in different memory position
 */
export function forkContext(target: Context): Context {
    return { ...target, position: forkPosition(target.position) };
}
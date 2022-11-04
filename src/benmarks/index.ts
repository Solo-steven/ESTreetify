import { performance } from "perf_hooks";

export const benmarkCallback = (callback: CallableFunction) => {
    const start = performance.now();
    callback();
    return performance.now() - start;
}

export default benmarkCallback;
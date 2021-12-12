export type Result = [string, any];
export type DayResults = {
    results: Result[];
    draw?: (node: HTMLElement) => void;
};

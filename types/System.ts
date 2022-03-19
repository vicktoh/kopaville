
export type Checklist = {
    "Complete Profile"?: boolean;
    "Complete Dating Profile"?: boolean;
    "Complete Career Profile"?: boolean;
}


export interface System {
    dateOnboarded: number;
    checkList?: Checklist  
}
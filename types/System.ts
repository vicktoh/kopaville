
type Checklist = {
    "Complete Profile": boolean;
    "Complete Bussiness Profile": boolean;
    "Complete Career Profile": boolean;
}


export interface System {
    dateOnboarded: number;
    checkList?: Checklist
    
}
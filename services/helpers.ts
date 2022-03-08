import { Checklist } from '../types/System';

type ChecklistKeys = keyof Checklist;
const checklistKeys: ChecklistKeys[] = ['Complete Dating Profile', 'Complete Profile', 'Complete Career Profile'];

export const onboardingCheckListComplete = (checklist: Checklist) => {
    const isDone = checklist && checklistKeys.every((value) => checklist[value]);
};
export const countComplette = (checklist: Checklist) => {
    let count = 0;
    checklistKeys.map((key) => {
        if (checklist[key]) {
            count += 1;
        }
    });
    return count;
};

export const getInitialsFromName = (name: string) => {
    const names = name.split(" ");
    const initial = `${names[0][0]}${names[1] ? names[1][0] : ""}`
    return initial
};

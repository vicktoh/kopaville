import { Profile } from '../types/Profile';
import { Checklist } from '../types/System';
import firebae from 'firebase';
import { format, formatDistanceToNow, intervalToDuration } from 'date-fns';
type ChecklistKeys = keyof Checklist;
const checklistKeys: ChecklistKeys[] = ['Complete Dating Profile', 'Complete Profile', 'Complete Career Profile'];

export const onboardingCheckListComplete = (checklist: Checklist) => {
    const isDone = checklist && checklistKeys.every((value) => checklist[value]);
    return isDone
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

export const checkListFromProfile = (profile: Profile)=>{
    const checkList: Checklist = {
        "Complete Career Profile": !!profile.careerProfile,
        "Complete Dating Profile": !!profile?.datingProfile,
        "Complete Profile": !!profile.profile
    }
    return checkList;
}

export const chatTime = (chatTimestamp: firebae.firestore.Timestamp) => {
    const interval = intervalToDuration({start: chatTimestamp.toDate(), end: new Date()});
    if(interval.days && interval.days > 3){
        return format(chatTimestamp.toDate(), "qMMM yy 'at' kk:mm")
    }
    return formatDistanceToNow(chatTimestamp.toDate(), {addSuffix: true})
}

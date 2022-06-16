import React, { FC, useState } from 'react';
import firebase from 'firebase';
import { HomeStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Button,
    Flex,
    Heading,
    Text,
} from 'native-base';
import { reportPost, reportUser } from '../services/postsServices';
import { useAppSelector } from '../hooks/redux';
import { Report, ReportedUser } from '../types/Report';
import { EmptyState } from '../components/EmptyeState';

const REPORT_REASONS = [
    'Malicious Content',
    'Sexual Activity and Nudity',
    'Falsehood and Missinformation',
    'Violence',
    'Hate Speech',
    'Sale of Illegal Goods',
];
const REPORT_USER_REASONS = [
    "It's a spam account",
    'Appears account has been hacked',
    'Inpersonating someone else',
    'Abusive or hateful',
    'Expressing intentions of self-harm or suicide',
];

type ReportScreenProps = NativeStackScreenProps<HomeStackParamList, 'Report'>;

export const ReportPostScreen: FC<ReportScreenProps> = ({
    navigation,
    route,
}) => {
    const { post, user } = route.params;
    const {auth, profile} = useAppSelector(({ auth, profile }) => ({auth, profile}));
    const [seletedReason, setSelectedReason] = useState<number>();
    const [selectedUserReason, setSelectedUserReason] = useState<number>();
    const [isReporting, setReporting] = useState<boolean>(false);

    const reportAPost = async () => {
        if (seletedReason == undefined || !post) return;
        const report: Report = {
            post,
            reporter: {
                displayName: auth?.displayName || '',
                photoUrl: profile?.profileUrl || '',
                userName: profile?.loginInfo.username || '',
                userId: auth?.userId || ""
            },
            reason: REPORT_REASONS[seletedReason],
            date: firebase.firestore.Timestamp.now(),
        };
        setReporting(true);
        await reportPost(report);
        setReporting(false);
        navigation.goBack();
    };
    const reportAUser = async () => {
        if (selectedUserReason == undefined || !user) return;
        try {
            const report: ReportedUser = {
                user,
                date: firebase.firestore.Timestamp.now(),
                reporter: {
                    displayName: auth?.displayName || '',
                    photoUrl: profile?.profileUrl || '',
                    userName: profile?.loginInfo.username || '',
                    userId: auth?.userId || "",
                },
                reason: REPORT_USER_REASONS[selectedUserReason],
            };
            setReporting(true);
            await reportUser(report);
        } catch (error) {
            console.log(error);
        } finally {
            setReporting(false);
            navigation.goBack();
        }
    };
    if (user)
        return (
            <Flex flex={1} px={5} pt={2} bg="white">
                <Text
                    fontSize="lg"
                    my={4}
                >{`Help us Understand the problem and the reason you are reporting @${user.loginInfo.username}`}</Text>
                <Flex flex={1}>
                    {REPORT_USER_REASONS.map((reason, i) => (
                        <Button
                            key={`reason-${i}`}
                            my={2}
                            size="lg"
                            bg={
                                i === selectedUserReason
                                    ? 'primary.200'
                                    : 'secondary.200'
                            }
                            onPress={() => setSelectedUserReason(i)}
                        >
                            {reason}
                        </Button>
                    ))}

                    <Button
                        isLoading={isReporting}
                        disabled={selectedUserReason == undefined}
                        size="lg"
                        mt={3}
                        onPress={reportAUser}
                    >
                        Report User
                    </Button>
                </Flex>
            </Flex>
        );

    if (post)
        return (
            <Flex flex={1} px={5} pt={2} bg="white">
                <Heading>{`Report post by ${post.avartar.username}`}</Heading>

                <Heading fontSize="sm" mt={5}>
                    Reason for Report
                </Heading>

                <Flex flex={1}>
                    {REPORT_REASONS.map((reason, i) => (
                        <Button
                            key={`reason-${i}`}
                            my={2}
                            size="lg"
                            bg={
                                i === seletedReason
                                    ? 'primary.200'
                                    : 'secondary.200'
                            }
                            onPress={() => setSelectedReason(i)}
                        >
                            {reason}
                        </Button>
                    ))}

                    <Button
                        isLoading={isReporting}
                        disabled={seletedReason == undefined}
                        size="lg"
                        mt={3}
                        onPress={reportAPost}
                    >
                        Report Post
                    </Button>
                </Flex>
            </Flex>
        );
    return <EmptyState title="Something went wrong" />;
};

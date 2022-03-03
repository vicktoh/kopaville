import React, { FC, useState } from 'react';
import {
    ScrollView,
    IconButton,
    Image,
    Heading,
    Flex,
    ArrowBackIcon,
    Avatar,
    HStack,
    VStack,
    Text,
    Button,
    Icon,
    useDisclose,
} from 'native-base';
import { Business, Education, Profile } from '../types/Profile';
import { getInitialsFromName } from '../services/helpers';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Modal, useWindowDimensions } from 'react-native';
import { EditCarreerInfoForm } from './EditCarreerInfoForm';
import { EducationForm } from './EducationForm';
import { BussinessForm } from './BussinessForm';

interface CareerProfileProps {
    profile: Profile;
}

export const CareerProfile: FC<CareerProfileProps> = ({ profile }) => {
    const auth = useAppSelector(({ auth }) => auth);
    const Dimenstions = useWindowDimensions();
    const { profile: generalProfile, careerProfile, loginInfo, userId, profileUrl } = profile;
    const { followers = 0, following = 0 } = profile?.followerships || {};
    const navigation = useNavigation();
    const { isOpen: carreerModalOpen, onClose: onCloseCarreerModal, onOpen: onOpenCareerModal } = useDisclose();
    const { isOpen: educationModalOpen, onClose: onCloseEducationMoal, onOpen: onOpenEducationModal } = useDisclose();
    const { isOpen: bussinessModalOpen, onClose: onCloseBussinessModal, onOpen: onOpenBussinessModal } = useDisclose();
    const { isOpen: cvModalOpen, onClose: onCloseCVModal, onOpen: onOpenCVModal } = useDisclose();

    const [educationMode, setEductationMode] = useState<"add"|"edit">('add');
    const [bussinessMode, setBussinessMode] = useState<"add"| "edit">('add');
    const [bussinessToEdit, setBussinessToEdit] = useState<{bussiness: Business, index: number}| undefined>();
    const [educationToEdit, setEducationToEdit] = useState<{ education: Education, index: number}| null>();

    const onEditEducation = ( education: Education, i: number)=> {
        setEductationMode('edit');
        setEducationToEdit({education, index: i});
        onOpenEducationModal();
    }

    const onAddEditEducation = ()=>{
        setEductationMode('add');
        setEducationToEdit(undefined);
        onOpenEducationModal()
    }

    const onEditBussiness = (bussiness: Business, index: number) =>{
        setBussinessMode('edit');
        setBussinessToEdit({bussiness, index});
        onOpenBussinessModal();
    
    }

    const onAddBuissiness = ()=>{
        setBussinessMode('add');
        setBussinessToEdit(undefined);
        onOpenBussinessModal();
    }
    return (
        <ScrollView flex={1} bg="white" px={3}>
            <Flex flex={1} safeArea bg="white">
                <Flex direction="row" alignItems="flex-end" py={3}>
                    <IconButton size="md" icon={<ArrowBackIcon />} onPress={() => navigation.goBack()} />
                    <Heading ml={10} fontSize="lg">
                        Career Profile
                    </Heading>
                </Flex>
                <HStack alignItems="center" space={3}>
                    <Avatar size="lg" source={{ uri: profileUrl }}>
                        {getInitialsFromName(auth?.displayName || '')}
                    </Avatar>
                    <VStack>
                        <Heading>{auth?.displayName || ''}</Heading>
                        {loginInfo?.username ? <Text fontSize="md">{`@${loginInfo?.username}`}</Text> : null}
                    </VStack>
                </HStack>
                <HStack _text={{ fontSize: 'md' }} space={2} mt={3}>
                    <Text fontSize="md" fontWeight="bold">
                        {followers}
                    </Text>
                    <Text fontSize="md">Following</Text>
                    <Text fontSize="md" fontWeight="bold">
                        {following}
                    </Text>
                    <Text fontSize="md">Followers</Text>
                    {generalProfile?.servingState ? (
                        <Text fontSize="md">{`📍 ${generalProfile.servingState}`} </Text>
                    ) : null}
                </HStack>
                <HStack mt={3}>
                    {auth?.userId === profile.userId ? (
                        <Button variant="outline" colorScheme="primary" onPress={() => onOpenCareerModal()}>
                            Edit
                        </Button>
                    ) : (
                        <Button variant="solid">Follow</Button>
                    )}
                </HStack>

                <Heading size="sm" mb={2} mt={5} color="primary.400">
                    Profile
                </Heading>
                {careerProfile?.profile ? (
                    <Text fontSize="md">{careerProfile.profile}</Text>
                ) : (
                    <Text fontWeight="semibold" color="muted.500">
                        No Career Profile Yet 💼
                    </Text>
                )}
                <Flex direction="row" mt={5}>
                    {careerProfile?.cvUrl ? (
                        <Button
                            variant="secondary"
                            rounded="full"
                            leftIcon={<Icon size="sm" as={AntDesign} name="filetext1" />}
                            display="flex"
                            bg="secondary.100"
                            _text={{ color: 'primary.500', fontSize: 'md' }}
                            onPress= {onOpenCVModal}
                        >
                            Resume
                        </Button>
                    ) : null}
                </Flex>

                <HStack mt={5} alignItems="center" justifyContent="space-between" space={5} mb={5}>
                    <Heading size="sm" color="primary.400">
                        Education
                    </Heading>
                    {auth?.userId === profile.userId ? (
                        <Button variant="outline" size="xs" onPress={onAddEditEducation}>
                            Add
                        </Button>
                    ) : null}
                </HStack>
                {careerProfile?.education && careerProfile.education.length ? (
                    careerProfile?.education.map(({ institution, period, qualification }, i) => (
                        <Flex key={`education-${i}`} direction="column" borderBottomWidth={1} mt={3}  borderBottomColor="secondary.400">
                            <Flex direction="row" justifyContent="space-between">
                                <Heading fontSize="md" maxWidth={Dimenstions.width *.6}>{institution}</Heading> <Text fontSize="sm" color="primary.400">{`${period.start} - ${period.end}`}</Text>
                            </Flex>
                            <Flex direction = "row" justifyContent="space-between">
                                <Text fontSize="sm" mt = {1}>{qualification}</Text>
                                {
                                    auth?.userId === profile.userId ? (
                                        <Button variant="link" onPress={()=> onEditEducation({institution, period, qualification}, i)} >edit</Button>
                                    ):
                                    null
                                }
                            </Flex>
                        </Flex>
                    ))
                ) : (
                    <Text fontWeight="semibold" color="muted.500" mt={3}>
                        No Education Profile added 🎓
                    </Text>
                )}
                <HStack mt={5} alignItems="center" space={5} justifyContent="space-between">
                    <Heading size="sm" color="primary.400">
                        Bussiness
                    </Heading>
                    {auth?.userId === profile.userId ? (
                        <Button variant="outline" size="xs" onPress={onAddBuissiness}>
                            Add
                        </Button>
                    ) : null}
                </HStack>
                {careerProfile?.business && careerProfile.business.length ? (
                    careerProfile?.business.map(({ name, twitter, link, instagram }, i) => (
                        <Flex key={`business-${i}`} direction="column" borderBottomWidth={1} borderBottomColor="secondary.400" mt={3}>
                            <Flex direction = "row" alignItems="center" justifyContent="space-between" mb={1}>
                                <Heading fontSize="md">{name}</Heading>
                                {
                                    auth?.userId === profile.userId ? (
                                        <Button variant="link" onPress={()=> onEditBussiness({name, twitter, instagram, link}, i)} >edit</Button>
                                    ):
                                    null
                                }
                            </Flex>
                            <HStack alignItems="flex-end" justifyContent="flex-start" space={2}>
                                {link ? (
                                    <Button variant="link" leftIcon={<Icon size="xs" as={AntDesign} name="link" />}>
                                        Website
                                    </Button>
                                ) : null}
                                {twitter ? (
                                    <Button variant="link" leftIcon={<Icon size="xs" as={AntDesign} name="instagram" />}>
                                        Twitter
                                    </Button>
                                ) : null}
                                {instagram ? (
                                    <Button variant="link" leftIcon={<Icon size="xs" as={Feather} name="twitter" />}>
                                        Instagram
                                    </Button>
                                ) : null}
                                
                            </HStack>
                        </Flex>
                    ))
                ) : (
                    <Text fontWeight="semibold" color="muted.500" mt={3}>
                        No Bussiness Profile added 📆
                    </Text>
                )}
                <Modal visible={carreerModalOpen} transparent={true} animationType="slide">
                    <Flex marginTop="auto" bg="white" px={5} py={10} borderRadius="2xl" shadow="4">
                        <Heading>Edit Career</Heading>
                        <EditCarreerInfoForm onClose={onCloseCarreerModal} carreerProfile={careerProfile} />
                    </Flex>
                </Modal>
                <Modal visible={educationModalOpen} transparent={true} animationType="slide">
                    <Flex marginTop="auto" bg="white" px={5} py={10} borderRadius="2xl" shadow="4">
                        <Heading>Add Education</Heading>
                        <EducationForm onClose={onCloseEducationMoal} education = {educationToEdit ? educationToEdit.education: undefined} mode={educationMode} index = {educationToEdit ? educationToEdit.index : undefined}  />
                    </Flex>
                </Modal>
                <Modal visible={bussinessModalOpen} transparent={true} animationType="slide">
                    <Flex marginTop="auto" bg="white" px={5} py={10} borderRadius="2xl" shadow="4">
                        <Heading>Add Businness</Heading>
                        <BussinessForm onClose={onCloseBussinessModal} business = {bussinessToEdit ? bussinessToEdit?.bussiness: undefined} mode={bussinessMode} index = {bussinessToEdit ? bussinessToEdit.index : undefined}  />
                    </Flex>
                </Modal>
                <Modal visible={cvModalOpen}  animationType="slide">
                    <Flex direction="column" flex = {1} bg="white" px={5} py={10} borderRadius="2xl" shadow="4">
                        <Image flex={1} source = {{uri: careerProfile?.cvUrl}} alt = "Resume Image" />
                        <Button variant="outline" onPress={onCloseCVModal}>Close</Button>
                    </Flex>
                </Modal>
            </Flex>
        </ScrollView>
    );
};

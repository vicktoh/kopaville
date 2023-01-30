import { useNavigation } from '@react-navigation/native';
import { Button, ChevronLeftIcon, Flex, Heading, IconButton, Input, Text, Toast, useToast } from 'native-base'
import React, { FC, useState } from 'react'
import { SUPPORT_EMAIL } from '../constants/Storage';
import { useAppSelector } from '../hooks/redux';
import { useLogout } from '../hooks/useLogOut';
import { deleteAccount, logOut } from '../services/authServices';
type DeleteAccountProps = {
   onClose: () => void;
}
export const DeleteAccount: FC<DeleteAccountProps> = ({onClose}) => {
   const [email, setEmail] = useState('');
   const [deleting, setDeleting] = useState<boolean>();
   const {profile} = useAppSelector((profile)=> profile);
   const toast = useToast();
   const logoutFlow = useLogout();


   const onDeleteAccount = async ()=> {
      try {
      setDeleting(true);
      await deleteAccount();
      await logoutFlow()
      } catch (error) {
         const err: any = error;
         toast.show({
            title: "Could not delete account",
            description: `We could not delete your account for some reason. Please try again. if problem persist please contact ${SUPPORT_EMAIL} for support`
         })
      } finally{
         setDeleting(false);
      }
   }
  return (
      <Flex flex={1} bg="white" px={5} pt={5} safeArea>
         <IconButton icon={<ChevronLeftIcon />} my={3} onPress={onClose} alignSelf="flex-start" />
          <Heading fontSize="lg" mb={5} alignSelf="center">
              Delete my account and data
          </Heading>
          <Text>
              By deleting your account all posts, conversations, comments and
              pending orders, will be deleted from our systems. If you have
              pending orders please contact '' You can create your account again
              when you want to. We are sad to see you go 🙁 hope you come back
              soon{' '}
          </Text>

          <Flex direction="column" mt={5}>
              <Text fontSize="sm" color="red.500">
                  To ensure this action is delibrate and not a mistake please
                  enter your email address in the box below
              </Text>
              <Input
                  placeholder={profile?.loginInfo.email || ''}
                  size="lg"
                  my={3}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
              />
              <Button my={3} onPress={onClose}>Cancel</Button>
              <Button
                  disabled={profile?.loginInfo.email !== email}
                  my={3}
                  onPress={onDeleteAccount}
                  colorScheme="red"
                  isLoading={deleting}
                  variant={profile?.loginInfo.email !== email ? "ghost" : "solid"}
              >
                  Delete My Account
              </Button>
              
          </Flex>
      </Flex>
  );
}

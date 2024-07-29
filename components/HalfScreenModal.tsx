import { Flex, Heading } from 'native-base';
import React, { FC, ReactElement, ReactNode } from 'react'
import { Modal, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
type HalfScreenModalProps = {
   isOpen: boolean;
   onClose: () => void;
   title: string;
   children: ReactNode;
}
export const HalfScreenModal: React.FC<HalfScreenModalProps> = ({
   isOpen, onClose, children, title
}) => {
  return (
      <Modal visible={isOpen} animationType="fade" style={{backgroundColor: 'blue'}} transparent>
          <Flex safeArea  flex={1} >
              <Flex flex={1} backgroundColor="transparent" borderColor="red.100" borderWidth="1">
                  <TouchableOpacity
                      style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: 'rgba(0,0,0,0.3)',
                      }}
                      onPress={onClose}
                  ></TouchableOpacity>
              </Flex>
              <Flex flex={1} backgroundColor="white" shadow="1" borderRadius="lg" px={2} py={5}>
                  <Heading fontSize="md">{title}</Heading>
                  {children}
              </Flex>
          </Flex>
      </Modal>
  );
}

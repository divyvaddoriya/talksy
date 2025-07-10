import { ChatState } from '@/context/ChatProvider'
import { Box } from '@chakra-ui/react';
import React from 'react'
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain ,setFetchAgain}) => {

  const {selectedChat} = ChatState(); 

  return (
      <Box display={{base: selectedChat ? "flex" : "none" , md: "flex"}}
      flexDir="column"
      p={3}
      alignItems={"center"}
      bg="black"
      textColor={"white"}
      w={{base: "100%" , md: "68%"}}
      h={"full"}
      borderRadius={"lg"}
      borderWidth={"1px"}
>
   <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </Box>
  )
}

export default ChatBox
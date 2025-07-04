import React, { useEffect } from 'react'
import axios from 'axios';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import { getSender } from '@/config/chatlogic';
import { Plus } from 'lucide-react';
import { ChatState } from '@/context/chatProvider.jsx';
import GroupChatModal from './GroupChatModal';
import { BaseUrl } from '@/constant';

const MyChats = ({fetchAgain}) => {
    const {user , chats, setChats , selectedChat , setSelectedChat } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
    // console.log(user._id);
    try {
      // console.log("user from my chats" + user );
       
     const config = {
            headers: {
                Authorization : `Bearer ${user.token}`,
            },
        };

      const { data } = await axios.get(`${BaseUrl}/api/Chat`, config);
      console.log(data);
      
      setChats(data);
        toast({
        title: "Chat loadded!",
        description: " Loading chat succesfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-left"
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    return;
  };

 

  useEffect(() => {
    // setLoggedUser(user);
  if (user) {
    fetchChats();
  }
},[user , fetchAgain]);

  return (
    <Box display={{base: selectedChat ? "none"  : "flex", md:"flex"}}
    flexDir={"column"}
    alignItems={"center"}
    p={3}
    h="full"
    bg="black"
    textColor={"white"}
    w={{base:"100%" , md:"31%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
      
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal fetchChats={fetchChats}>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<Plus />}
          >
            New Group Chat
          </Button>
        </GroupChatModal >
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="black"
        borderWidth={"1"}
        borderColor={"white"}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"

      >
        {chats ? (
          <Stack overflowY="scroll"
  sx={{
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  }}>
            {chats.map((chat) =>
            (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"  
                bg={selectedChat === chat ? "#38B2AC" : "wheat"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text 
                fontSize={"2xl"}
                fontWeight={700}
>
                  {/* {console.log("chat users from my chat compo " + chat.users)} */}
              
                  {!chat.isGroupChat && user && Array.isArray(chat.users) && chat.users.length === 2
  ? getSender(user, chat.users)
  : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text  fontSize={"sm"}
                fontWeight={500} >
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>

    </Box>
  )
}

export default MyChats;
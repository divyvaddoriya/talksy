import { Box, HStack } from '@chakra-ui/react';
import ChatBox from '@/components/ChatBox';
import MyChats from '@/components/MyChats';
import SideDrawer from '@/components/SideDrawer';
import { useState } from 'react';

const ChatPage = () => {
  // Mock user data - replace with actual context
  const user = JSON.parse(localStorage.getItem("userInfo"));
//   console.log(user);
    const [fetchAgain , setFetchAgain] = useState(false);
  return (
    <Box w="100%" bg="blackAlpha.900" textColor={"white"}>
    <SideDrawer />
   { user &&  
      <HStack 
        justifyContent="space-between" 
        p={4} 
        gap={4}
        w={"100%"}
        align="flex-start"
        h="91vh"
      >
        <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </HStack> }
    </Box>
  );
};

export default ChatPage;

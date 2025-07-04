import { getSender, getSenderFull } from '@/config/chatlogic';
import { ChatState } from '@/context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBigLeftIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import { BaseUrl } from '@/constant';
import { useRef } from 'react';
import Lottie from 'react-lottie';
import typingAnimation from "../assets/lottie.json"
const SingleChat = ({fetchAgain ,setFetchAgain}) => {

const socket = useRef(null);

 let selectedChatComapare;

 const defaultOptions ={
  loop: true,
  autoplay: true,
  animationData: typingAnimation,
  rendererSettings: {
    preserveAspectRatio : "xMidYMid slice"
  }
 } 

    const [messages , setMessages] = useState([]);
    const [loading, setLoading] =useState(false);
    const [newMessage,setNewMessage  ] = useState("");
    // const [socket , setSocket] = useState();
    const [socketConnected , setSocketConnected] = useState(false);
    const [typing , setTyping] = useState(false);
    const [isTypinig , setIsTyping] = useState(false);

    const {user , selectedChat , setSelectedChat , notification , setNotification} = ChatState();

     useEffect(() => {
  socket.current = io(BaseUrl);
  socket.current.emit("setup", user);
  
  socket.current.on("connected", () => {
    setSocketConnected(true);
    console.log("Socket connected");
  });
socket.current.on("typing" , ()=> setIsTyping(true))
socket.current.on("stop typing" , ()=> setIsTyping(false))

  return () => {
    socket.current.disconnect();
  };
}, []);

    useEffect(()=>{
        fetchMessages();

        selectedChatComapare = selectedChat;

    }, [selectedChat])


    useEffect(()=>{
      socket.current.on('message recieved' , (newmsgRecieved)=>{
        if(!selectedChatComapare || selectedChatComapare._id != newmsgRecieved.chat._id ){
          // give notification
          if(!notification.includes(newmsgRecieved)){
            setNotification((prev) => [...prev  , newmsgRecieved]);
            setFetchAgain(!fetchAgain);
          }
        }else{      
        setMessages((messag) =>[...messag , newmsgRecieved]);
        }
      })
    })

    const toast = useToast();

    const typingHandler = (e) =>{
        setNewMessage(e.target.value);

        // typing indicator logic
        if(!socketConnected) return;

        if(!typing){
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }

        let lastTimeTyping = new Date().getTime();
        let timelength = 3000;

        setTimeout(()=>{
          let timeNow = new Date().getTime();
          let timeDifference = timeNow - lastTimeTyping;
          if(timeDifference >= timelength && typing){
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
          }
        } , timelength)
    }
    const sendMessage=async (event)=>{

      socket.current.emit("stop typing" , selectedChat._id);

        if(event.key === "Enter" && newMessage){
            try {
                 
     const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${user.token}`,
            },
        };

      const { data } = await axios.post("/api/message", {content: newMessage ,
        chatId: selectedChat._id
      } , config);
    //   console.log(data);

    
    socket.current.emit("new message" , data );
    
    setNewMessage("");
      setMessages((prev) => [...prev , data]);
        
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
}

    const fetchMessages = async(req ,res)=>{

        
        if(!selectedChat) return ;

try {
             const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`,
                },
            };
            setLoading(true)
            
            const {data} = await axios.get(`/api/message/${selectedChat._id}` , config);
            setMessages(data);
            setLoading(false)
            console.log(data); 

            socket.current.emit('join room',selectedChat._id);
} catch (error) {
    toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom", 
    })
}
    }

   
  return (
    <>
    {selectedChat ? ( <>

        <Text
            fontSize={{ base: "28px", md: "30px" }}
            w="100%"
            bg="black" 
            textColor="white"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBigLeftIcon/>}
              onClick={() => setSelectedChat("")}
            />
             {messages &&
              
             (!selectedChat.isGroupChat && user && Array.isArray(selectedChat.users) && selectedChat.users.length === 2 ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat?.chatName?.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))
            }
          </Text>
              <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={"3"}
            bg="wheat"
            textColor={"black"}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box
  flex="1"
  overflowY="auto"
  display="flex"
  flexDirection="column"
>
  <ScrollableChat messages={messages} />
</Box>
            )}


            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
               { isTypinig ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}

                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
                  ) : (
                <></>
              )}
              <Input
                variant="filled"
                 bg="black" textColor="white"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
    ) : (
        
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat;
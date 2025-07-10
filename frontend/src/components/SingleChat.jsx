import { getSender, getSenderFull } from '@/config/chatlogic';
import { ChatState } from "@/context/ChatProvider";
import {
  Box, FormControl, IconButton, Input, Spinner,
  Text, useToast
} from '@chakra-ui/react';
import { ArrowBigLeftIcon, Loader2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import { BaseUrl } from '@/constant';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const socket = useRef(null);
  const selectedChatCompare = useRef();


  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const toast = useToast();

  useEffect(() => {
    socket.current = io(BaseUrl);
    socket.current.emit("setup", user);

    socket.current.on("connected", () => {
      setSocketConnected(true);
    });

    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    selectedChatCompare.current = selectedChat;
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (!socket.current) return;

    const handleMessageReceived = (newMsgReceived) => {
      if (
        !selectedChatCompare.current ||
        selectedChatCompare.current._id !== newMsgReceived.chat._id
      ) {
        setNotification((prevNotifs) => {
          const exists = prevNotifs.some(msg => msg._id === newMsgReceived._id);
          if (exists) return prevNotifs;
          return [...prevNotifs, newMsgReceived];
        });
        setFetchAgain(prev => !prev);
      } else {
        setMessages(prev => [...prev, newMsgReceived]);
      }
    };

    socket.current.on('message recieved', handleMessageReceived);

    return () => {
      socket.current.off('message recieved', handleMessageReceived);
    };
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const now = new Date().getTime();
      const timeDiff = now - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.current.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.current.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id
        }, config);

        socket.current.emit("new message", data);
        setNewMessage("");
        setMessages((prev) => [...prev, data]);

      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.current.emit("join room", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
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
              icon={<ArrowBigLeftIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat &&
                Array.isArray(selectedChat.users) &&
                selectedChat.users.length === 2 ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName?.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
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
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <Box flex="1" overflowY="auto" display="flex" flexDirection="column">
                <ScrollableChat messages={messages} />
              </Box>
            )}

              {isTyping && (
                <div>
                  
                  <Loader2 />
                </div>
              )}
            <FormControl bg={"black"} textColor={"white"} onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="black"
                textColor="white"
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
  );
};

export default SingleChat;

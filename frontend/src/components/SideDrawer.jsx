import React from "react";
import { ChatState } from "@/context/chatProvider";
import {
  Button,
  Tooltip,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Bell, Search, User, User2 } from "lucide-react";
import  { useState } from "react";
import { RiNotificationBadgeFill, RiNotificationBadgeLine, RiProfileFill } from "react-icons/ri";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "@/config/chatlogic";
import { BiNotification } from "react-icons/bi";



const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  
  const {user, setSelectedChat , chats , setChats , notification , setNotification} = ChatState();
//   console.log(user);
  
  const navigate = useNavigate();

  const {isOpen ,onClose , onOpen} =useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const toast = useToast(); 
  const accessChat =async (userId)=>{
        try {
          console.log("accesschat" +user?.token);
          
            setLoadingChat(true);
        const config = {
          headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
        // console.log(userId);
        
        const {data} = await axios.post("api/chat" , {userId} , config);
      
        if(!chats.find((c)=> c._id === data._id)) {
          setChats([data , ...chats]);
        }
        console.log(data);
        
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();

        } catch (error) {
            toast({
             title: "Error occured",
             description: error.message,
            status: "error",
            duration : 5000,
            isClosable: true,
            position: "bottom-left"
        })
        return;
        } 
  }

  
 
  const handlesearch =async () => {
    if(!search){
        toast({
            title: "please enter something in search ",
            status: "warning",
            duration : 5000,
            isClosable: true,
            position: "top-left"
        })
        return;
    }

    try {
        setLoading(true);
      console.log(user);
      
        const config = {
            headers: {
                Authorization : `Bearer ${user.token}`,
            },
        };

        const {data} = await axios.get(`/api/user?search=${search}` , config);
        console.log("search" + data);
        setLoading(false);
        setSearchResult(data);
        return;
    } catch (error) {
        toast({
             title: "Error occured",
             description: error.message,
            status: "error",
            duration : 5000,
            isClosable: true,
            position: "bottom-left"
        })
        return;
    }
  }

  return (
    <div >
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="black"
        textColor={"white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"1px"}
       borderRadius={"5"}
      >
        <Tooltip
          label="Search user for chat"
          hasArrow
          placeContent={"bottom-end"}
        >
          <Button bg={"black"} textColor={"white"} borderColor={"white"} borderWidth={"1"} 
          _hover={{
            bg: "white" , 
            textColor: "black"
          }}
          onClick={onOpen} variant={"ghost"}>
            <Search />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"work sans"}>
          Talksy
        </Text>

        <Box borderRadius={"1"} borderColor={"white"}>
          <Menu bg="black" textColor="white">
            <MenuButton p={"2"}>
              {/* <BiNotification repeatCount={notification.length}/> */}
              <Bell />
            </MenuButton>

             <MenuList pl={2} >
              {!notification.length && "No new Messages"}
              {notification.map((notif) =>(
                <MenuItem key={notif._id} onClick={()=>{
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n!==notif));
                }}>
                  {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}` : `New Message From ${getSender(user , notif.chat.users)}`}
                </MenuItem>
              ))}
             </MenuList>
          </Menu>

          <Menu bg="black" textColor="white">
            <MenuButton  bg="black" textColor="white" borderColor={"white"} as={Button} rightIcon={<User />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>

            <MenuList  bg="black" textColor="white">
              <ProfileModal user={user}>
                <MenuItem  bg="black" textColor="white">My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem  bg="black" textColor="white" onClick={() => logoutHandler()}>log out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth={"1px"} >Search Users</DrawerHeader>
            <DrawerBody>
                <Box display={"flex"} pb={2} >
                    <Input placeholder="search by name or email" mr={2} value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <Button
                     onClick={handlesearch}
                     >Go</Button>
                </Box>

            {loading ? (
                    <ChatLoading />
            ) : (
                searchResult?.map(user => (
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() =>{
                      console.log("this is clicked");
                      accessChat(user._id)
                    }}
                    />
                ))
            )}

            </DrawerBody>

            {loadingChat && <Spinner display={"flex"} ml={"auto"} />}
                        </DrawerContent>

      </Drawer>
    </div>
  );
};

export default SideDrawer;

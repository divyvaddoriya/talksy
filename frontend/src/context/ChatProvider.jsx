import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Initialize from localStorage immediately (no useEffect needed)
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  });

  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification  , setNotification] = useState([]);

  // ✅ Redirect only if user is not available
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);
   
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification, 
        setNotification
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;

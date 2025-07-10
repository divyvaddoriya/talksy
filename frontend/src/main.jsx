import React from "react"
import ReactDOM from "react-dom/client"
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import ChatProvider from "./context/chatProvider.jsx"
import axios from "axios"
import { BaseUrl } from "./constant.js"

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

axios.defaults.baseURL = BaseUrl;

const theme = extendTheme({ config })

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
       <ChatProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
)

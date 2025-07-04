import React from "react"
import {
  Box,
  Button,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import Login from "@/components/Login.jsx"
import Register from "@/components/Register.jsx"
const HomePage = () => {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-r, gray.900, gray.800)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Container maxW="sm" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          p={2}
          bg="gray.700"
          w="100%"
          mb={4}
          borderRadius="md"
          boxShadow="md"
        >
          <Text fontSize="2xl" fontFamily="heading" color="white">
            Talksy
          </Text>
        </Box>

        <Box
          bg="gray.800"
          w="100%"
          p={4}
          borderRadius="md"
          boxShadow="lg"
          color="white"
        >
          <Tabs variant="soft-rounded" colorScheme="blue" isFitted size="sm">
            <TabList mb="0.5em">
              <Tab fontSize="sm">Login</Tab>
              <Tab fontSize="sm">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={2}>
                <Login />
              </TabPanel>
              <TabPanel p={2}>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage

import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const ScrollableFeed = ({ children }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <Box
      w="100%"
      h="100%"
      overflowY="auto"
      p={3}
      display="flex"
      flexDirection="column"
      scrollBehavior="smooth"
       sx={{
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',  // IE and Edge
    'scrollbar-width': 'none',     // Firefox
  }}
    >
      {children}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ScrollableFeed;

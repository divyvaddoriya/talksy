import { Badge } from "@chakra-ui/react";
import { Circle, Cross, X } from "lucide-react";
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      display={"flex"}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={16}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <X pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
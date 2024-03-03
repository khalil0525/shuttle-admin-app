import React from "react";
import {
  Flex,
  Box,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
} from "@chakra-ui/react";

import { NavLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import {
  FaBus,
  FaBook,
  FaChalkboard,
  FaUserCog,
  FaGlobe,
} from "react-icons/fa";
import { PiBusThin } from "react-icons/pi";

const Navbar = ({ logout, user, userPerms }) => {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      zIndex="10">
      <Flex
        align="center"
        direction={["column", "column", "row", "row"]}
        justify={["center", "space-between"]}
        bgColor="#2596be"
        p="0.8rem 0.8rem">
        <Center
          flex="0"
          display={{ base: "flex", sm: "flex", md: "none", lg: "none" }}>
          <ChakraLink
            as={NavLink}
            to="/"
            _activeLink={{ fontWeight: "semibold", color: "#000" }}>
            <PiBusThin style={{ fontSize: "48px" }} />
          </ChakraLink>
        </Center>
        <Box
          flex="0 1 100px"
          display={{ base: "none", md: "flex" }}
          alignItems="center">
          {" "}
          <ChakraLink
            as={NavLink}
            to="/"
            _activeLink={{ fontWeight: "semibold", color: "#000" }}>
            <PiBusThin style={{ fontSize: "48px" }} />
          </ChakraLink>
        </Box>
        {user?.id && (
          <Flex
            align="center"
            justify={["space-evenly", "space-between"]}
            w="100%">
            <Flex
              flex={["1 0 60%", "1 0 80%"]}
              align="center"
              justify="center"
              bgColor="#2596be"
              direction={["row"]}
              h="50px"
              p={[2, 4]}
              color="text"
              gap={["0.8rem", "1.2rem"]}>
              {(userPerms?.find((perm) => perm.tabName === "dispatch")
                ?.canView ||
                user?.isAdmin) && (
                <ChakraLink
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  as={NavLink}
                  to="/dispatch"
                  _activeLink={{ fontWeight: "semibold", color: "#000" }}
                  mr={[0, 2]}>
                  <FaBus display={["block", "block", "none", "none"]} />{" "}
                  {/* Icon only on smaller screens */}
                  <Text display={["none", "none", "block", "block"]}>
                    Dispatch
                  </Text>{" "}
                  {/* Text on larger screens */}
                </ChakraLink>
              )}

              {(userPerms?.find((perm) => perm.tabName === "training")
                ?.canView ||
                user?.isAdmin) && (
                <ChakraLink
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  as={NavLink}
                  to="/training"
                  _activeLink={{ fontWeight: "semibold", color: "#000" }}
                  mr={[0, 2]}>
                  <FaBook display={["block", "block", "none", "none"]} />
                  <Text display={["none", "none", "block", "block"]}>
                    Training
                  </Text>
                </ChakraLink>
              )}
              {(userPerms?.find((perm) => perm.tabName === "whiteboard")
                ?.canView ||
                user?.isAdmin) && (
                <ChakraLink
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  as={NavLink}
                  to="/whiteboard"
                  _activeLink={{ fontWeight: "semibold", color: "#000" }}
                  mr={[0, 2]}>
                  <FaChalkboard display={["block", "block", "none", "none"]} />
                  <Text display={["none", "none", "block", "block"]}>
                    Whiteboard
                  </Text>
                </ChakraLink>
              )}
              {user.isAdmin && (
                <ChakraLink
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  as={NavLink}
                  to="/admin"
                  _activeLink={{ fontWeight: "semibold", color: "#000" }}
                  mr={[0, 2]}>
                  <FaUserCog display={["block", "block", "none", "none"]} />
                  <Text display={["none", "none", "block", "block"]}>
                    Admin
                  </Text>
                </ChakraLink>
              )}

              {(userPerms?.find((perm) => perm.tabName === "website")
                ?.canView ||
                user?.isAdmin) && (
                <ChakraLink
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  as={NavLink}
                  to="/website"
                  _activeLink={{ fontWeight: "semibold", color: "#000" }}>
                  <FaGlobe display={["block", "block", "none", "none"]} />
                  <Text display={["none", "none", "block", "block"]}>
                    Website
                  </Text>
                </ChakraLink>
              )}
            </Flex>

            <Menu>
              <MenuButton
                as={Avatar}
                size={["sm", "md"]}
                cursor="pointer"
                src={user.photoURL || ""}
                bg
                position="absolute"
                right="4"
                top="50%"
                transform="translateY(-50%)"></MenuButton>
              <MenuList
                bg="compBg"
                color="text">
                <MenuItem
                  bg="compBg"
                  color="text">
                  <ChakraLink
                    as={NavLink}
                    color="text"
                    to="/settings"
                    _hover={{ bg: "hoverBg", color: "hoverText" }}>
                    User Settings
                  </ChakraLink>
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  bg="compBg"
                  color="text"
                  _hover={{ bg: "hoverBg", color: "hoverText" }}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;

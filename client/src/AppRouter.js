import React, { useCallback, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import SunCalc from "suncalc";

import Dashboard from "./views/Dashboard/Dashboard";
import Admin from "./views/Admin/Admin";
import Recover from "./components/Authentication/Recover";
import Register from "./components/Authentication/Register";
import Home from "./views/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Settings from "./views/Settings/Settings";
import LoginPage from "./components/Authentication/LoginPage";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
import { useSnackbar } from "./context/SnackbarProvider";
import axios from "axios";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import Website from "./views/Website/Website";
import Training from "./views/Training/Training";
import Reset from "./components/Authentication/Reset";

const currentLocation = window.location;

axios.defaults.baseURL = process.env.REACT_APP_URL
  ? process.env.REACT_APP_URL
  : currentLocation.origin;
axios.defaults.withCredentials = true;

function AppRouter({
  themeMode,

  setAndStoreThemeMode,
  setAutoThemeMode,
  autoThemeMode,
}) {
  const [user, setUser] = useState({
    isFetching: true,
  });
  const [userPerms, setUserPerms] = useState(null);
  const { showSuccessToast, showErrorToast } = useSnackbar();
  const [socket, setSocket] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["x-access-token"]);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/auth/login", credentials, {
        withCredentials: true,
      });

      setCookie("x-access-token", data.token, {
        path: "/",
        maxAge: 604800,
      });
      setUser(data);
      showSuccessToast("Successfully logged in!");
    } catch (error) {
      console.error(error);
      setUser({ error: error.response.data.error || "Server Error" });
      showErrorToast(error.response.data.error);
    }
  };

  const logout = async () => {
    try {
      await axios.delete("/auth/logout");
      removeCookie("x-access-token", { path: "/" });

      setUser({});
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };
  const checkAuth = async (token) => {
    try {
      const response = await axios.post(`/auth/password/check-auth/${token}`);
      return response.data;
    } catch (error) {
      console.error("Error checking authentication:", error);
      showErrorToast(error.response.data.error);
      return { valid: false };
    }
  };

  const recoverPassword = async (email) => {
    try {
      await axios.post("/auth/password/recover", {
        email,
      });
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };

  const recoveryChangePassword = async (token, password) => {
    try {
      await axios.post(`/auth/password/set/${token}`, {
        newPassword: password,
      });
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };

  const resetChangePassword = async (token, password, tempPassword) => {
    try {
      await axios.post(`/auth/password/set/${token}`, {
        tempPassword: tempPassword,
        newPassword: password,
      });
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };

  const onAdminChangeName = async (name) => {
    try {
      const { data } = await axios.post(`/auth/name/change`, {
        newName: name,
      });

      setUser((prev) => {
        return { ...prev, name: data.user.name };
      });

      showSuccessToast("Name changed successfully!");
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
      throw error;
    }
  };
  const registerInvitedUser = async (token, password, tempPassword) => {
    try {
      const { data } = await axios.post(`/auth/user/create`, {
        token,
        tempPassword,
        password,
      });
      setCookie("x-access-token", data.token, {
        path: "/",
        maxAge: 604800,
      });
      setUser(data);
      showSuccessToast("Sucessfully logged in!");
    } catch (error) {
      console.error(error);
      setUser({ error: error.response.data.error || "Server Error" });
      showErrorToast(error.response.data.error);
      throw error;
    }
  };
  const changePasswordWithToken = async (password) => {
    try {
      await axios.post(`/auth/password/change`, {
        newPassword: password,
      });
      showSuccessToast("Password successfully changed!");
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
      throw error;
    }
  };
  const isDaytime = () => {
    const now = new Date();
    const times = SunCalc.getTimes(now, "40.7128", "-74.0060");

    return now >= times.sunrise && now <= times.sunset;
  };
  const changeThemeModeBasedOnTime = useCallback(() => {
    if (themeMode === "auto") {
      if (isDaytime()) {
        if (autoThemeMode !== "light") {
          setAutoThemeMode("light");
        }
      } else {
        if (autoThemeMode !== "dark") {
          setAutoThemeMode("dark");
        }
      }
    }
  }, [themeMode, autoThemeMode, setAutoThemeMode]);
  useEffect(() => {
    const fetchUser = async () => {
      setUser((prev) => ({ ...prev, isFetching: true }));
      try {
        const { data } = await axios.get("/auth/user");
        setUserPerms(data.permissions);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setUser((prev) => ({ ...prev, isFetching: false }));
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const newSocket = io(
      process.env.REACT_APP_URL
        ? process.env.REACT_APP_URL
        : "https://portal.occtransport.org"
    );
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    changeThemeModeBasedOnTime();
    const timer = setInterval(changeThemeModeBasedOnTime, 60000);

    return () => clearInterval(timer);
  }, [changeThemeModeBasedOnTime, themeMode]);
  if (user?.isFetching) {
    return (
      <Flex
        height="100vh"
        justifyContent="center"
        alignItems="center">
        <Spinner
          size="xl"
          color="teal.500"
        />
      </Flex>
    );
  }
  return (
    <Router>
      <Box
        bg="compBg"
        minH="100vh">
        <Navbar
          logout={logout}
          user={user}
          userPerms={userPerms}
        />

        <Box>
          <Routes>
            <Route
              path="/"
              element={
                user.id ? (
                  <Home />
                ) : (
                  <LoginPage
                    login={login}
                    recoverPassword={recoverPassword}
                  />
                )
              }
            />
            <Route
              path="/change-password"
              element={
                <Recover
                  recoveryChangePassword={recoveryChangePassword}
                  checkAuth={checkAuth}
                />
              }
            />{" "}
            <Route
              path="/reset-password"
              element={
                <Reset
                  resetChangePassword={resetChangePassword}
                  checkAuth={checkAuth}
                />
              }
            />
            <Route
              path="/set-up-account"
              element={
                !user.id ? (
                  <Register
                    registerInvitedUser={registerInvitedUser}
                    checkAuth={checkAuth}
                  />
                ) : (
                  <Navigate
                    to="/"
                    replace={true}
                  />
                )
              }
            />
            <Route
              path="/admin"
              element={
                user.id && user.isAdmin ? (
                  <Admin
                    socket={socket}
                    user={user}
                    logout={logout}
                    changePasswordWithToken={changePasswordWithToken}
                  />
                ) : (
                  <Navigate
                    to="/"
                    replace={true}
                  />
                )
              }
            />{" "}
            <Route
              path="/settings"
              element={
                user.id ? (
                  <Settings
                    socket={socket}
                    user={user}
                    changePasswordWithToken={changePasswordWithToken}
                    setAndStoreThemeMode={setAndStoreThemeMode}
                    themeMode={themeMode}
                    onAdminChangeName={onAdminChangeName}
                  />
                ) : (
                  <Navigate
                    to="/"
                    replace={true}
                  />
                )
              }
            />
            <Route
              path="/dispatch"
              element={
                user?.id &&
                (user?.permissions?.find((perm) => perm.tabName === "dispatch")
                  .canView ||
                  user.isAdmin) ? (
                  <Dashboard
                    socket={socket}
                    user={user}
                    logout={logout}
                    themeMode={themeMode}
                    changePasswordWithToken={changePasswordWithToken}
                  />
                ) : (
                  <Navigate
                    to="/"
                    replace={true}
                  />
                )
              }
            />
            <Route
              path="/training"
              element={
                user.id &&
                (user?.permissions?.find((perm) => perm.tabName === "training")
                  .canView ||
                  user.isAdmin) ? (
                  <Training user={user} />
                ) : (
                  <Navigate
                    to="/"
                    replace={true}
                  />
                )
              }
            />
            <Route
              path="/whiteboard"
              element={
                user.id &&
                (user?.permissions?.find(
                  (perm) => perm.tabName === "whiteboard"
                ).canView ||
                  user.isAdmin) ? (
                  <Navigate
                    to="/"
                    replace={true}
                  />
                ) : (
                  <Navigate
                    to="/"
                    replace={true}
                  />
                )
              }
            />{" "}
            <Route
              path="/website"
              element={
                user.id &&
                (user?.permissions?.find((perm) => perm.tabName === "website")
                  .canView ||
                  user.isAdmin) ? (
                  <Website />
                ) : (
                  <Navigate
                    to="/"
                    replace={true}
                  />
                )
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default AppRouter;

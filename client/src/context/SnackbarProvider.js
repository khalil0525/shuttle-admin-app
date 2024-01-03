import { createContext, useContext } from "react";
import { useToast } from "@chakra-ui/react";
const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
	const toast = useToast();

	const showSuccessToast = (message) => {
		toast({
			title: "Success",
			description: message,
			status: "success",
			isClosable: true,
		});
	};

	const showErrorToast = (error) => {
		toast({
			title: "Error",
			description: error || "An error occurred",
			status: "error",
			isClosable: true,
		});
	};

	return (
		<SnackbarContext.Provider value={{ showSuccessToast, showErrorToast }}>
			{children}
		</SnackbarContext.Provider>
	);
}

export function useSnackbar() {
	return useContext(SnackbarContext);
}

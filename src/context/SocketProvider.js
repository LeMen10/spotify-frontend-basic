import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    
    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem("user"));
    //     if (!user) return;
    //     const newSocket = io("http://localhost:5000", {
    //         query: { userId: user._id },
    //     });

    //     setSocket(newSocket);

    //     return () => newSocket.close();
    // }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

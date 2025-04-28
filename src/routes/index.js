// import Message from "~/pages/Message/Message"
import Home from "~/pages/Home/Home"
import Login from "~/pages/Login/Login"
import Playlist from "~/pages/Playlist/Playlist"
import Register from "~/pages/Register/Register"

const publicRouter = [
    {path: '/login', component: Login, layout: null},
    {path: '/', component: Home},
    {path: '/register', component: Register, layout: null},
    {path: '/playlist/:id', component: Playlist},
]

const privateRouter = [

]

export { publicRouter, privateRouter }
// import Message from "~/pages/Message/Message"
import Home from "~/pages/Home/Home"
import Login from "~/pages/Login/Login"
import Register from "~/pages/Register/Register"

const publicRouter = [
    {path: '/login', component: Login, layout: null},
    {path: '/', component: Home},
    {path: '/register', component: Register, layout: null},
]

const privateRouter = [

]

export { publicRouter, privateRouter }
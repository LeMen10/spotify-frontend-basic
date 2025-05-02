// import Message from "~/pages/Message/Message"
import Home from "~/pages/Home/Home"
import Login from "~/pages/Login/Login"
import MomoResultPage from "~/pages/MomoResultPage/MomoResultPage"
import Register from "~/pages/Register/Register"
import SearchResults from "~/pages/SearchResults/SearchResults"

const publicRouter = [
    {path: '/login', component: Login, layout: null},
    {path: '/', component: Home},
    {path: '/register', component: Register, layout: null},
    {path: '/momo', component: MomoResultPage, layout: null},
    {path: '/search', component: SearchResults},
]

const privateRouter = [

]

export { publicRouter, privateRouter }
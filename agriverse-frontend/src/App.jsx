import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h2 className="text-sm">Welcome to Agriversse</h2>
      <div>
        <Link to="/login"><Button>Login</Button></Link>
        <Link to="/register"><Button>Register</Button></Link>
      </div>
      
    </div>
  )
}

export default App
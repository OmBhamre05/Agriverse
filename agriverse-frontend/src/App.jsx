import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h2 className="text-sm">Welcome to Agriversse</h2>
      <div>
        <Button>Login</Button>
        <Button>Register</Button>
      </div>
      
    </div>
  )
}

export default App
import { BrowserRouter, Routes } from 'react-router'
import './App.css'
import { Route } from 'react-router'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Blog from './pages/Blog'

function App() {

  return (
    <div className='h-screen w-screen'>
      <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/blog/:id" element={<Blog/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

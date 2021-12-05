import {ChakraProvider} from '@chakra-ui/react'
import {Header} from './components/Header'
import {Login} from './pages/Login'
import {Registration} from './pages/Registration'
import {MainPage} from './pages/MainPage'
import {Route, Routes} from 'react-router-dom'
import {useAuth} from './hooks/auth.hook'
import {UserPage} from './pages/UserPage'
import {ReviewPage} from './pages/ReviewPage'
import {ReviewRedactorPage} from './pages/ReviewRedactorPage'
import {AuthContext} from './context/AuthContext'
import {CurrentReviewContext} from './context/CurrentReviewContext'
import {useCurrentReviewState} from './hooks/reviewState.hook'


function App() {
    const {login, logout, userData} = useAuth()
    const {currentReviewData, requestCurrentReviewState, setCurrentReviewState, sendCurrentReviewState,
        setDefaultCurrentReviewState} = useCurrentReviewState()
    let isAuth = userData && userData.token

    return (
      <ChakraProvider>
          <AuthContext.Provider value={{login, logout, userData}}>
              <Header />
              <Routes>
                  <Route path="/" exact element={<MainPage />} />
                  <Route path="/auth/login" exact element={<Login />} />
                  <Route path="/auth/registration" exact element={<Registration />} />
              </Routes>
              <CurrentReviewContext.Provider
                  value={{currentReviewData, requestCurrentReviewState, setCurrentReviewState, sendCurrentReviewState,
                      setDefaultCurrentReviewState}}
              >
                  <Routes>
                      <Route path="/review/:id" element={<ReviewPage />} />
                  </Routes>
                  {isAuth &&
                  <Routes>
                      <Route path="/user/*" element={<UserPage />} />
                      <Route path="/review/redactor/:id" exact element={<ReviewRedactorPage />} />
                  </Routes>}
                  }
              </CurrentReviewContext.Provider>
          </AuthContext.Provider>
      </ChakraProvider>
    )
}

export default App

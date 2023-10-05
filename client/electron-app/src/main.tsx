import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import './assets/css/app.css'
import './assets/css/normalize.css'
import './assets/css/grid.css'
import { API_URI } from './config/env'
import { AuthContext, AuthProvider } from './context/authContext'

// Create UploadLink
const httpLink = new HttpLink({
    uri: `${API_URI}/graphql`
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || ""
    }
  }
})

// Create apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <ApolloProvider client={ client }>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </ApolloProvider>
  </AuthProvider>
)

postMessage({ payload: 'removeLoading' }, '*')

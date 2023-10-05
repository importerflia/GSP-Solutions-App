import { Route, Routes } from 'react-router-dom'
import Statistics from '../statistics/Statistics'
import Products from '../products/Products'
import CreateProduct from '../products/CreateProduct'
import UpdateProduct from '../products/UpdateProduct'
import Contacts from '../contacts/Contacts'
import CreateContact from '../contacts/CreateContact'
import UpdateContact from '../contacts/UpdateContact'
import Users from '../users/Users'
import UpdateUser from '../users/UpdateUser'
import Transactions from '../transactions/Transactions'
import CreateTransaction from '../transactions/CreateTransaction'
import UpdateTransaction from '../transactions/UpdateTransaction'
import Payments from '../payments/Payments'
import CreatePayment from '../payments/CreatePayment'
import UpdatePayment from '../payments/UpdatePayment'
import SignUp from '../auth/SignUp'
import SignIn from '../auth/SignIn'
import RestorePassword from '../auth/RestorePassword'
import CreateNewPassword from '../auth/CreateNewPassword'
import ExampleReport from '../reports/ExampleReport'
import Invoice from '../reports/Invoice'
import Manual from '../manual/Manual'

 const ComponentsRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={<Statistics />}/>
            <Route path='/products/'>
                <Route index={true}  element={<Products />}/>
                <Route path='new' element={<CreateProduct />}/>
                <Route path='edit/:idProduct' element={<UpdateProduct />}/>
            </Route>
            <Route path='/contacts/:type/'>
                <Route index={true} element={<Contacts />}/>
                <Route path='new' element={<CreateContact />}/>
                <Route path='edit/:idContact' element={<UpdateContact />}/>
            </Route>
            <Route path='/transactions/:type'>
                <Route index={true} element={<Transactions />}/>
                <Route path='new' element={<CreateTransaction />}/>
                <Route path='edit/:idTransaction' element={<UpdateTransaction />}/>
            </Route>
            <Route path='/payments'>
                <Route index={true} element={<Payments />}/>
                <Route path='new' element={<CreatePayment />}/>
                <Route path='edit/:idPayment' element={<UpdatePayment />}/>
            </Route>
            <Route path='/users'>
                <Route index={true} element={<Users />}/>
                <Route path='edit/:idUser' element={<UpdateUser />}/>
            </Route>
            <Route path='/signup' element={<SignUp />}/>
            <Route path='/signin' element={<SignIn />}/>
            <Route path='/resetpass' element={<RestorePassword />}/>
            <Route path='/formresetpass' element={<CreateNewPassword />}/>
            <Route path='/reports/'>
                <Route index={true}/>
                <Route path='example' element={<ExampleReport />}/>
                <Route path='invoice/:idTransaction' element={<Invoice />}/>
            </Route>
            <Route path='/manual' element={<Manual />}/>
        </Routes>
    )
 }

 export default ComponentsRoutes
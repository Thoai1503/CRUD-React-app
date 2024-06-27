import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Users from "./pages/Users";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="products" element={<Products />} />
                        <Route path="login" element={<Login />} />

                        <Route path="users" element={<Users />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
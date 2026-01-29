import { Routes, Route } from "react-router-dom";
import { MainStyle } from "./pages/MainStyle";
import { Home } from "./pages/Home";
import { ManagementSeller } from "./pages/managementseller/ManagementSeller";
import { Shop } from "./pages/buyer/Shop";
import { BusinessEditor } from "./pages/managementseller/BusinessEditor";
import SellerChat from "./pages/managementseller/SellerChat";
import { BusinessDirectory } from "./pages/buyer/BusinessDirectory";
import { BusinessShop } from "./pages/buyer/BusinessShop";
import { CartPage } from "./pages/buyer/CartPage";
import BuyerAuth from "./pages/auth/BuyerAuth";
import SellerAuth from "./pages/auth/SellerAuth";
import ResetPasswordRequest from "./pages/auth/ResetPasswordRequest";
import ResetPassword from "./pages/auth/ResetPassword";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import SellerProfile from "./pages/managementseller/SellerProfile";
import BuyerManagement from "./pages/buyer/BuyerManagement";
import { About } from "./pages/About";
import { ContactsUs } from "./pages/ContactsUs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainStyle />}>
        <Route index element={<Home />} />
        <Route path="MSeller" element={<ManagementSeller />} />
        <Route path="shop" element={<Shop />} />
        <Route path="about" element={<About />} />
        <Route path="contactus" element={<ContactsUs />} />
        <Route path="businesses" element={<BusinessDirectory />} />
        <Route path="business/:businessId" element={<BusinessShop />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="auth">
          <Route path="buyer">
            <Route index element={<BuyerAuth />} />
            <Route path="register" element={<BuyerAuth />} />
          </Route>
          <Route path="seller">
            <Route index element={<SellerAuth />} />
            <Route path="register" element={<SellerAuth />} />
          </Route>
          <Route path="forgot" element={<ResetPasswordRequest />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="profile">
          <Route path="buyer" element={<BuyerProfile />} />
          <Route path="buyer/account" element={<BuyerManagement />} />
          <Route path="seller" element={<SellerProfile />} />
        </Route>
        <Route path="MSeller/:businessId" element={<BusinessEditor />} />
        <Route path="MSeller/chat" element={<SellerChat />} />
      </Route>
    </Routes>
  );
}

export default App;

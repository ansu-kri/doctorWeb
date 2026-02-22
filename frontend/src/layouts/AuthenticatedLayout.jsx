
// import Footer from '../components/Footer/Footer.jsx';
import { Outlet } from 'react-router';
import Navbar from '../components/Header/Navbar'

const AuthenticatedLayout = () => {
  return (
    <div>
     <Navbar/>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Footer /> */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;

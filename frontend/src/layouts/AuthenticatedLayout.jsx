
// import Footer from '../components/Footer/Footer.jsx';
import { Outlet } from 'react-router';
import Header from '../components/Header/Header.jsx';

const AuthenticatedLayout = () => {
  return (
    <div>
     <Header/>
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

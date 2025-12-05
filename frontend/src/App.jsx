
// import { Toaster } from 'sonner';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routers';
// import './App.css'
const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
      {/* <Toaster position="bottom-right" richColors closeButton /> */}
    </div>
  );
};

export default App;
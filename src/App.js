/** @format */
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactNotifications } from "react-notifications-component";
import { ScrollToTop } from "./utils/utils";
import routes from "./routes/routes";

function App() {
  return (
    <>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ReactNotifications />
      <ScrollToTop />
      <Routes>
        {routes.map((route) => {
          return (
            <Route
              path={route.path}
              element={route.element}
              key={`route-without-layout${route.path}`}
            />
          );
        })}
      </Routes>
    </>
  );
}

export default App;

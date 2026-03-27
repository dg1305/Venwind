import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Safety reset: if any modal/overlay/third-party script leaves
    // scroll locking styles/classes behind, release them on navigation.
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.documentElement.style.overflow = "";
    document.documentElement.style.position = "";
    document.documentElement.style.width = "";
    document.body.classList.remove("overflow-hidden", "no-scroll");
    document.documentElement.classList.remove("overflow-hidden", "no-scroll");

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;

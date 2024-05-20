import LoginComponent from "../../components/header/login";
import { useEffect, useState } from "react";

function MobileLogin() {
  const [active, setActive] = useState(true);
  // useEffect(() => {
  //   if (window.innerWidth >= 768) {
  //     window.location.href = "/";
  //   }
  //   function checkingSize() {
  //     const screenWidth = window.innerWidth;
  //     if (screenWidth >= 768) {
  //       // Realizar redireccionamiento utilizando navigate
  //       window.location.href = "/";
  //     }
  //   }
  //   window.addEventListener("resize", checkingSize);

  //   return () => window.removeEventListener("resize", checkingSize);
  // }, []);
  return (
    <div>
      <LoginComponent close={() => setActive(false)} />
    </div>
  );
}
export default MobileLogin;

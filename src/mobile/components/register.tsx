import RegisterComponent from "../../components/header/register";
// import LoginComponent from "../../components/header/login";
import { useEffect, useState } from "react";

function MobileRegister() {
  const [active, setActive] = useState(true);
  // useEffect(() => {
  //   if (window.innerWidth <= 768) {
  //     window.location.href = "/";
  //   }
  //   function checkingSize() {
  //     const screenWidth = window.innerWidth;
  //     if (screenWidth <= 768) {
  //       // Realizar redireccionamiento utilizando navigate
  //       window.location.href = "/";
  //     }
  //   }
  //   window.addEventListener("resize", checkingSize);

  //   return () => window.removeEventListener("resize", checkingSize);
  // }, []);
  return (
    <div>
      <RegisterComponent close={() => setActive(false)} />
    </div>
  );
}
export default MobileRegister;

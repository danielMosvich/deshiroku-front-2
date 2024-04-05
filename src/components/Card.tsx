import { useEffect, useState } from "react";

function Card({ delay }: { delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (delay) {
      const timeOut = setTimeout(() => {
        setVisible(true);
      }, (100 * delay) / 2);

      return () => clearTimeout(timeOut);
    } else{
        setVisible(true)
    }
  }, [delay]);
  return (
    <div
      style={{
        height: `${Math.floor(Math.random() * (400 - 150 + 1) + 150)}px`,
        opacity: `${visible ? "100" : "0"}`,
      }}
      className={` bg-rose-100 w-full rounded-xl animate-card-squeleton transition-all`}
    ></div>
  );
}
export default Card;

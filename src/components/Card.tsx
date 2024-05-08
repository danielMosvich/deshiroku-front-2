import { useEffect, useState } from "react";

function Card({ delay }: { delay: number }) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const randomHeight = Math.floor(Math.random() * (400 - 150 + 1) + 150);
    setHeight(randomHeight);
  }, []); // Este efecto se ejecuta solo una vez, después de que el componente se monta

  return (
    <div
      style={{ height: height ? `${height}px` : 'auto' }}
      className={` bg-rose-100 w-full rounded-xl animate-card-squeleton transition-all mt-4`}
    ></div>
  );
}

export default Card;

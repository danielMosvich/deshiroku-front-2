import "./Loader.css";
function Loader() {
  return (
    <div className="bg-white shadow-xl w-fit h-fit p-5 rounded-full fixed bottom-5 left-0 grid place-content-center right-0 mx-auto animate-fade-up">
      <div className="loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>
  );
}
export default Loader;

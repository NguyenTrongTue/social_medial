import { useSelector } from "react-redux";
import RoutesApp from "./config/routes";

function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <RoutesApp currentUser={currentUser} />
    </>
  );
}

export default App;

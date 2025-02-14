import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkUserPersistence, selectUser } from "./services/Auth/AuthSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(checkUserPersistence()).finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Prevents flickering of unauthorized content
  }

  return <RouterProvider router={routes} />;
}

export default App;

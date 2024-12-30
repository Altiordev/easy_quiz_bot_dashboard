import { useLayoutEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { getAccessToken } from "./api/auth.ts";
import LoginPage from "./pages/login.page.tsx";
import TestsPage from "./pages/tests.page.tsx";
import TestDetailsPage from "./pages/testDetails.page.tsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const token = getAccessToken();

    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TestsPage />} />
          <Route path="/:id" element={<TestDetailsPage />} />
        </Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;

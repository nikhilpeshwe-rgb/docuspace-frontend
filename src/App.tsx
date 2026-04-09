import { AppProviders } from "./app/providers";
import AppRouter from "./app/router";
import { AuthProvider } from "./auth/AuthProvider";


function App() {
  return (
    <AppProviders>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AppProviders>
  );
}

export default App

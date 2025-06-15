import { queryClient } from "@/lib/queryClient";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import ProductionHome from "./pages/ProductionHome";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={ProductionHome} />
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
            <a href="/" className="text-purple-600 hover:text-purple-800">Return Home</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
};

export default App;
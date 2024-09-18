import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso";

import { Home } from "./pages/Home/index.jsx";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
import "@picocss/pico";

export function App() {
  return (
    <LocationProvider>
      {/* <Header /> */}
      <main class="container">
        <Router>
          <Route path="/" component={Home} />
          {/* <Route path="/all" component={All} /> */}
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}

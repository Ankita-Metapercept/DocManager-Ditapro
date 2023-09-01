import Dashboard from "./index";

// import middlewares
export default [
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
  },
  {
    path: "/calendar",
    component: Dashboard,
    name: "Calender",
  }
];

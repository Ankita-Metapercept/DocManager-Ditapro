import Login from "./login";
import EmailVerification from "./emailverification";


const routes = [
  {
    path: "/",
    component: Login,
    name: "Login",
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (token) {
        next('/dashboard'); // Redirect to dashboard if the user has a token
      } else {
        next(); // Allow navigation to the login page
      }
    }
  },
  {
    path: "/verify/:token",
    component: EmailVerification,
    name: "EmailVerification",
  },
];

export default routes;

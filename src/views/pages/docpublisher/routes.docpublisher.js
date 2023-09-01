import DocPublisher from "./index";
import Projects from "./projects.vue";
// import ProjectDetail from "./details

// import middlewares
export default [
  {
    path: "/docpublisher/:repouser/:reponame/:repobranch",
    component: DocPublisher,
    name: "DocPublisher"
  },
  {
    path:"/docpublisher",
    component: Projects,
    name:"DocPublisher",
  }
];
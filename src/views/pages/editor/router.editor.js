import Editor from "./index";

export default [
  {
    path:"/editor/:repouser/:reponame/:repobranch",
    component: Editor,
    name:"Editor",
  }
];
import DocManager from "../docmanager/index.vue";
import ProjectDetail from "../docmanager/details.vue"
import XMLEditor from "../docmanager/xmleditor"
import ProjectList from "./projectlist.vue";
import axios from 'axios'
import {URL} from '@/api/global.env.js'
// import middlewares
export default [
  {
    path: "/docmanager",
    component: DocManager,
    name: "DocManager",
  },
  {
    path: "/docmanager/:repouser/:reponame",
    component: ProjectDetail,
    name: "DocManager",
  },
  {
    path: "/doceditor/:repouser/:reponame/:repobranch",
    component: XMLEditor,
    name: "DocEditor",
    beforeEnter: (to, from, next) => {
      const userId = localStorage.getItem('userId');
      const repoUser = to.params.repouser;
      const repoName = to.params.reponame;
      axios.get(`${URL}api/project/byuserid?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          sessionId: localStorage.getItem('sessionId'),
          userId: localStorage.getItem('userId'),
          orgId:localStorage.getItem('orgId')
        }
      })
        .then((res) => {
          console.log( repoUser,);
          const projectid = res.data.find((item) => item.projectName == repoName).id;
          axios.get(`${URL}api/projectuser/byprojectid/byprojectuserid?userId=${userId}&projectId=${projectid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              sessionId: localStorage.getItem('sessionId'),
              userId: localStorage.getItem('userId'),
              orgId:localStorage.getItem('orgId')
            }
          })
            .then((res) => {
              if (res.data.userRole.includes("DocEditor")) {
                // user has DocMigration role, so allow access to this route
                next();
              } else {
                // user does not have DocMigration role, so disable this route
                next(false);
              }
            })
            .catch(error => {
              console.error("Error fetching user data from API:", error);
              next(false);
            });
        })
        .catch(error => {
          console.error("Error fetching user data from API:", error);
          next(false);
        });
    }

  },
  {
    path: "/doceditor",
    component: ProjectList,
    name: "DocEditor",
  }
];

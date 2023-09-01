import DocManager from "./index";
import ProjectDetail from "./details"
import XMLEditor from "./xmleditor"
import axios from 'axios';
import DocPublisher from './docpublisher.vue'
import {URL} from '@/api/global.env.js'
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
    path: "/doceditor/docpublisher/:repouser/:reponame/:repobranch",
    component: DocPublisher,
    name: "DocPublisher"
  },
  {
    path: "/doceditor/:repouser/:reponame/:repobranch",
    component: XMLEditor,
    name: "DocEditor",
    beforeEnter: (to, from, next) => {
      const userId = localStorage.getItem('userId');

      const repoName = localStorage.getItem('reponame')
      axios.get(`${URL}api/project/byuserid?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          sessionId: localStorage.getItem('sessionId'),
          userId: localStorage.getItem('userId'),
          orgId: localStorage.getItem('orgId')
        }
      })
        .then((res) => {
          const projectid = res.data.find((item) => item.projectName == repoName).id;
          axios.get(`${URL}api/projectuser/byprojectid/byprojectuserid?userId=${userId}&projectId=${projectid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              sessionId: localStorage.getItem('sessionId'),
              userId: localStorage.getItem('userId'),
              orgId: localStorage.getItem('orgId')
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
  }
];
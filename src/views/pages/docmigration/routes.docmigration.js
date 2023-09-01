import DocMigration from '../docmigration/index.vue'
import PopUpMessage from './components/popupmessage.vue'
import converttodita from './components/converttodita.vue'
import outputscreen from './components/outputscreen.vue'
import githubcommit from './components/githubcommit.vue'
import axios from 'axios';
import {URL} from '@/api/global.env.js'
// import middlewares
export default [
  {
    path: "/docmigration",
    component: DocMigration,
    name: "DocMigration",
    beforeEnter: (to, from, next) => {
      // fetch user data from API
      const userId = localStorage.getItem('userId');
      axios.get(`${URL}api/orguser/details?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          sessionId: localStorage.getItem('sessionId'),
          userId: localStorage.getItem('userId'),
          orgId:localStorage.getItem('orgId')
        }
      })
        .then(res => {
          console.log("main.jsData", res.data);
          if (res.data && res.data.userRole.includes("DocMigration")) {
            // user has DocMigration role, so allow access to this route
            next();
          } else {
            // user does not have DocMigration role, so disable this route
            next(false);
          }
        })
        .catch(error => {
          // handle error fetching user data from API
          console.error("Error fetching user data from API:", error);
          next(false); // disable this route
        });
    }
  },
  {
    path: "/noaccess",
    component: PopUpMessage,
    name: "DocMigration",
  },
  {
    path: "/docmigration/converttodita",
    component: converttodita,
    name: "DocMigration",
  },
  {
    path: "/docmigration/converttodita/outputscreen/:selectedfolder",
    component: outputscreen,
    name: "DocMigration",
  },
  {
    path: "/docmigration/converttodita/outputscreen/githubcommit/:selectedfolder",
    component: githubcommit,
    name: "DocMigration",
  },

];
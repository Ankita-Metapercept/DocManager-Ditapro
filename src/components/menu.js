import axios from 'axios';
import {URL} from '../api/global.env.js'
export const menuItems = [
  {
    id: 1,
    label: "menuitems.menu.text",
    isTitle: true,
  },
  {
    id: 2,
    label: "menuitems.dashboard.text",
    icon: "ri-dashboard-line",
    link: "/dashboard",
    hide: false,
  },
  {
    id: 3,
    label: "menuitems.docmanager.text",
    icon: "ri-file-3-fill",
    link: "/docmanager",
    hide: false,
  },
  {
    id: 4,
    label: "menuitems.editor.text",
    icon: "ri-file-edit-fill",
    link: "/doceditor",
    hide: false,
  },
  {
    id: 5,
    label: "menuitems.publisher.text",
    icon: "ri-settings-5-fill",
    link: "/docpublisher",
    hide: false,
  },
  {
    id: 6,
    label: "menuitems.docmigration.text",
    icon: "mdi mdi-file-replace",
    link: "/docmigration",
    // hide: false,
    disabled: false,
  },
];

const userId = localStorage.getItem('userId');

axios.get(`${URL}api/orguser/details?userId=${userId}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    sessionId: localStorage.getItem('sessionId'),
    userId: localStorage.getItem('userId'),
    orgId:localStorage.getItem('orgId')
  }
}).then(response => {
  const userRole = response.data.userRole;
  const docMigrationExists = userRole.includes("DocMigration");
  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].label === "DocMigration") {
      // menuItems[i].hide = !docMigrationExists;
      menuItems[i].disabled = !docMigrationExists;
      if (menuItems[i].disabled) {
        menuItems[i].link = "/noaccess"
      }
      break;
    }
  }


  // Hide the "DocMigration" menu item from the DOM if necessary
  const docMigrationItem = document.querySelector('.menu-item[data-id="6"]');
  if (docMigrationItem && docMigrationItem.style) {
    if (menuItems[5].hide) {
      docMigrationItem.style.display = 'none';
    } else {
      docMigrationItem.style.display = '';
    }
  }
}).catch(error => {
  console.error(error);
});







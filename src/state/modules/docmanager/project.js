import { axios } from "@/api/index.js";
import { URL } from "@/api/global.env";
import Swal from 'sweetalert2';
const Projects = {
  state: {
    suserprojectdata: null,
  },
  mutations: {
    setUserProjectDetails: (state, e) => (state.suserprojectdata = e),
  },
  actions: {
    async userProjectDetails({ commit }, payload) {
      try {
        let apptoken = localStorage.getItem("token");
        const { data } = await axios.get(`${URL}api${payload}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apptoken}`,
              sessionId: localStorage.getItem('sessionId'),
              userId: localStorage.getItem('userId'),
              orgId:localStorage.getItem('orgId')
            },
          }
        );
        commit("setUserProjectDetails", data)
      } catch (error) {
        console.log("error.response.data.message", error.response.data.message);
        if (error.response.data.message == "Another device has login with your account!") {
          localStorage.clear()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Another device has logged in with your account!',
          }).then(() => {
            window.location.href = '/';
          });
        }
        if (error.response.data.message == "Invalid Token") {
          localStorage.clear()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your session has expired. Please log in again to continue accessing the DITAxPresso. ',
          }).then(() => {
            window.location.href = '/';
          });
        }
        if (error.response.data.message == "The current subscription of your organization has been expired !") {
          localStorage.clear()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "The current subscription for your organization has expired. Please kindly request your organization to renew the subscription plan in order to continue using our services. If you require any assistance, please feel free to contact Ditaxpresso support at support@ditaxpresso.com. Thank you!"            ,
          }).then(() => {
            window.location.href = '/';
          });
        }
      }
    },
  }
};
export default Projects;
const gitdetails ={
    state: {
        owner: '',
        projectName: ''
      },
      mutations: {
        setOwner(state, owner) {
          state.owner = owner
          console.log("state.owner ",state.owner );
        },
        setProjectName(state, projectName) {
          state.projectName = projectName
          console.log(" state.projectName", state.projectName);
        }
      }
}
export default gitdetails;
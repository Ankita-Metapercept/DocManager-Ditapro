import { unauthClient, apiDefaults, axios } from "@/api/index.js";
import store from "@/state/store";
import { URL } from "@/api/global.env";

const Auth = {
  state: () => ({
    token: localStorage.getItem("token") || null,
    tokensessionStorage: sessionStorage.getItem("tokensessionStorage") || null,
    sessionId: localStorage.getItem("sessionId") || null,
    refresh: localStorage.getItem("refresh") || null,
    orgId: localStorage.getItem("orgId") || null,
    userId: localStorage.getItem("userId") || null,
    userEmail: localStorage.getItem("userEmail") || null,
    userName: localStorage.getItem("userName") || null,
    gitToken: localStorage.getItem("gitToken") || null,
    githubUsername: localStorage.getItem("githubUsername") || null,
    isActive: localStorage.getItem("isActive") || null,
    isDeleted: localStorage.getItem("isDeleted") || null,
    isSuperUser: localStorage.getItem("isSuperUser") || null,
    isEmailVerified: localStorage.getItem("isEmailVerified") || null,
    unauthClient: unauthClient,
    endpoints: {
      obtain: "/orguser/authenticate",
      // refresh: "/token/refresh/",
      // register: "/accounts/register/",
    },
  }),
  mutations: {
    updateTokens(state, tokens) {
      localStorage.setItem("token", tokens.tokensessionStorage);
      localStorage.setItem("token", tokens.token);
      localStorage.setItem("refresh", tokens.refresh);
      localStorage.setItem("orgId", tokens.orgId);
      localStorage.setItem("userId", tokens.userId);
      localStorage.setItem("userEmail", tokens.userEmail);
      localStorage.setItem("userName", tokens.userName);
      localStorage.setItem("gitToken", tokens.gitToken);
      localStorage.setItem("githubUsername", tokens.githubUsername);
      localStorage.setItem("isActive", tokens.isActive);
      localStorage.setItem("isDeleted", tokens.isDeleted);
      localStorage.setItem("isSuperUser", tokens.isSuperUser);
      localStorage.setItem("isEmailVerified", tokens.isEmailVerified);
      state.token = tokens.token;
      state.tokensessionStorage = tokens.tokensessionStorage;
      state.refresh = tokens.refresh;
      state.orgId = tokens.orgId;
      state.userId = tokens.userId;
      state.userEmail = tokens.userEmail;
      state.userName = tokens.userName;
      state.gitToken = tokens.gitToken;
      state.githubUsername = tokens.githubUsername;
      state.isActive = tokens.isActive;
      state.isDeleted = tokens.isDeleted;
      state.isSuperUser = tokens.isSuperUser;
      state.isEmailVerified = tokens.isEmailVerified
      console.log("state updated", state.token);
    },
    updateSessionId(state, sessionId) {
      state.sessionId = sessionId;
      localStorage.setItem('sessionId', sessionId);
    },
    updateUserId(state, userId) {

      state.userId = userId;
      localStorage.setItem('userId', userId);
    },
    updateAccess(state, token) {
      localStorage.setItem("token", token);
      state.token = token;
    },
    updateGitToken(state, token) {
      localStorage.setItem("gitToken", token.gitToken);
      state.gitToken = token.gitToken;
    },
    updateActiveStatus(state, token) {
      localStorage.setItem("isActive", token.isActive);
      state.isActive = token.isActive;
    },
    updateDeletedStatus(state, token) {
      localStorage.setItem("isDeleted", token.isDeleted);
      state.isDeleted = token.isDeleted;
    },
    updateSuperUserStatus(state, token) {
      localStorage.setItem("isSuperUser", token.isSuperUser);
      state.isSuperUser = token.isSuperUser;
    },
    updateEmailVerifiedStatus(state, token) {
      localStorage.setItem("isEmailVerified", token.isEmailVerified);
      state.isEmailVerified = token.isEmailVerified;
    },
    removeToken(state) {
      localStorage.setItem("token", null);
      localStorage.setItem('sessionId', null)
      localStorage.setItem("refresh", null);
      localStorage.setItem("reponame", null);
      localStorage.setItem("orgId", null);
      localStorage.setItem("userId", null);
      localStorage.setItem("userName", null);
      localStorage.setItem("userEmail", null);
      localStorage.setItem("gitToken", null);
      localStorage.setItem("isActive", null);
      localStorage.setItem("isDeleted", null);
      localStorage.setItem("isSuperUser", null);
      localStorage.setItem("githubUsername", null);
      localStorage.setItem("isEmailVerified", null);
      state.token = null;
      state.sessionId = null;
      state.refresh = null;
      state.orgId = null;
      state.userId = null;
      state.userEmail = null;
      state.userName = null;
      state.gitToken = null;
      state.githubUsername = null;
      state.isActive = null;
      state.isDeleted = null;
      state.isSuperUser = null;
      state.isEmailVerified = null;
    },

  },
  getters: {
    client: (state) => {
      const apiClient = axios.create({
        ...apiDefaults,
        headers: {
          Authorization: `Bearer ${state.token}`,
          sessionId: state.sessionId || localStorage.getItem('sessionId'),
          userId: state.userId || localStorage.getItem('userId'),
          orgId: state.orgId || localStorage.getItem('orgId'),
          gitToken: `${state.gitToken}`
        },
      });
      apiClient.interceptors.response.use(
        (response) => {
          // Return a successful response back to the calling service
          return response;
        },
        (error) => {
          // Return any error which is not due to authentication back to the calling service
          if (error.response.status !== 401) {
            return new Promise((resolve, reject) => {
              reject(error);
            });
          }

          console.log(error.config.url);
          // Logout user if token refresh didn't work or user is disabled
          if (
            error.config.url == `${URL}api/token/refresh/` ||
            error.response.message == "Account is disabled."
          ) {
            // window.location.href = "/";

            return new Promise((reject) => {
              reject(error);
            });
          }

          // Try request again with new token
          return apiClient
            .post(`${URL}accounts/token/refresh/`, {
              refresh: localStorage.getItem("refresh"),
            })
            .then((response) => {
              // New request with new token
              const config = error.config;
              store.commit("updateAccess", {
                token: response.data.token,
              });
              config.headers[
                "Authorization"
              ] = `Bearer ${response.data.token}`;

              return new Promise((resolve, reject) => {
                apiClient
                  .request(config)
                  .then((response) => {
                    resolve(response);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              });
            })
            .catch((error) => {
              Promise.reject(error);
            });
        }
      );
      return apiClient;
    },
  },
  actions: {
    obtainToken(context, authDetails) {
      return context.state.unauthClient
        .post(context.state.endpoints.obtain, authDetails)
        .then((response) => {
          this.commit("updateTokens", {
            token: response.data.token,
            tokensessionStorage: response.data.token,
            refresh: response.data.refresh,
            orgId: response.data.orgId,
            userEmail: response.data.email,
            userName: response.data.username,
            userId: response.data.id,
            githubUsername: response.data.githubUsername,
          });
          this.commit("updateEmailVerifiedStatus", {
            isEmailVerified: response.data.isEmailVerified
          });
          this.commit("updateGitToken", {
            gitToken: response.data.gitToken,
          });
          this.commit("updateActiveStatus", {
            isActive: response.data.isActive
          });
          this.commit("updateDeletedStatus", {
            isDeleted: response.data.isDeleted
          })
          this.commit("updateSuperUserStatus", {
            isSuperUser: response.data.isSuperUser
          })
        });
    },
    refreshToken(context) {
      const payload = {
        refresh: context.state.refresh,
      };
      context.state.unauthClient
        .post(context.state.endpoints.refresh, payload)
        .then((response) => {
          this.commit("updateAccess", response.data.token);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    registerUser(context, authDetails) {
      return context.state.unauthClient
        .post(context.state.endpoints.register, authDetails)
        .then((response) => {
          console.log(response, "response");
        });
    },
  },
};
export default Auth;

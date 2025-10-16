class APIConstants {
  BASE_URL = `${import.meta.env.VITE_PRODUCTION_BACKEND}/api`;

  // Controllers
  AUTH = this.BASE_URL + "/auth";
  USER = this.BASE_URL + "/user";
  EVENTS = this.BASE_URL + "/events";
  FORM = this.BASE_URL + "/form";
  VAULT = this.BASE_URL + "/vault";
  PROJECTS = this.BASE_URL + "/projects";
  INVESTORS = this.BASE_URL + "/investors";
  TEAM = this.BASE_URL + "/team";
  EVENT_APPLICATIONS = this.BASE_URL + "/event-applications";
  REGISTER = this.BASE_URL + "/register";
  REGISTERED_EVENT_RESPONSES = this.REGISTER + "/event-responses";
  RESPONSES = this.BASE_URL + "/responses";
  ACCOUNT = this.BASE_URL + "/account";
  SUPER_ADMIN = this.BASE_URL + "/super-admin";
  JUDGE = this.BASE_URL + "/judge";
  MAIL = this.BASE_URL + "/mail";

  // Auth Endpoints
  LOGIN = this.AUTH + "/login";
  GOOGLE_OAUTH = this.AUTH + "/google";
  LINKEDIN_OAUTH = this.AUTH + "/linkedin";
  GOOGLE_TOKEN = this.AUTH + "/google/token";
  LINKEDIN_TOKEN = this.AUTH + "/linkedin/token";
  FORGOT_PASSWORD = this.AUTH + "/forgot-password";
  RESET_PASSWORD = this.AUTH + "/reset-password";
  SIGNUP = this.AUTH + "/signup";
  LOGOUT = this.AUTH + "/logout";
  CURRENT_USER = this.AUTH + "/";
  RESET_PASSWORD_CURRENT = this.AUTH + "/reset-password-current";

  //Events Endpoints
  GET_ALL_EVENTS = this.EVENTS + "/";
  SEARCH_EVENTS = this.EVENTS + "/search";
  GET_EVENTS_BY_USER = this.EVENTS + "/user/user-events";
  ADD_EVENT = this.EVENTS + "/";
  GET_EVENT_BY_ID = (id: string) => `${this.EVENTS}/${id}`;
  EDIT_EVENT = (id: string) => `${this.EVENTS}/${id}`;
  DELETE_EVENT = (id: string) => `${this.EVENTS}/${id}`;
  UPDATE_CRITERIA = (id: string) => `${this.EVENTS}/update-criteria/${id}`;
  SHOW_CRITERIA = (id: string) => `${this.EVENTS}/show-criteria/${id}`;
  JUDGE_EVALUATE = `${this.EVENTS}/judge-evaluate`;

  //Project Endpoints
  GET_ROOT_PROJECT = this.PROJECTS + "/";
  GET_PROJECT_BY_ID = (id: string) => `${this.PROJECTS}/${id}`;
  CREATE_PROJECT = this.PROJECTS + "/";
  EDIT_PROJECT = (id: string) => `${this.PROJECTS}/${id}`;
  GET_PROJECT_DETAILS = (id: string) => `${this.PROJECTS}/detail/${id}`;
  FILE_UPLOAD_PROJECT = (id: string) => `${this.PROJECTS}/uploadfile/${id}`;
  FILE_DELETE_PROJECT = (id: string) => `${this.PROJECTS}/deletefile/${id}`;

  //Form Endpoints
  GET_FORM_BY_EVENT = (id: string) => `${this.FORM}/${id}`;
  ADD_MANY_FORM = this.FORM + "/add/many";
  DELETE_FORM_BY_EVENT = (id: string) => `${this.FORM}/${id}`;
  REPLACE_FORM_BY_EVENT = (id: string) => `${this.FORM}/replace/${id}`;

  // Investor Endpoints
  GET_ALL_INVESTORS = this.INVESTORS + "/";

  //Team Endpoints
  CREATE_TEAM = this.TEAM + "/create";
  GET_TEAMS = this.TEAM + "/";
  INVITE_TEAM = (teamId: string) => `${this.TEAM}/${teamId}/invite`;

  // Event Application Endpoints
  CREATE_EVENT_APPLICATION = this.EVENT_APPLICATIONS + "/";
  GET_ALL_EVENT_APPLICATIONS = (id: string) =>
    `${this.EVENT_APPLICATIONS}/all/${id}`;
  GET_EVENT_APPLICATIONS_BY_USER =
    this.EVENT_APPLICATIONS + "/user/user-application";
  GET_EVENT_APPLICATIONS_BY_EVENT = (eventId: string) =>
    `${this.EVENT_APPLICATIONS}/event/${eventId}`;
  GET_EVENT_APPLICATION_BY_ID = (id: string) =>
    `${this.EVENT_APPLICATIONS}/${id}`;
  EDIT_EVENT_APPLICATION = (id: string) => `${this.EVENT_APPLICATIONS}/${id}`;
  DELETE_EVENT_APPLICATION = (id: string) => `${this.EVENT_APPLICATIONS}/${id}`;
  GET_EVENT_APPLICATION_BY_RESPONSE = (responseId: string) =>
    `event-applications/response/${responseId}`;
  GET_EVENT_APPLICATIONS_BY_STATUS = (status: string) =>
    `event-applications/status/${status}`;
  GET_MODIFIED_JUDGE = (id: string) =>
    `${this.EVENT_APPLICATIONS}/get-modified-judge/${id}`;
  UPDATE_MODIFIED_JUDGE = (id: string) =>
    `${this.EVENT_APPLICATIONS}/update-modified-judge/${id}`;

  // Folder Endpoints

  // router.post("/folder", auth, Folder.add);
  // router.get("/folder/tree/:userId", auth, Folder.getFullTree);
  // router.get("/folder/:userId/:folderId", auth, Folder.getDetails);
  // router.put("/folder/:userId/:folderId", auth, Folder.rename);
  // router.put("/folder/:userId/:folderId/move", auth, Folder.move);
  // router.delete("/folder/:userId/:folderId", auth, Folder.delete);
  // router.get("/folder/:userId/:folderId/tree", auth, Folder.getTree);
  FOLDER = this.VAULT + "/folder";
  ADD_FOLDER = this.FOLDER + "/";
  GET_FOLDER_TREE = (userId: string) => `${this.FOLDER}/tree/${userId}`;
  GET_FOLDER_DETAILS = (userId: string, folderId: string) =>
    `${this.FOLDER}/${userId}/${folderId}`;
  EDIT_FOLDER = (folderId: string) => `${this.FOLDER}/${folderId}`;
  RENAME_FOLDER = (userId: string, folderId: string) =>
    `${this.FOLDER}/${userId}/${folderId}/rename`;
  MOVE_FOLDER = (userId: string, folderId: string) =>
    `${this.FOLDER}/${userId}/${folderId}/move`;
  DELETE_FOLDER = (folderId: string) => `${this.FOLDER}/${folderId}`;
  GET_SHARED_FOLDER_TREE = (folderId: string) =>
    `${this.FOLDER}/shared/${folderId}/tree`;

  FILE = this.VAULT + "/file";
  UPLOAD_FILE = this.FILE + "/upload";
  DELETE_FILE = (id: string) => `${this.FILE}/${id}`;
  UPDATE_FILE_TAGS = (id: string) => `${this.FILE}/update-tags/${id}`;

  // Account Endpoints
  CREATE_ACCOUNT = this.ACCOUNT + "/";
  GET_ALL_ACCOUNT = this.ACCOUNT + "/";
  FIND_ACCOUNT_BY_ID = (id: string) => `${this.ACCOUNT}/${id}`;
  EDIT_ACCOUNT_BY_ID = (id: string) => `${this.ACCOUNT}/${id}`;
  DELETE_ACCOUNT_BY_ID = (id: string) => `${this.ACCOUNT}/${id}`;

  // Responses Endpoints
  GET_RESPONSES_BY_EVENT_ID = (eventId: string) =>
    `${this.RESPONSES}/event/${eventId}`;
  GET_RESPONSES_BY_USER_ID = (userId: string) =>
    `${this.RESPONSES}/user/${userId}`;

  // Super Admin Panel
  GET_ALL_USERS_SUPER_ADMIN = `${this.SUPER_ADMIN}/get-all-users`;
  EDIT_USER_SUPER_ADMIN = (id: string) => `${this.SUPER_ADMIN}/edit-user/${id}`;
  DELETE_USER_SUPER_ADMIN = (id: string) =>
    `${this.SUPER_ADMIN}/delete-user/${id}`;
  GET_ALL_EVENTS_SUPER_ADMIN = `${this.SUPER_ADMIN}/get-all-events`;
  UPDATE_EVENT_STATUS = (id: string) =>
    `${this.SUPER_ADMIN}/update-event-status/${id}`;
  GENERAL_SETTING_SUPER_ADMIN = (id: string) =>
    `${this.SUPER_ADMIN}/general-setting/${id}`;
  UPDATE_GENERAL_SETTING_SUPER_ADMIN = (id: string) =>
    `${this.SUPER_ADMIN}/update-general-setting/${id}`;
  SECURITY_SETTING_SUPER_ADMIN = `${this.SUPER_ADMIN}/security-setting`;
  UPDATE_SECURITY_SETTING_SUPER_ADMIN = `${this.SUPER_ADMIN}/update-security-setting`;
  NOTIFICATION_SETTING_SUPER_ADMIN = (id: string) =>
    `${this.SUPER_ADMIN}/notification-setting/${id}`;
  UPDATE_NOTIFICATION_SETTING_SUPER_ADMIN = (id: string) =>
    `${this.SUPER_ADMIN}/update-notification-setting/${id}`;
  GET_SUBSCRIPTION_PLAN_SUPER_ADMIN = `${this.SUPER_ADMIN}/get-subscription-plan`;
  CREATE_SUBSCRIPTION_PLAN_SUPER_ADMIN = `${this.SUPER_ADMIN}/create-subscription-plan/`;
  EDIT_SUBSCRIPTION_PLAN_SUPER_ADMIN = (id: string) =>
    `${this.SUPER_ADMIN}/update-subscription-plan/${id}`;
  DELETE_SUBSCRIPTION_PLAN_SUPER_ADMIN = (id: string) =>
    `${this.SUPER_ADMIN}/delete-subscription-plan/${id}`;
  ACCESS_MODULE_SUPER_ADMIN = `${this.SUPER_ADMIN}/access-modules`;
  CHECK_ADMIN_USER = `${this.SUPER_ADMIN}/check-admin`;

  // Judge Panel
  GET_ALL_JUDGE = `${this.JUDGE}/get-all-judges`;
  ADD_JUDGE = `${this.JUDGE}/add-judge`;
  EDIT_JUDGE = (id: string) => `${this.JUDGE}/edit-judge/${id}`;

  // mail endpoints
  SEND_NOTIFICATION_TO_JUDGE = (id: string) =>
    `${this.MAIL}/send-mail-to-judge/${id}`;
}

const API_CONSTANTS = new APIConstants();
export default API_CONSTANTS;

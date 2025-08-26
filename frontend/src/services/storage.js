// Local storage utilities for EvalHub

const KEYS = {
  SESSION_TOKEN: 'evalhub_session_token',
  USER_DATA: 'evalhub_user_data',
  CURRENT_COURSE: 'evalhub_current_course',
  DRAFT_ANSWERS: 'evalhub_draft_answers',
};

// Session token management
export const getSessionToken = () => {
  return localStorage.getItem(KEYS.SESSION_TOKEN);
};

export const setSessionToken = (token) => {
  localStorage.setItem(KEYS.SESSION_TOKEN, token);
};

export const removeSessionToken = () => {
  localStorage.removeItem(KEYS.SESSION_TOKEN);
};

// User data management
export const getUserData = () => {
  const data = localStorage.getItem(KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
};

export const setUserData = (userData) => {
  localStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
};

export const removeUserData = () => {
  localStorage.removeItem(KEYS.USER_DATA);
};

// Current course management
export const getCurrentCourse = () => {
  const data = localStorage.getItem(KEYS.CURRENT_COURSE);
  return data ? JSON.parse(data) : null;
};

export const setCurrentCourse = (courseData) => {
  localStorage.setItem(KEYS.CURRENT_COURSE, JSON.stringify(courseData));
};

export const removeCurrentCourse = () => {
  localStorage.removeItem(KEYS.CURRENT_COURSE);
};

// Draft answers management (for offline capability)
export const getDraftAnswers = (courseId) => {
  const allDrafts = localStorage.getItem(KEYS.DRAFT_ANSWERS);
  const drafts = allDrafts ? JSON.parse(allDrafts) : {};
  return drafts[courseId] || {};
};

export const setDraftAnswer = (courseId, questionId, answer) => {
  const allDrafts = localStorage.getItem(KEYS.DRAFT_ANSWERS);
  const drafts = allDrafts ? JSON.parse(allDrafts) : {};
  
  if (!drafts[courseId]) {
    drafts[courseId] = {};
  }
  
  drafts[courseId][questionId] = {
    ...answer,
    timestamp: new Date().toISOString(),
  };
  
  localStorage.setItem(KEYS.DRAFT_ANSWERS, JSON.stringify(drafts));
};

export const removeDraftAnswers = (courseId) => {
  const allDrafts = localStorage.getItem(KEYS.DRAFT_ANSWERS);
  const drafts = allDrafts ? JSON.parse(allDrafts) : {};
  
  if (drafts[courseId]) {
    delete drafts[courseId];
    localStorage.setItem(KEYS.DRAFT_ANSWERS, JSON.stringify(drafts));
  }
};

// Clear all application data
export const clearAllData = () => {
  Object.values(KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getSessionToken() && !!getUserData();
};

// Get user role
export const getUserRole = () => {
  const userData = getUserData();
  return userData?.role || null;
};

// Check if user is instructor
export const isOrganizer = () => {
  return getUserRole() === 'instructor';
};

// Check if user is student
export const isParticipant = () => {
  return getUserRole() === 'student';
};
import mixpanel, { Dict } from 'mixpanel-browser';
import { User } from 'interfaces';

mixpanel.init('8c34af65315672ff3057143e886e65c4');

export const localSignUp = (user: User) => {
  mixpanel.alias(user.email);
  mixpanel.track('SignUp', {
    email: user.email,
    'Sign up date': user.createdAt,
    'Full Name': user.fullName,
    provider: user.provider,
  });
};

export const loginSuccess = (user: User) => {
  mixpanel.identify(user.email);
  mixpanel.people.set({
    $email: user.email,
    'Sign up date': user.createdAt,
    'Full Name': user.fullName,
    provider: user.provider,
  });
  mixpanel.track('Login Success', {
    email: user.email,
    provider: user.provider,
  });
};

export const loginFailure = (params: Dict) => {
  mixpanel.track('Login Failure', params);
};

export const logout = (user: User) => {
  mixpanel.track('Logout', { email: user.email });
  mixpanel.reset();
};

export const forgotPassword = (email: string) => {
  mixpanel.track('Forgot Password', { email });
};
export const resetPassword = () => {
  mixpanel.track('Reset Password');
};
export const resetPasswordSuccess = (email: string) => {
  mixpanel.track('Reset Password Success', { email });
};
export const updateProfile = (email: string) => {
  mixpanel.track('Update Profile', { email });
};
export const changePassword = (email: string) => {
  mixpanel.track('Change Password', { email });
};
export const changeAvatar = (email: string) => {
  mixpanel.track('Change Avatar', { email });
};
export const connect = (email: string, provider: string) => {
  mixpanel.track('Connect', { email, provider });
};
export const disconnect = (email: string, provider: string) => {
  mixpanel.track('Disconnect', { email, provider });
};
export const createForumQuestion = (email: string) => {
  mixpanel.track('Create Forum Question', { email });
};
export const createForumQuestionSuccess = (email: string) => {
  mixpanel.track('Create Forum Question Success', { email });
};
export const navigateToForum = () => {
  mixpanel.track('Forum Home');
};
export const navigateToNews = () => {
  mixpanel.track('News Home');
};
export const navigateToAcademy = () => {
  mixpanel.track('Academy Home');
};
export const navigateToCalendar = () => {
  mixpanel.track('Calendar Home');
};
export const navigateToForumCategory = (params: Dict) => {
  mixpanel.track('Forum Category', params);
};
export const navigateToForumTopic = (params: Dict) => {
  mixpanel.track('Forum Topic', params);
};
export const navigateToForumQuestion = (params: Dict) => {
  mixpanel.track('Forum Question', params);
};
export const navigateToNewsCategory = (params: Dict) => {
  mixpanel.track('News Category', params);
};
export const navigateToAcademyCategory = (params: Dict) => {
  mixpanel.track('Academy Category', params);
};
export const navigateToWebinar = (params: Dict) => {
  mixpanel.track('Webibar View', params);
};
export const navigateToNewsArticle = (params: Dict) => {
  mixpanel.track('News Article', params);
};
export const navigateToAcademyArticle = (params: Dict) => {
  mixpanel.track('Academy Article', params);
};
export const commontPageView = (url: string) => {
  mixpanel.track('Page View', { url });
};
export const userLike = (params: Dict) => {
  mixpanel.track('Like', params);
};
export const userUnlike = (params: Dict) => {
  mixpanel.track('Unlike', params);
};
export const userMention = (params: Dict) => {
  mixpanel.track('Mention', params);
};
export const search = (params: Dict) => {
  mixpanel.track('Search', params);
};

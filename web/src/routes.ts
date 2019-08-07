const m = '/m/';
const sr = '/sr/';
const srProfile = `${sr}profile/`;
const srCompose = `${sr}compose/`;

export default {
  dashboard: {
    newPost: `${m}new-post`,
    editProfile: `${m}profile`,
  },
  sr: {
    profile: {
      getInfo: `${srProfile}get-info`,
      setInfo: `${srProfile}set-info`,
      setAvatar: `${srProfile}set-avatar`,
      setBio: `${srProfile}set-bio`,
    },
    compose: {
      setPost: `${srCompose}set-post`,
    },
  },
};

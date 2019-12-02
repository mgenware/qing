const m = '/m/';
const sr = '/s/r/';
const sp = '/s/p/';
const srProfile = `${sr}profile/`;
const srCompose = `${sr}compose/`;
const spCmt = `${sp}cmt/`;

export default {
  dashboard: {
    newPost: `${m}new-post`,
    editPost: `${m}edit-post`,
    editProfile: `${m}profile`,
  },
  sr: {
    reqCapt: `${sr}req-capt`,
    profile: {
      getInfo: `${srProfile}get-info`,
      setInfo: `${srProfile}set-info`,
      setAvatar: `${srProfile}set-avatar`,
      setBio: `${srProfile}set-bio`,
    },
    compose: {
      setPost: `${srCompose}set-post`,
      deletePost: `${srCompose}delete-post`,
      getPostForEditing: `${srCompose}get-for-editing`,
      setCmt: `${srCompose}set-cmt`,
    },
  },
  sp: {
    cmt: {
      list: `${spCmt}list`,
    },
  },
};

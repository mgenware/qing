import buildTree from 'fx214';

export default buildTree({
  m: {
    newPost: 'new-post',
    editPost: 'edit-post',
    editProfile: 'profile',
  },
  s: {
    r: {
      reqCapt: 'req-capt',
      profile: {
        getInfo: 'get-info',
        setInfo: 'set-info',
        setAvatar: 'set-avatar',
        setBio: 'set-bio',
      },
      compose: {
        setPost: 'set-post',
        deletePost: 'delete-post',
        getPostSource: 'get-post-src',
        setCmt: 'set-cmt',
      },
      auth: {
        signOut: 'signout',
      },
    },
    p: {
      cmt: {
        list: 'list',
      },
    },
  },
});

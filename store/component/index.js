export const state = () => ({
  sfc: true
});

export const mutations = {
  toggleSFC(state, item) {
    state.sfc = item;
  }
};

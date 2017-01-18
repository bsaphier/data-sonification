const initialState = {
  disabled: true,
  susresBtnText: 'Suspend context'
};

export default (state = initialState, action) => {

  // let osc, gainNode;
  const nextState = Object.assign({}, state);

  switch (action.type) {
    default:
      return nextState;
  }
};

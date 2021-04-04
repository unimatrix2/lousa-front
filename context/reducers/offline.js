export function offline(state, action) {
  switch (action.type) {
    case "OFFLINE":
      return { ...state, offline: action.payload };
    default:
      return state;
    }
};
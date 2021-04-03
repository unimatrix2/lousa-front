export function user(state, action) {
  switch (action.type) {
  	case "PROVIDE_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
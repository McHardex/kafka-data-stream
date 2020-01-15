export const checkDuplicate = (state, response) => state.filter(message => message.USERID === response.USERID);

export const updateDuplicate = (state, response) => (
    state.filter((message, i) => {
        if(message.USERID === response.USERID) {
            Object.assign(state[i], response);
        }
        return message;
    })
); 

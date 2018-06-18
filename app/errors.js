let errors = {
    invalid_user_data: {
        message: 'Invalid user or email',
        code: '400'
    },
    invalid_token:{
        message:'Invalid token',
        code:'400'
    },
    logs_not_found:{
        message: 'Logs not found',
        code:'400'
    }

};

module.exports = errors;
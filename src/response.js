module.exports = {
  "200" : {
    ok : true,
    code : 200,
    status : 'SUCCESS',
    message : '%s success',
    error : null,
    data : null
  },
  "403" : {
    ok : false,
    code : 403,
    status : 'UNAUTHORIZED',
    message : '%s unauthorized',
    error : null,
    data : null
  },
  "404" : {
    ok : false,
    code : 404,
    status : 'NOT_FOUND',
    message : '%s not found',
    error : null,
    data : null
  },
  "405" : {
    ok : false,
    code : 405,
    status : 'NOT_MODIFIED',
    message : '%s not modified',
    error : null,
    data : null
  },
  "406" : {
    ok : false,
    code : 406,
    status : 'DATA_INVALID',
    message : 'data invalid',
    error : null,
    data : null
  }
};
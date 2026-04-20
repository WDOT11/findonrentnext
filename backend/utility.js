/** Use to store the common function like JWT, FCM, verify token, Date Time etc. */


GLOBAL_SUCCESS_RESPONSE = (message, data, res) => {
    let responseBody = {
      statusCode: 200,
      status: STATUS_SUCCESS,
      message: message || "Success",
      data: data,
      error: null,
    };
    return res.send(responseBody);
  };
  
  GLOBAL_ERROR_RESPONSE = (message, error, res) => {
    let responseBody = {
      statusCode: 500,
      status: STATUS_ERROR,
      message: message || "Something went wrong.Please try again.",
      data: null,
      error: error,
    };
    return res.send(responseBody);
  };
  
  
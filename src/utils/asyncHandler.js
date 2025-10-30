
//for asyncawait wrapper

const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => next(err));
  };
};

export default asyncHandler;

// const asyncHandler = (requestHandler) => {
//   return async (req, res, next) => {
//     try {
//       await requestHandler(req, res, next);
//     } catch (err) {
//      res.status(err.code || 500).json({
         //   succes:false,
          //  message:err.message

       // })
//     }
//   };
// };


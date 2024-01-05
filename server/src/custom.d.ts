import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user: {
      username: string;
      email: string;
      org_code: string;
      // Add more custom properties as needed
    };
  }
}


// declare global {
//   namespace express{
//     interface Request{
//       user: {
//         username: string,
//         org_email: string,
//     // Add more custom properties as needed
//     }
//     }
//   }
// }

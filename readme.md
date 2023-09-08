# IronMeet

## Project Description

This project is an online dating application that allows users to meet up with new people, interact with other users, create events and join them. The application consists of a Node.js server with a RESTful API and a client that communicates with the server to provide an intuitive user interface.

## Server Structure

### Middlewares

- **auth.middleware.js**: Handles authentication and verifies user roles.
- **cloudinary.middleware.js**: Configures Cloudinary for image uploads.

### Models

- **User.model.js**: Defines the user data schema.
- **Event.model.js**: Defines the event data schema.
- **Message.model.js**: Defines the message data schema.

### Routes

- **auth.routes.js**: Routes related to authentication and user management.
- **event.routes.js**: Routes related to events management.
- **user.routes.js**: Routes related to user profiles, like function, swipe function and messaging.

## API Endpoints (Server Routes)

| HTTP Method | Route                                      | Description                                       | Request Body | Authentication Required | Success Response                         Error Response                           
|-------------|--------------------------------------------|---------------------------------------------------|--------------|--------------------------|-----------------------------------------------------|------------------------------------------|
| POST        | `/api/auth/signup`                         | Register a new user                               | See Below    | No                       | `{ message: "User created" }`                     | Error message                            |
| POST        | `/api/auth/login`                          | Login and create a user session                   | See Below    | No                       | `{ authToken: "<token>" }`                         | Error message                            |
| GET         | `/api/auth/verify`                         | Verify user's active status                       | None         | Yes                      | User's payload data                                 | Unauthorized error                       |
| GET         | `/api/events`                             | Get a list of all events                          | None         | Yes                      | List of events                                      | Error message                            |
| POST        | `/api/events/new-event`                    | Create a new event                                | See Below    | Yes                      | `{ message: "Event created" }`                     | Error message                            |
| GET         | `/api/events/:eventId/details`             | Get details of a specific event by ID            | `eventId`    | Yes                      | Event details                                       | Error message                            |
| PUT         | `/api/events/:eventId/edit`                | Edit an existing event by ID                      | `eventId`    | Yes                      | Updated event details                               | Error message                            |
| DELETE      | `/api/events/:eventId/delete`              | Delete an event by ID                             | `eventId`    | Yes                      | `{ message: "Event deleted" }`                     | Error message                            |
| GET         | `/api/profile`                            | Get the user's own profile                        | None         | Yes                      | User profile data                                   | Error message                            |
| PATCH       | `/api/profile/update`                     | Update the user's own profile                     | See Below    | Yes                      | Updated user profile data                           | Error message                            |
| GET         | `/api/:userId/profile`                    | Get the profile of another user by their ID      | `userId`     | Yes                      | Target user's profile data                          | Error message                            |
| PATCH       | `/api/:userId/profile/update`             | Update the profile of another user by their ID   | `userId`     | Yes                      | Updated target user's profile data                 | Error message                            |
| GET         | `/api/swipe`                              | Get users for swipe interaction based on preferences | None      | Yes                      | List of users for swipe interaction                | Error message                            |
| POST        | `/api/swipe/:userId/:action`              | Like or dislike another user                      | `userId`, `action` | Yes               | Interaction result message and list of users to swipe | Error message                            |
| GET         | `/api/matches`                            | Get a list of users who are matches with the current user | None  | Yes                      | List of matched users                               | Error message                            |
| POST        | `/api/addOrRemoveFavEvent/:eventId`        | Add or remove an event from the user's list of favorite events | `eventId` | Yes                 | Success message                                     | Error message                            |
| GET         | `/api/likedBy`                            | Get users who have liked the current user        | None         | Yes                      | List of users who like the current user             | Error message                            |
| PATCH       | `/api/:userId/like`                       | Start a chat with another user                    | `userId`     | Yes                      | `{ message: "Chat started successfully" }`          | Error message                            |

## Technologies Used

The project utilizes the following technologies:

- Node.js
- Express.js
- MongoDB (Mongoose)
- Cloudinary (for image uploads)
- JWT (JSON Web Tokens) for authentication
- Multer (for handling file uploads)

# Links

## Collaborators

- [Mark](https://github.com/Kratus9)
- [Omar](https://github.com/Naol75)

## Future Enhancements

- Make the app responsive for all kind of devices.

## Client Repositories

- [Client Repository](https://github.com/Kratus9/ironmeet-app-client)

## Server Repositories

- [Server Repository](https://github.com/Kratus9/ironmeet-app-server)

## Deploy link

- [(https://ironmeet.netlify.app/)]

## Slides

- [(https://www.canva.com/design/DAFt2yGRrBM/RfiXknI8tpdjo8Djx9CzoA/edit?utm_content=DAFt2yGRrBM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)]


# django-channels-chat
This is a simple real time chat application using Websocket, created as the final project of CS50w by Harvard University.

## Technologies
- Backend
    - Python
    - Django
    - Django Channels
    - Django Rest Framework

- Frontend
    - Html
    - Sass
    - Bootstrap
    - JavaScript

- Docker

## What I've learned
By developing this final project, I've learned a lot of new things and technologies, started to think more logically and learned how to research and read documentations.  I've needed to think and plan all parts of this project by myself, and it was really good for my developing as a professional, now I can thought on how things work before start coding and plan it better. 

## Distinctiveness and Complexity
The real time chat app that I've developed is different from the other projects because it uses another protocol instead of http to get it working. I decided to do this, because I've found out that there are more than the http protocol, so I've wanted to learn another one. 

Although this app is a simple application for the user, there is some complexity at coding it, because it uses a lot of technologies. It also uses APIs to link the frontend and the backend, the Websocket protocol to maintain a long connection between the client and server and Docker as the websocket "manager". 

I've basically used class-based views for coding all kind of views and tried to use the clean code principles, because it becomes easier to maintain and I've wanted to learn about Object Oriented Programing.
    
   

## Main Files

### chat/views.py
All the chat application views that render a template are in this file. This is where the pages are coded and the information about the template is sent to the client.

### chat/urls.py
The api and pages' routes are coded here.

### chat/models.py
All the relational database models that I coded. I've only used the User, ChatGroup and Message models yet.

### chat/decorators.py
This is where I coded the decorators that are kind of helpers used for check something before run the view.

### chat/api_views.py
All the api views that are used to give information when it receives a fetch request from the frontend client using JavaScript. It is useful to render stuff in a dynamic way without reloading the page.

### chat/permissions.py
The permissions used to configure the api views to authorize only who should see the information given.

### chat/serializers.py
This code converts some database object, like an user, to JSON format, so that the api view can render it. You can choose what are the fields you want to be rendered.

### chat/consumers.py
Here is where the Websocket connection is managed. Everything that is related to this connection, as the connect function, disconnect function, receive function and so on is coded in this file.
    
### chat/routing.py
This is the file where the websocket's routes are coded, for this project there is only one.

### channels_project/asgi.py
I've changed some configuration in this file, so that the app could use not only the http protocol, but also the websocket protocol.

### chat/static/chat/search.js
This is the script of the index and search page. Here the dynamic rendering of the search function and the index page is coded.

### chat/static/chat/chat.js
All the JavaScript for the chat page is coded here. The fetch request for the messages api helps rendering the messages at the screen.

### chat/static/sass/styles.sass
Instead of coding directly Css, I coded Sass, because it has useful features that we can use to code faster.


## How to run
1. Create a virtual environment and install the requirements
    - `py -3 -m venv venv`
    - `venv/Scripts/activate`
    - `pip3 install -r requirements.txt`

2. You need to install Docker Desktop and run this command
    - `docker run -p 6379:6379 -d redis:5`

3. Change directory to the project
    - `cd channels_project`

4. Start the server
    - `python manage.py runserver`


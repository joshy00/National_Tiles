# National_Tiles
Backend Dependencies:
mysql-connector-python@9.2.0
Flask@3.1.0
Flask-Cors@5.0.0

Frontend Dependencies:
cra-template@1.2.0
init@0.1.2
npx@10.2.2
react-dom@19.0.0
react-router-dom@7.1.5
react-scripts@5.0.1
react@19.0.0
web-vitals@4.2.4


How to use website:

1. Run MySQL server using provided National_Tiles schema.
2. Run db.py by using command "python db.py" in backend directory.
3. Start frontend by using command "npm start" in frontend directory.
***Ports may need to be adjusted to ensure MySQL, backend, and frontend can communicate correctly.

2 user accounts are available if db schema supplied is used.

username: admin 
password: admin

username: user
password: user


Important points:
1. Passwords were decided to be stored in plain text as a proof of concept, and to allow verification/updating of passwords and directly seeing the results in the db. In a production environment, further steps (hashing and salting) would be taken.
2. Other liberties were taken in the effort to allow transparency when viewing code and using application.

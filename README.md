# Grocery Store Management & Data Processing Project

This repository contains a full-stack project and data-processing scripts developed as part of the “Hadassim 5.0” IDF selection assignment.

## 🛠 Project Structure

### Part A – Python Scripts (Pandas & Parallel Processing)
- **Log Analysis (Section A)**: Extracts and ranks the top N error codes from a large log file.
- **Time Series Processing (Section B)**: Cleans time-series data and computes hourly averages using multiprocessing.
> To run:  
> `python partA/part1_logs.py` for log analysis  
> `python partA/part1_step1_hourly_avg.py` for time series aggregation
> `python partA/part2_step2_chunked_avg.py` for time series aggregation
> In Chapter 1, Section 1, I wrote the time complexity and space complexity in a comment at the end of the part1_logs.py file

### Part B – SQL (SQL Server)
- **Family Tree Modeling**: Builds `Person` and `FamilyTree` tables with parent/child/spouse relations and a final view of family connections.
> To run:  
> Open `partB/family_tree.sql` in SQL Server and execute step by step.

### Part D – Full Stack Store Management System (Node.js + React + MongoDB)
A system for suppliers and the store owner to manage product orders and inventory.

- **Client (React)**: Registration and login forms for suppliers with product upload.
- **Server (Node.js)**: REST API for user auth, product storage, and order management.
> To run the system:
> 1. Make sure [MongoDB Compass](https://www.mongodb.com/try/download/compass) is installed and a local MongoDB instance is running.
> 2.You need to go to the server folder in the terminal and run the npm install command , The same goes for the client folder.
> 3. In addition, you need to open mongoDBcompass and connect to the local server, the tables and changes will be displayed under the test database. There is a users and vendors table.
    To connect as an **manager**: Register as usual as a vendor, and then manually change the role field in MongoDB to manager in the vendors table using Compass.
    This improves security by preventing unauthorized users from accessing administrator privileges directly through the application.
> 4. In `/server`, run: `npm run dev`
> 5. In `/client`, run: `npm start`

Suppliers and the manager see live updates and actions in parallel, simulating a real-world system with different users on different devices.
I uploaded the server's env file so that the application can be run. There are no passwords or security information there (which is why this file is not usually uploaded).
---


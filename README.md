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
> 2. In `/server`, run: `npm run dev`
> 3. In `/client`, run: `npm start`
> 
> To login as **manager**: Register normally as a supplier, then manually change the `role` field in MongoDB to `"manager"` using Compass.  
> This enhances security by preventing unauthorized users from accessing manager privileges directly through the app.

Suppliers and the manager see live updates and actions in parallel, simulating a real-world system with different users on different devices.

---


-- Use the database
USE FamilyDB;
GO

-- Drop objects if they exist
IF OBJECT_ID('V_FamilyTree_WithNames', 'V') IS NOT NULL
    DROP VIEW V_FamilyTree_WithNames;
GO

IF OBJECT_ID('FamilyTree', 'U') IS NOT NULL
    DROP TABLE FamilyTree;
GO

IF OBJECT_ID('Person', 'U') IS NOT NULL
    DROP TABLE Person;
GO

-- Create Person table with Foreign Keys
CREATE TABLE Person (
    Person_ID INT PRIMARY KEY,
    First_Name NVARCHAR(50),
    Last_Name NVARCHAR(50),
    Gender NVARCHAR(10),
    Father_ID INT NULL,
    Mother_ID INT NULL,
    Spouse_ID INT NULL,
    FOREIGN KEY (Father_ID) REFERENCES Person(Person_ID),
    FOREIGN KEY (Mother_ID) REFERENCES Person(Person_ID),
    FOREIGN KEY (Spouse_ID) REFERENCES Person(Person_ID)
);
GO

-- Insert sample people
INSERT INTO Person VALUES 
(1, 'Danny', 'Cohen', 'Male', NULL, NULL, 2),
(2, 'Ronit', 'Cohen', 'Female', NULL, NULL, 1),
(3, 'Yossi', 'Cohen', 'Male', 1, 2, NULL),
(4, 'Noa', 'Cohen', 'Female', 1, 2, NULL);
GO

-- Create FamilyTree table with Foreign Keys
CREATE TABLE FamilyTree (
    Person_ID INT,
    Relative_ID INT,
    Connection_Type NVARCHAR(20),
    PRIMARY KEY (Person_ID, Relative_ID, Connection_Type),
    FOREIGN KEY (Person_ID) REFERENCES Person(Person_ID),
    FOREIGN KEY (Relative_ID) REFERENCES Person(Person_ID)
);
GO

-- Insert relationships: Father, Mother
INSERT INTO FamilyTree (Person_ID, Relative_ID, Connection_Type)
SELECT Person_ID, Father_ID, N'Father'
FROM Person
WHERE Father_ID IS NOT NULL

UNION ALL

SELECT Person_ID, Mother_ID, N'Mother'
FROM Person
WHERE Mother_ID IS NOT NULL;
GO

-- Insert reciprocal relationships: Son/Daughter (parent → child)
INSERT INTO FamilyTree (Person_ID, Relative_ID, Connection_Type)
SELECT P.Father_ID, P.Person_ID,
       CASE WHEN P.Gender = 'Male' THEN N'Son' ELSE N'Daughter' END
FROM Person P
WHERE P.Father_ID IS NOT NULL

UNION ALL

SELECT P.Mother_ID, P.Person_ID,
       CASE WHEN P.Gender = 'Male' THEN N'Son' ELSE N'Daughter' END
FROM Person P
WHERE P.Mother_ID IS NOT NULL;
GO

-- Insert spouse relationships
INSERT INTO FamilyTree (Person_ID, Relative_ID, Connection_Type)
SELECT Person_ID, Spouse_ID,
       CASE WHEN Gender = 'Male' THEN N'Wife' ELSE N'Husband' END
FROM Person
WHERE Spouse_ID IS NOT NULL;

-- Add reciprocal spouse relationships if missing
INSERT INTO FamilyTree (Person_ID, Relative_ID, Connection_Type)
SELECT P.Spouse_ID, P.Person_ID,
       CASE WHEN P.Gender = 'Male' THEN N'Husband' ELSE N'Wife' END
FROM Person P
WHERE P.Spouse_ID IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM FamilyTree FT
      WHERE FT.Person_ID = P.Spouse_ID
        AND FT.Relative_ID = P.Person_ID
        AND FT.Connection_Type IN (N'Husband', N'Wife')
  );
GO

-- Create a view with names
CREATE VIEW V_FamilyTree_WithNames AS
SELECT 
    FT.Person_ID,
    P1.First_Name + ' ' + P1.Last_Name AS Person_Name,
    FT.Connection_Type,
    FT.Relative_ID,
    P2.First_Name + ' ' + P2.Last_Name AS Relative_Name
FROM FamilyTree FT
JOIN Person P1 ON FT.Person_ID = P1.Person_ID
JOIN Person P2 ON FT.Relative_ID = P2.Person_ID;
GO

-- Example output query
SELECT * FROM V_FamilyTree_WithNames;

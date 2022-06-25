---------------------TASK 1----------------------
-- cyf_classes.sql created 
-------------------------------------------------

---------------------TASK 2----------------------
-- table "mentors" created

CREATE TABLE mentors (
    id                      SERIAL PRIMARY KEY,
    name                    VARCHAR(30) NOT NULL,
    years_lived_Glasglow    INT NOT NULL,
    address                 VARCHAR(30),
    favorite_lenguage       VARCHAR(30)
);
-------------------------------------------------

---------------------TASK 3----------------------
-- 5 mentors inserted
INSERT INTO mentors (name, years_lived_Glasglow, address, favorite_lenguage)
          VALUES    ('Eduard', 10, 'Barcelona 1234', 'JavaScript'),
                    ('Anna', 21, 'Madrid 253', 'CSS'),
                    ('Javi', 7, 'Getafe 1120', 'Python'),
                    ('Miguel', 2, 'Valencia 534', 'C+'),
                    ('Brandy', 5, 'Mayorca 901', 'PHP');
-------------------------------------------------

---------------------TASK 4----------------------
-- table "students" created

CREATE TABLE students (
    id                      SERIAL PRIMARY KEY,
    name                    VARCHAR(30) NOT NULL,
    address                 VARCHAR(30),
    graduate_from_CYF       BOOLEAN NOT NULL
);
-------------------------------------------------

---------------------TASK 5----------------------
-- 10 students inserted

INSERT INTO students(name, address, graduate_from_CYF)
            VALUES  ('Valeria', 'Argentina 255', 'true'),
                    ('Joao', 'Perú 443', 'true'),
                    ('Vanessa', 'Colombia 1134', 'false'),
                    ('Diego', 'España 3151', 'true'),
                    ('Angel', 'Cuba 454', 'false'),
                    ('Yhenifer', 'Venezuela 340', 'false'),
                    ('Miguel', 'Ecuador 401', 'true'),
                    ('Laeken', 'Cuba 993', 'true'),
                    ('Diana', 'Grecia 453', 'true'),
                    ('Ali', 'India 1212', 'true');
-------------------------------------------------

---------------------TASK 6----------------------
--Verify the data

select * from mentors 
select * from students
-------------------------------------------------

---------------------TASK 7----------------------
-- table "classes" created

CREATE TABLE classes (
    id                      SERIAL PRIMARY KEY,
    mentors_id             INT REFERENCES mentors(id),
    topic                   VARCHAR(30),
    class_date              DATE NOT NULL,
    class_location          VARCHAR(30)
);
-------------------------------------------------

---------------------TASK 8----------------------
--few classes inserted

INSERT INTO classes (mentors_id, topic, class_date, class_location)
            VALUES  (2, 'Python', '2022-06-30', 'Madrid 211'),
                    (5,'JavaScript', '2022-07-01','Barcelona 592'),
                    (3,'JavaScript', '2022-07-02','Getafe 112'),
                    (1,'CSS', '2022-07-04','Cataluña 476'),
                    (4,'PHP', '2022-07-05','Bilbao 1128');
-------------------------------------------------

---------------------TASK 9----------------------
--class per student

CREATE TABLE class_per_student (
    id                      SERIAL PRIMARY KEY,
    student_id              INT REFERENCES students(id),
    class_id                INT REFERENCES classes(id)
);

INSERT INTO class_per_student (student_id, class_id) 
                       VALUES (2, 3),
                              (5, 1),
                              (8, 4),
                              (1, 2),
                              (3, 5);

SELECT * FROM class_per_student
-------------------------------------------------

---------------------TASK 10---------------------
--mentors who lived more than 5 years in Glasgow
select * from mentors WHERE years_lived_Glasglow<10;

--mentors whose favourite language is Javascript
select * from mentors WHERE favorite_lenguage='JavaScript'

--students who are CYF graduates
select * from students WHERE graduate_from_CYF='TRUE'

--classes taught before July this year
select * from classes WHERE class_date <'2022-07-01'

--students who attended the Javascript class 
select * from class_per_student where class_id = 2 or class_id = 3
-------------------------------------------------
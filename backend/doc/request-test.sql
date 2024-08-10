select * from timesheet_student
select * from timesheet_teacher
select * from timesheet_signature
select * from timesheet_teacher_has_student 


-- recap par date
SELECT 
  timesheet_student.lastname AS student_lastname,
  timesheet_student.firstname AS student_firstname,
  timesheet_teacher.lastname AS teacher_lastname,
  timesheet_teacher.firstname AS teacher_firstname,
  COUNT(*) AS intervention,
  COUNT(CASE WHEN timesheet_signature.shifting THEN 1 END) AS deplacement,
  SUM(timesheet_signature.end_time - timesheet_signature.start_time) AS duration,
  SUM(
    ROUND( 
      CAST(
        float8 (EXTRACT(HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
        + (EXTRACT(MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time)) / 60) AS numeric
      ), 2
    )
  ) AS deci_duration
FROM timesheet_signature
JOIN timesheet_student ON timesheet_student.id = timesheet_signature.student_id
JOIN timesheet_teacher ON timesheet_teacher.id = timesheet_signature.teacher_id
WHERE timesheet_signature.signature_date >= '2023-09-01'
  AND timesheet_signature.signature_date <= '2024-08-31'
GROUP BY timesheet_student.id, timesheet_teacher.id;


-- 

select * 
      from timesheet_student
      where id not IN (
      
      select
      timesheet_student.id as student_id
      from timesheet_teacher_has_student
      join timesheet_teacher on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
      join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id
      where timesheet_teacher.id = 1 and timesheet_teacher_has_student.is_visible = true
      
      ) and timesheet_student.is_visible = true

      
       or 

select * from timesheet_student where is_visible = false


UPDATE timesheet_teacher_has_student  SET is_visible = FALSE WHERE id = 1;

select is_admin
from timesheet_teacher
where is_admin = true

select * from timesheet_student where is_visible = true






select
      timesheet_teacher.id,
      timesheet_teacher.lastname,
      timesheet_teacher.firstname,
      timesheet_teacher.email,
      timesheet_teacher.is_admin,
      COALESCE(json_agg(json_build_object('id_link',timesheet_teacher_has_student.id,'id',timesheet_student.id,'firstname',timesheet_student.firstname,'lastname',timesheet_student.lastname)) FILTER (WHERE timesheet_student.lastname IS NOT null and timesheet_student.is_visible = true and timesheet_teacher_has_student.is_visible = true ), '[]') AS students
      from timesheet_teacher
      left join timesheet_teacher_has_student on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
      left join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id 
      where timesheet_teacher.is_visible = true
      group by timesheet_teacher.id


      
      
      
      
      
select * 
from timesheet_teacher_has_student 

select
timesheet_teacher.id,
timesheet_teacher.lastname,
timesheet_teacher.firstname,
timesheet_teacher.email,
COALESCE(
	json_agg(
		json_build_object('id_link',timesheet_teacher_has_student.id,'id',timesheet_student.id,'firstname',timesheet_student.firstname,'lastname',timesheet_student.lastname)
			)
FILTER (
	WHERE timesheet_student.firstname IS NOT null
		), '[]'
		
		) 
AS student
from timesheet_teacher
full join timesheet_teacher_has_student on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
full join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id 
group by timesheet_teacher.id



select
timesheet_teacher.id,
timesheet_teacher.lastname,
timesheet_teacher.firstname,
timesheet_teacher.email
from timesheet_teacher
full join timesheet_teacher_has_student on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id 


delete from timesheet_teacher_has_student where id = 2;
delete from timesheet_teacher where id = 19;
delete from timesheet_teacher where id = 10;
delete from timesheet_teacher where id = 17;

select       
		timesheet_teacher.id,
      timesheet_teacher.lastname,
      timesheet_teacher.firstname
      from timesheet_teacher where is_visible = false


  addStudentAtTeacher: async (teacherId, studentId) => {
    const query = {
      text: `INSERT INTO timesheet_teacher_has_student (teacher_id, student_id)
      VALUES 
      ($1,$2)
      RETURNING *`,
      values: [teacherId, studentId],
    };

    const student = (await dataBase.query(query)).rows[0];

    debug(`> addStudentAtTeacher()`);
    if (!student) {
      throw new ApiError("No data found for addStudentAtTeacher()", 404);
    }
    return student;
  },
  
delete from timesheet_teacher_has_student where teacher_id = 21 and student_id = 7
delete from timesheet_signature where id = 2;

INSERT INTO timesheet_teacher (lastname, firstname, email, password, is_admin)
VALUES 
('lea','cotavoze','lea@gmail.com','1234',true),
('moris','lilo','moris@gmail.com','1234',false);

INSERT INTO timesheet_student (lastname, firstname)
VALUES 
('paul','cosma'),
('alice','lefebvre');

update timesheet_teacher
SET 
  lastname = 'jumengi',
  firstname  = 'ligi',
  email = 'roro@gmail.com',
  is_admin = true
WHERE id = 9


INSERT INTO timesheet_signature (teacher_id, student_id, signature_date, start_time, end_time, shifting)
VALUES 
(6,6,'2023-03-05','03:00:00','04:15:00',false),
(5,6,'2023-03-03','00:26:34','01:26:34',true)



select * from timesheet_signature where id = 6


UPDATE timesheet_signature
SET 
  signature_date = '2023-03-05',
  start_time = '03:00:00',
  end_time = '03:00:00',
  shifting = false
WHERE id = 11

select password from timesheet_teacher where id = 19

UPDATE timesheet_teacher
SET 
  password = '$2b$10$w7PltGOVi0z4fWXdsKt9MeLeJBTnqk5cLSBco00jcYmCLhm2hS6kO'
WHERE id = 19



INSERT INTO timesheet_teacher_has_student (teacher_id, student_id)
VALUES 
(21,7)
returning id

(select
timesheet_teacher_has_student.id as link_id,

timesheet_teacher.id as teacher_id,
timesheet_teacher.lastname as teacher_lastname,
timesheet_teacher.firstname as teacher_firstname,

timesheet_student.id as student_id,
timesheet_student.lastname as student_lastname,
timesheet_student.firstname as student_firstname
from timesheet_teacher_has_student
join timesheet_teacher on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id
where timesheet_teacher_has_student.id = id)



delete from timesheet_teacher_has_student where teacher_id = 21 and student_id = 7 returning *;


select
timesheet_student.id as student_id
from timesheet_teacher_has_student
join timesheet_teacher on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id
where timesheet_teacher.id = 39

select * 
from timesheet_student
where id not IN (select
timesheet_student.id as student_id
from timesheet_teacher_has_student
join timesheet_teacher on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id
where timesheet_teacher.id = 39)


-- GET MY STUDENT

select
timesheet_student.id,
timesheet_student.lastname,
timesheet_student.firstname
from timesheet_teacher_has_student
join timesheet_student on timesheet_teacher_has_student.student_id = timesheet_student.id
where teacher_id = 6

-- GET MY SIGNATURE

select 
timesheet_signature.id,
timesheet_signature.signature_date,
timesheet_signature.start_time ,
timesheet_signature.end_time ,
timesheet_signature.shifting ,
(timesheet_signature.end_time - timesheet_signature.start_time) as duration,

round( CAST(float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
+ 
(EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric), 2)
  as deci_duration,
  
timesheet_student.id as student_id,
timesheet_student.lastname as student_lastname,
timesheet_student.firstname as student_firstname
from timesheet_signature
join timesheet_student on timesheet_student.id = timesheet_signature.student_id
where teacher_id = 5
and timesheet_student.id = 6
AND (EXTRACT (MONTH FROM timesheet_signature.signature_date))  = 3 
AND (EXTRACT (YEAR FROM timesheet_signature.signature_date))  = 2023
order by signature_date

-- recap

select 
timesheet_student.lastname as student_lastname,
timesheet_student.firstname as student_firstname,
timesheet_teacher.lastname as teacher_lastname,
timesheet_teacher.firstname as teacher_firstname,
count(*) as intervention,
count(CASE WHEN timesheet_signature.shifting THEN 1 END) as deplacement,
sum((timesheet_signature.end_time - timesheet_signature.start_time)) as duration,
sum(
	round( 
		CAST(
			float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
					+ 
				   (EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric
			 ), 2
		 )
	)
as deci_duration
from timesheet_signature
join timesheet_student on timesheet_student.id = timesheet_signature.student_id
join timesheet_teacher on timesheet_teacher.id = timesheet_signature.teacher_id
AND (EXTRACT (MONTH FROM timesheet_signature.signature_date))  = 3
AND (EXTRACT (YEAR FROM timesheet_signature.signature_date))  = 2023
GROUP BY timesheet_student.id , timesheet_teacher.id

-- detail


select 
timesheet_signature.id,
timesheet_student.lastname as student_lastname,
timesheet_student.firstname as student_firstname,
timesheet_teacher.lastname as teacher_lastname,
timesheet_teacher.firstname as teacher_firstname,
timesheet_signature.signature_date,
timesheet_signature.start_time ,
timesheet_signature.end_time ,
(timesheet_signature.end_time - timesheet_signature.start_time) as duration,

	round( 
		CAST(
			float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
					+ 
				   (EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric
			 ), 2
		 )
as deci_duration
from timesheet_signature
join timesheet_student on timesheet_student.id = timesheet_signature.student_id
join timesheet_teacher on timesheet_teacher.id = timesheet_signature.teacher_id
AND (EXTRACT (MONTH FROM timesheet_signature.signature_date))  = 3
AND (EXTRACT (YEAR FROM timesheet_signature.signature_date))  = 2023



select 
      timesheet_student.lastname as student_lastname,
      timesheet_student.firstname as student_firstname,
      timesheet_teacher.lastname as teacher_lastname,
      timesheet_teacher.firstname as teacher_firstname,
      count(*) as intervention,
      count(CASE WHEN timesheet_signature.shifting THEN 1 END) as deplacement,
      sum((timesheet_signature.end_time - timesheet_signature.start_time)) as duration,
      sum(
        round( 
          CAST(
            float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
                + 
                 (EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric
             ), 2
           )
        )
      as deci_duration
      from timesheet_signature
      join timesheet_student on timesheet_student.id = timesheet_signature.student_id
      join timesheet_teacher on timesheet_teacher.id = timesheet_signature.teacher_id
      AND (EXTRACT (MONTH FROM timesheet_signature.signature_date))  = 5
      AND (EXTRACT (YEAR FROM timesheet_signature.signature_date))  = 2023
      GROUP BY timesheet_student.id , timesheet_teacher.id







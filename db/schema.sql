DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department(
  dept_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE role(
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER,
  CONSTRAINT fk_department
  FOREIGN KEY(department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

CREATE TABLE employee(
  emp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,

  --reference role_id, set role(id) to null when deleted 
  CONSTRAINT fk_role
  FOREIGN KEY(role_id)
  REFERENCES role(id)
  ON DELETE SET NULL,

  CONSTRAINT fk_manager
  FOREIGN KEY(manager_id)
  REFERENCES employee(id)
  ON DELETE SET NULL
  --https: //www.techonthenet.com/sql_server/foreign_keys/foreign_delete_null.php
);
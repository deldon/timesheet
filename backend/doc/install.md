# instalation de node-user

## Crée une bdd

```
sudo -i -u postgres psql
```

```
CREATE DATABASE new_project OWNER myuser;
```
```
exit
```

## Modifier le fichier exemple.env

## Sqitch
Initaliser sqitche

```
sqitch init nom_projet --engine pg --target db:pg:new_project --top-dir migrations
```
Crée une migration pour les user

```
sqitch add user-migration -m "init user migration"
```
### deploy

```SQL
BEGIN;

CREATE TABLE "new_project_user" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE OR REPLACE FUNCTION add_user(d json) RETURNS new_project_user AS $$

    INSERT INTO new_project_user
    (name, email, password, description, avatar)
    VALUES(
        (d->>'name')::text,
        (d->>'email')::text,
		(d->>'password')::text,
		(d->>'description')::text,
        (d->>'avatar')::text
		
    ) RETURNING *;

$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION update_user(d json,user_id int) RETURNS new_project_user AS $$

	UPDATE new_project_user
	SET
		name = (d->>'name')::text,
        email = (d->>'email')::text,
		description = (d->>'description')::text,
        avatar = (d->>'avatar')::text,
		updated_at = NOW()
		WHERE id = user_id
		
	RETURNING *;
	
$$ LANGUAGE sql;
-- XXX Add DDLs here.
COMMIT;



```
### revert

```SQL
DROP FUNCTION IF EXISTS update_user;
DROP FUNCTION IF EXISTS add_user;
DROP TABLE IF EXISTS user;
```

## Modifier dans datamapper/userDatamapper les de la bdd



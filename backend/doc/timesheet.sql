--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sqitch; Type: SCHEMA; Schema: -; Owner: timesheet
--

CREATE SCHEMA sqitch;


ALTER SCHEMA sqitch OWNER TO timesheet;

--
-- Name: SCHEMA sqitch; Type: COMMENT; Schema: -; Owner: timesheet
--

COMMENT ON SCHEMA sqitch IS 'Sqitch database deployment metadata v1.1.';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: timesheet_signature; Type: TABLE; Schema: public; Owner: timesheet
--

CREATE TABLE public.timesheet_signature (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    student_id integer NOT NULL,
    signature_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    shifting boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.timesheet_signature OWNER TO timesheet;

--
-- Name: timesheet_signature_id_seq; Type: SEQUENCE; Schema: public; Owner: timesheet
--

ALTER TABLE public.timesheet_signature ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.timesheet_signature_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: timesheet_student; Type: TABLE; Schema: public; Owner: timesheet
--

CREATE TABLE public.timesheet_student (
    id integer NOT NULL,
    lastname text NOT NULL,
    firstname text NOT NULL,
    is_visible boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.timesheet_student OWNER TO timesheet;

--
-- Name: timesheet_student_id_seq; Type: SEQUENCE; Schema: public; Owner: timesheet
--

ALTER TABLE public.timesheet_student ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.timesheet_student_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: timesheet_teacher; Type: TABLE; Schema: public; Owner: timesheet
--

CREATE TABLE public.timesheet_teacher (
    id integer NOT NULL,
    lastname text NOT NULL,
    firstname text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    is_admin boolean,
    is_visible boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.timesheet_teacher OWNER TO timesheet;

--
-- Name: timesheet_teacher_has_student; Type: TABLE; Schema: public; Owner: timesheet
--

CREATE TABLE public.timesheet_teacher_has_student (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    student_id integer NOT NULL,
    is_visible boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.timesheet_teacher_has_student OWNER TO timesheet;

--
-- Name: timesheet_teacher_has_student_id_seq; Type: SEQUENCE; Schema: public; Owner: timesheet
--

ALTER TABLE public.timesheet_teacher_has_student ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.timesheet_teacher_has_student_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: timesheet_teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: timesheet
--

ALTER TABLE public.timesheet_teacher ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.timesheet_teacher_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: changes; Type: TABLE; Schema: sqitch; Owner: timesheet
--

CREATE TABLE sqitch.changes (
    change_id text NOT NULL,
    script_hash text,
    change text NOT NULL,
    project text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    committed_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    committer_name text NOT NULL,
    committer_email text NOT NULL,
    planned_at timestamp with time zone NOT NULL,
    planner_name text NOT NULL,
    planner_email text NOT NULL
);


ALTER TABLE sqitch.changes OWNER TO timesheet;

--
-- Name: TABLE changes; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON TABLE sqitch.changes IS 'Tracks the changes currently deployed to the database.';


--
-- Name: COLUMN changes.change_id; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.change_id IS 'Change primary key.';


--
-- Name: COLUMN changes.script_hash; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.script_hash IS 'Deploy script SHA-1 hash.';


--
-- Name: COLUMN changes.change; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.change IS 'Name of a deployed change.';


--
-- Name: COLUMN changes.project; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.project IS 'Name of the Sqitch project to which the change belongs.';


--
-- Name: COLUMN changes.note; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.note IS 'Description of the change.';


--
-- Name: COLUMN changes.committed_at; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.committed_at IS 'Date the change was deployed.';


--
-- Name: COLUMN changes.committer_name; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.committer_name IS 'Name of the user who deployed the change.';


--
-- Name: COLUMN changes.committer_email; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.committer_email IS 'Email address of the user who deployed the change.';


--
-- Name: COLUMN changes.planned_at; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.planned_at IS 'Date the change was added to the plan.';


--
-- Name: COLUMN changes.planner_name; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.planner_name IS 'Name of the user who planed the change.';


--
-- Name: COLUMN changes.planner_email; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.changes.planner_email IS 'Email address of the user who planned the change.';


--
-- Name: dependencies; Type: TABLE; Schema: sqitch; Owner: timesheet
--

CREATE TABLE sqitch.dependencies (
    change_id text NOT NULL,
    type text NOT NULL,
    dependency text NOT NULL,
    dependency_id text,
    CONSTRAINT dependencies_check CHECK ((((type = 'require'::text) AND (dependency_id IS NOT NULL)) OR ((type = 'conflict'::text) AND (dependency_id IS NULL))))
);


ALTER TABLE sqitch.dependencies OWNER TO timesheet;

--
-- Name: TABLE dependencies; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON TABLE sqitch.dependencies IS 'Tracks the currently satisfied dependencies.';


--
-- Name: COLUMN dependencies.change_id; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.dependencies.change_id IS 'ID of the depending change.';


--
-- Name: COLUMN dependencies.type; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.dependencies.type IS 'Type of dependency.';


--
-- Name: COLUMN dependencies.dependency; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.dependencies.dependency IS 'Dependency name.';


--
-- Name: COLUMN dependencies.dependency_id; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.dependencies.dependency_id IS 'Change ID the dependency resolves to.';


--
-- Name: events; Type: TABLE; Schema: sqitch; Owner: timesheet
--

CREATE TABLE sqitch.events (
    event text NOT NULL,
    change_id text NOT NULL,
    change text NOT NULL,
    project text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    requires text[] DEFAULT '{}'::text[] NOT NULL,
    conflicts text[] DEFAULT '{}'::text[] NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    committed_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    committer_name text NOT NULL,
    committer_email text NOT NULL,
    planned_at timestamp with time zone NOT NULL,
    planner_name text NOT NULL,
    planner_email text NOT NULL,
    CONSTRAINT events_event_check CHECK ((event = ANY (ARRAY['deploy'::text, 'revert'::text, 'fail'::text, 'merge'::text])))
);


ALTER TABLE sqitch.events OWNER TO timesheet;

--
-- Name: TABLE events; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON TABLE sqitch.events IS 'Contains full history of all deployment events.';


--
-- Name: COLUMN events.event; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.event IS 'Type of event.';


--
-- Name: COLUMN events.change_id; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.change_id IS 'Change ID.';


--
-- Name: COLUMN events.change; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.change IS 'Change name.';


--
-- Name: COLUMN events.project; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.project IS 'Name of the Sqitch project to which the change belongs.';


--
-- Name: COLUMN events.note; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.note IS 'Description of the change.';


--
-- Name: COLUMN events.requires; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.requires IS 'Array of the names of required changes.';


--
-- Name: COLUMN events.conflicts; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.conflicts IS 'Array of the names of conflicting changes.';


--
-- Name: COLUMN events.tags; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.tags IS 'Tags associated with the change.';


--
-- Name: COLUMN events.committed_at; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.committed_at IS 'Date the event was committed.';


--
-- Name: COLUMN events.committer_name; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.committer_name IS 'Name of the user who committed the event.';


--
-- Name: COLUMN events.committer_email; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.committer_email IS 'Email address of the user who committed the event.';


--
-- Name: COLUMN events.planned_at; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.planned_at IS 'Date the event was added to the plan.';


--
-- Name: COLUMN events.planner_name; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.planner_name IS 'Name of the user who planed the change.';


--
-- Name: COLUMN events.planner_email; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.events.planner_email IS 'Email address of the user who plan planned the change.';


--
-- Name: projects; Type: TABLE; Schema: sqitch; Owner: timesheet
--

CREATE TABLE sqitch.projects (
    project text NOT NULL,
    uri text,
    created_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    creator_name text NOT NULL,
    creator_email text NOT NULL
);


ALTER TABLE sqitch.projects OWNER TO timesheet;

--
-- Name: TABLE projects; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON TABLE sqitch.projects IS 'Sqitch projects deployed to this database.';


--
-- Name: COLUMN projects.project; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.projects.project IS 'Unique Name of a project.';


--
-- Name: COLUMN projects.uri; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.projects.uri IS 'Optional project URI';


--
-- Name: COLUMN projects.created_at; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.projects.created_at IS 'Date the project was added to the database.';


--
-- Name: COLUMN projects.creator_name; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.projects.creator_name IS 'Name of the user who added the project.';


--
-- Name: COLUMN projects.creator_email; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.projects.creator_email IS 'Email address of the user who added the project.';


--
-- Name: releases; Type: TABLE; Schema: sqitch; Owner: timesheet
--

CREATE TABLE sqitch.releases (
    version real NOT NULL,
    installed_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    installer_name text NOT NULL,
    installer_email text NOT NULL
);


ALTER TABLE sqitch.releases OWNER TO timesheet;

--
-- Name: TABLE releases; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON TABLE sqitch.releases IS 'Sqitch registry releases.';


--
-- Name: COLUMN releases.version; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.releases.version IS 'Version of the Sqitch registry.';


--
-- Name: COLUMN releases.installed_at; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.releases.installed_at IS 'Date the registry release was installed.';


--
-- Name: COLUMN releases.installer_name; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.releases.installer_name IS 'Name of the user who installed the registry release.';


--
-- Name: COLUMN releases.installer_email; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.releases.installer_email IS 'Email address of the user who installed the registry release.';


--
-- Name: tags; Type: TABLE; Schema: sqitch; Owner: timesheet
--

CREATE TABLE sqitch.tags (
    tag_id text NOT NULL,
    tag text NOT NULL,
    project text NOT NULL,
    change_id text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    committed_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    committer_name text NOT NULL,
    committer_email text NOT NULL,
    planned_at timestamp with time zone NOT NULL,
    planner_name text NOT NULL,
    planner_email text NOT NULL
);


ALTER TABLE sqitch.tags OWNER TO timesheet;

--
-- Name: TABLE tags; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON TABLE sqitch.tags IS 'Tracks the tags currently applied to the database.';


--
-- Name: COLUMN tags.tag_id; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.tag_id IS 'Tag primary key.';


--
-- Name: COLUMN tags.tag; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.tag IS 'Project-unique tag name.';


--
-- Name: COLUMN tags.project; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.project IS 'Name of the Sqitch project to which the tag belongs.';


--
-- Name: COLUMN tags.change_id; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.change_id IS 'ID of last change deployed before the tag was applied.';


--
-- Name: COLUMN tags.note; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.note IS 'Description of the tag.';


--
-- Name: COLUMN tags.committed_at; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.committed_at IS 'Date the tag was applied to the database.';


--
-- Name: COLUMN tags.committer_name; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.committer_name IS 'Name of the user who applied the tag.';


--
-- Name: COLUMN tags.committer_email; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.committer_email IS 'Email address of the user who applied the tag.';


--
-- Name: COLUMN tags.planned_at; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.planned_at IS 'Date the tag was added to the plan.';


--
-- Name: COLUMN tags.planner_name; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.planner_name IS 'Name of the user who planed the tag.';


--
-- Name: COLUMN tags.planner_email; Type: COMMENT; Schema: sqitch; Owner: timesheet
--

COMMENT ON COLUMN sqitch.tags.planner_email IS 'Email address of the user who planned the tag.';


--
-- Data for Name: timesheet_signature; Type: TABLE DATA; Schema: public; Owner: timesheet
--

COPY public.timesheet_signature (id, teacher_id, student_id, signature_date, start_time, end_time, shifting, created_at) FROM stdin;
2	4	2	2023-05-31	00:21:00	01:21:00	t	2023-05-31 01:21:22.221488+02
3	4	8	2023-05-31	00:21:00	01:21:00	t	2023-05-31 01:21:29.503641+02
5	1	4	2023-05-31	14:07:00	15:07:00	t	2023-05-31 15:07:10.034+02
6	1	5	2023-05-31	14:13:00	15:13:00	f	2023-05-31 15:13:22.446164+02
10	1	11	2023-05-31	16:11:00	17:11:00	t	2023-05-31 17:11:16.768796+02
11	1	7	2023-04-05	16:11:00	17:11:00	t	2023-05-31 17:11:28.501156+02
12	10	3	2023-05-31	16:19:00	17:19:00	t	2023-05-31 17:19:38.474456+02
14	10	33	2023-05-31	16:20:00	17:20:00	t	2023-05-31 17:20:25.123152+02
15	10	4	2023-05-31	16:20:00	18:20:00	t	2023-05-31 17:20:28.417659+02
13	10	18	2023-05-31	16:20:00	21:50:00	t	2023-05-31 17:20:19.827012+02
16	10	3	2023-05-31	16:20:00	17:20:00	f	2023-05-31 17:20:31.689776+02
18	10	4	2023-05-31	11:00:00	18:05:00	t	2023-05-31 22:28:26.464402+02
25	10	3	2023-05-31	19:28:00	22:28:00	t	2023-05-31 22:30:32.199954+02
26	10	3	2023-05-31	01:30:00	02:30:00	t	2023-05-31 22:30:46.419436+02
27	10	5	2023-05-31	21:30:00	22:30:00	t	2023-05-31 22:30:55.066353+02
20	10	3	2023-05-31	17:28:00	21:28:00	t	2023-05-31 22:28:38.42127+02
19	10	3	2023-05-31	16:28:00	22:28:00	t	2023-05-31 22:28:37.213863+02
\.


--
-- Data for Name: timesheet_student; Type: TABLE DATA; Schema: public; Owner: timesheet
--

COPY public.timesheet_student (id, lastname, firstname, is_visible, created_at) FROM stdin;
3	aubert		t	2023-05-30 20:19:35.75096+02
4	ayme		t	2023-05-30 20:19:35.843241+02
5	belle		t	2023-05-30 20:19:36.026193+02
6	ben allal		t	2023-05-30 20:19:36.028235+02
7	adam (gueusquin)		t	2023-05-30 20:19:36.029512+02
8	adam		t	2023-05-30 20:19:36.029838+02
9	bensoussan		t	2023-05-30 20:19:36.077449+02
10	bergey		t	2023-05-30 20:19:36.078526+02
11	boyer		t	2023-05-30 20:19:36.079171+02
12	bremer		t	2023-05-30 20:19:36.079599+02
13	burdet		t	2023-05-30 20:19:36.080386+02
14	chala		t	2023-05-30 20:19:36.080948+02
15	chavant		t	2023-05-30 20:19:36.081838+02
16	chokhad leduc sahli		t	2023-05-30 20:19:36.083145+02
17	cirica		t	2023-05-30 20:19:36.084278+02
18	collavet		t	2023-05-30 20:19:36.085316+02
19	costa alonso		t	2023-05-30 20:19:36.086262+02
20	couvert		t	2023-05-30 20:19:36.087209+02
21	dechangy		t	2023-05-30 20:19:36.08805+02
22	demaison mermet		t	2023-05-30 20:19:36.088889+02
23	deverciourt		t	2023-05-30 20:19:36.089818+02
24	dieng		t	2023-05-30 20:19:36.092708+02
25	eldin		t	2023-05-30 20:19:36.093143+02
26	feougier		t	2023-05-30 20:19:36.09523+02
27	foret		t	2023-05-30 20:19:36.096186+02
28	frys nora		t	2023-05-30 20:19:36.09701+02
29	gaillard		t	2023-05-30 20:19:36.097829+02
30	gauron		t	2023-05-30 20:19:36.098643+02
31	gonnelaz		t	2023-05-30 20:19:36.099412+02
32	gradenigo		t	2023-05-30 20:19:36.100284+02
33	hilbert		t	2023-05-30 20:19:36.105413+02
34	jouhet mossiere		t	2023-05-30 20:19:36.106243+02
35	laumay		t	2023-05-30 20:19:36.110235+02
36	le meur		t	2023-05-30 20:19:36.111071+02
37	litzler		t	2023-05-30 20:19:36.111934+02
38	lopez rondet		t	2023-05-30 20:19:36.112779+02
39	maor		t	2023-05-30 20:19:36.113581+02
40	marteau		t	2023-05-30 20:19:36.114455+02
41	mathieu		t	2023-05-30 20:19:36.115248+02
42	maumon		t	2023-05-30 20:19:36.116067+02
43	michel		t	2023-05-30 20:19:36.116977+02
44	mifoundou		t	2023-05-30 20:19:36.11775+02
45	milesi		t	2023-05-30 20:19:36.126069+02
46	moulin		t	2023-05-30 20:19:36.127674+02
47	pelletier		t	2023-05-30 20:19:36.130896+02
48	plantaz		t	2023-05-30 20:19:36.132436+02
49	quoy		t	2023-05-30 20:19:36.133815+02
50	ravier		t	2023-05-30 20:19:36.13518+02
51	tacussel		t	2023-05-30 20:19:36.136522+02
52			t	2023-05-30 20:19:36.137872+02
1	appriou		t	2023-05-30 20:19:35.639165+02
2	arnaud		f	2023-05-30 20:19:35.748522+02
\.


--
-- Data for Name: timesheet_teacher; Type: TABLE DATA; Schema: public; Owner: timesheet
--

COPY public.timesheet_teacher (id, lastname, firstname, email, password, is_admin, is_visible, created_at) FROM stdin;
1	admin	admin	admin@gmail.com	$2b$10$65FYPfT3pckoiFMV7MUTuuvBw3E5socUowITTlOHMOHRrm8n4Cxu.	t	t	2023-05-30 20:19:20.725265+02
2	Anaïs		anais@gmail.com	$2b$10$wnbptvVWCjgNUdYH3uJ5F.GXz0JSSFIVWXbVNMdbqFJOrOG9CJryW	f	t	2023-05-30 20:19:36.139275+02
3	Eléa		elea@gmail.com	$2b$10$wjxZGYU8b0IHLoW26sKCx.z/9coaDUlXOf3m1fRwD0BYJjrLdRFqS	f	t	2023-05-30 20:19:36.166341+02
5	Maurice		maurice@gmail.com	$2b$10$YgocjA8DVVpobRvmj7RwkuTHPtp4DPhTNsDPyIarEttighqNfrPrq	f	t	2023-05-30 20:19:36.216705+02
7	Benjamin		benjamin@gmail.com	$2b$10$HsIBq5KBNz5MZYjWVbCH8ugKBFcpiEwI56HXIoPbcX/XFWBdkC4cy	f	t	2023-05-30 20:19:36.246645+02
8	Violaine		violaine@gmail.com	$2b$10$px9Z/eX8yO9snZ8GSv6nPOzlrLDFPKFF8cSeSpQyM6.396pRXzNVW	f	t	2023-05-30 20:19:36.252825+02
9	Florie		florie@gmail.com	$2b$10$V3MTtD0OUqP9xUGs317ET.S2BisVmjXMO61RfUSyLQQW68Ag8lLKq	f	t	2023-05-30 20:19:36.288617+02
4	Léa	 	lea@gmail.com	$2b$10$9K74zR4bO0lyRnI6Y2FmHuBIWkPU4l9HupV.hImgGnMHIUqDaVTPG	t	t	2023-05-30 20:19:36.176333+02
10	ripo	lilo	ripo@gmail.com	$2b$10$2uEfGUrRtp7BPgDQ9YEOcug9v/3VWVTfuMN/IbtVnnUtkD5sn4J8S	f	t	2023-05-31 17:17:55.724298+02
\.


--
-- Data for Name: timesheet_teacher_has_student; Type: TABLE DATA; Schema: public; Owner: timesheet
--

COPY public.timesheet_teacher_has_student (id, teacher_id, student_id, is_visible, created_at) FROM stdin;
1	5	1	t	2023-05-30 20:19:42.151916+02
2	5	2	t	2023-05-30 20:19:42.479299+02
3	5	3	t	2023-05-30 20:19:42.743243+02
4	5	4	t	2023-05-30 20:19:42.98944+02
5	5	5	t	2023-05-30 20:19:43.230455+02
6	5	6	t	2023-05-30 20:19:43.470331+02
7	5	7	t	2023-05-30 20:19:43.717999+02
8	5	8	t	2023-05-30 20:19:43.997033+02
9	5	9	t	2023-05-30 20:19:44.268849+02
10	5	10	t	2023-05-30 20:19:44.533795+02
11	5	11	t	2023-05-30 20:19:44.807183+02
12	5	12	t	2023-05-30 20:19:45.077633+02
13	5	13	t	2023-05-30 20:19:45.340185+02
14	5	14	t	2023-05-30 20:19:45.669108+02
15	4	2	t	2023-05-30 20:19:48.172794+02
16	4	3	t	2023-05-30 20:19:48.333405+02
17	4	4	t	2023-05-30 20:19:48.509015+02
18	4	5	t	2023-05-30 20:19:48.686602+02
19	4	6	t	2023-05-30 20:19:48.855459+02
20	4	7	t	2023-05-30 20:19:49.044967+02
21	4	8	t	2023-05-30 20:19:49.244823+02
22	4	9	t	2023-05-30 20:19:49.420933+02
23	4	10	t	2023-05-30 20:19:49.62099+02
24	4	11	t	2023-05-30 20:19:49.853499+02
25	4	12	t	2023-05-30 20:19:50.084658+02
26	4	13	t	2023-05-30 20:19:50.588689+02
27	4	14	t	2023-05-30 20:19:50.897779+02
28	4	15	t	2023-05-30 20:19:51.197125+02
37	2	3	t	2023-05-30 20:19:58.588082+02
38	2	4	t	2023-05-30 20:19:58.74945+02
39	2	5	t	2023-05-30 20:19:58.916222+02
40	2	6	t	2023-05-30 20:19:59.084529+02
41	2	7	t	2023-05-30 20:19:59.236181+02
42	2	8	t	2023-05-30 20:19:59.396393+02
43	2	9	t	2023-05-30 20:19:59.579183+02
45	7	4	t	2023-05-30 20:20:03.364706+02
46	7	5	t	2023-05-30 20:20:03.525003+02
47	7	6	t	2023-05-30 20:20:03.692706+02
48	7	7	t	2023-05-30 20:20:03.860775+02
49	7	8	t	2023-05-30 20:20:04.020835+02
50	7	9	t	2023-05-30 20:20:04.177835+02
51	7	10	t	2023-05-30 20:20:04.340219+02
52	1	4	t	2023-05-30 20:20:06.682001+02
53	1	5	t	2023-05-30 20:20:06.837058+02
54	1	6	t	2023-05-30 20:20:07.005413+02
55	1	7	t	2023-05-30 20:20:07.155653+02
56	1	8	t	2023-05-30 20:20:07.314465+02
57	1	9	t	2023-05-30 20:20:07.484899+02
58	1	10	t	2023-05-30 20:20:07.645724+02
59	1	11	t	2023-05-30 20:20:07.811879+02
60	1	12	t	2023-05-30 20:20:07.941538+02
61	8	20	t	2023-05-30 20:20:12.180999+02
62	8	21	t	2023-05-30 20:20:12.332643+02
63	8	22	t	2023-05-30 20:20:12.498525+02
64	8	23	t	2023-05-30 20:20:12.658965+02
65	8	24	t	2023-05-30 20:20:12.821035+02
66	8	25	t	2023-05-30 20:20:12.979886+02
67	8	26	t	2023-05-30 20:20:13.145601+02
68	9	5	t	2023-05-30 20:20:15.835003+02
69	9	6	t	2023-05-30 20:20:15.997013+02
70	9	7	t	2023-05-30 20:20:16.162457+02
71	9	8	t	2023-05-30 20:20:16.324201+02
72	9	9	t	2023-05-30 20:20:16.483604+02
73	9	10	t	2023-05-30 20:20:16.636982+02
74	9	11	t	2023-05-30 20:20:16.796296+02
75	9	12	t	2023-05-30 20:20:16.988808+02
76	3	4	t	2023-05-30 20:20:19.660382+02
77	3	5	t	2023-05-30 20:20:19.810324+02
78	3	6	t	2023-05-30 20:20:19.981559+02
79	3	7	t	2023-05-30 20:20:20.133332+02
80	3	8	t	2023-05-30 20:20:20.292959+02
81	3	9	t	2023-05-30 20:20:20.460678+02
82	3	10	t	2023-05-30 20:20:20.613803+02
83	3	11	t	2023-05-30 20:20:20.773813+02
84	10	3	t	2023-05-31 17:19:11.538676+02
85	10	4	t	2023-05-31 17:19:12.431232+02
86	10	5	t	2023-05-31 17:19:12.829366+02
87	10	20	t	2023-05-31 17:19:17.627189+02
88	10	18	t	2023-05-31 17:19:18.643496+02
89	10	33	t	2023-05-31 17:19:20.165164+02
90	10	31	t	2023-05-31 17:19:20.997079+02
\.


--
-- Data for Name: changes; Type: TABLE DATA; Schema: sqitch; Owner: timesheet
--

COPY sqitch.changes (change_id, script_hash, change, project, note, committed_at, committer_name, committer_email, planned_at, planner_name, planner_email) FROM stdin;
77718f66100c6cd78c4791c8d783a2c67c39dfd4	9d74762ff7ae1cea87b68ab16cedfe09ff43418c	inti-tables	timesheet	init tables	2023-05-30 20:19:05.879995+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	6fb33c20b14e418ccceb7c85a0cc93f8f5772324	unique	timesheet	refact unique as timesheet_teacher_has_student table	2023-05-30 20:19:05.973921+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
\.


--
-- Data for Name: dependencies; Type: TABLE DATA; Schema: sqitch; Owner: timesheet
--

COPY sqitch.dependencies (change_id, type, dependency, dependency_id) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: sqitch; Owner: timesheet
--

COPY sqitch.events (event, change_id, change, project, note, requires, conflicts, tags, committed_at, committer_name, committer_email, planned_at, planner_name, planner_email) FROM stdin;
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-03-03 00:11:41.065891+01	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-03-03 00:11:50.298645+01	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-03-03 00:11:52.949669+01	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
fail	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-08 14:53:08.548855+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-08 14:54:57.559956+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-08 14:57:56.105185+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-08 14:58:00.887597+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-08 14:58:11.091508+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-08 16:15:16.401565+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-24 20:21:13.188911+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-24 20:21:13.291716+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-24 20:21:19.985656+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-24 20:21:20.070577+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-24 20:38:37.456936+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-24 20:38:37.550459+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-24 20:38:40.539061+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-24 20:38:40.622105+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-24 20:41:11.028231+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-24 20:41:11.118032+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-24 20:41:13.060441+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-24 20:41:13.142371+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-26 14:21:59.459276+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-26 14:21:59.561017+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-26 14:22:05.532856+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-26 14:22:05.638404+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-26 19:45:27.928246+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-26 19:45:28.029128+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-26 19:45:34.516552+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-26 19:45:34.619367+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-27 00:24:56.407606+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-27 00:24:56.500397+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
fail	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-27 00:24:59.687734+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
fail	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-27 00:26:26.401919+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-27 00:26:42.458534+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-27 00:26:42.561271+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-27 00:56:02.799557+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-27 00:56:02.906273+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-27 00:56:05.577311+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-27 00:56:05.670929+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-27 01:07:09.365086+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-27 01:07:09.467646+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-27 01:07:13.452301+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-27 01:07:13.545705+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-28 19:58:54.426874+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-28 19:58:54.52522+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-28 19:59:00.181379+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-28 19:59:00.2695+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-28 23:53:54.629029+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-28 23:53:54.741524+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-28 23:53:57.380196+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-28 23:53:57.485059+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-29 00:33:08.681758+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-29 00:33:08.790997+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-29 00:33:11.17494+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-29 00:33:11.262333+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-29 14:47:42.279558+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-29 14:47:42.383304+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-29 14:47:48.38381+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-29 14:47:48.472115+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 13:58:42.678163+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 13:58:42.772066+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 13:58:45.262273+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 13:58:45.344351+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 13:59:44.500123+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 13:59:44.589724+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 13:59:47.110638+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 13:59:47.210894+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:29:04.497903+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:29:04.587701+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:29:06.399754+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:29:06.482372+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:37:44.507753+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:37:44.593644+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:37:46.464261+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:37:46.54651+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:42:06.431608+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:42:06.52265+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:42:08.367367+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:42:08.462257+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:44:06.714984+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:44:06.805763+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:44:08.667281+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:44:08.748734+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:47:35.027387+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:47:35.12419+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 14:47:37.363096+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 14:47:37.447523+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 20:19:03.418443+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
revert	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 20:19:03.527099+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	77718f66100c6cd78c4791c8d783a2c67c39dfd4	inti-tables	timesheet	init tables	{}	{}	{}	2023-05-30 20:19:05.881754+02	llio,,,	llio@llio-desktop	2023-03-02 23:59:55+01	llio,,,	llio@llio-desktop
deploy	16b58a8f5c9d54a2467cf2d2d82ec83aefb8a930	unique	timesheet	refact unique as timesheet_teacher_has_student table	{}	{}	{}	2023-05-30 20:19:05.975366+02	llio,,,	llio@llio-desktop	2023-05-08 14:47:49+02	llio,,,	llio@llio-desktop
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: sqitch; Owner: timesheet
--

COPY sqitch.projects (project, uri, created_at, creator_name, creator_email) FROM stdin;
timesheet	\N	2023-03-03 00:11:40.94043+01	llio,,,	llio@llio-desktop
\.


--
-- Data for Name: releases; Type: TABLE DATA; Schema: sqitch; Owner: timesheet
--

COPY sqitch.releases (version, installed_at, installer_name, installer_email) FROM stdin;
1.1	2023-03-03 00:11:40.937997+01	llio,,,	llio@llio-desktop
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: sqitch; Owner: timesheet
--

COPY sqitch.tags (tag_id, tag, project, change_id, note, committed_at, committer_name, committer_email, planned_at, planner_name, planner_email) FROM stdin;
\.


--
-- Name: timesheet_signature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: timesheet
--

SELECT pg_catalog.setval('public.timesheet_signature_id_seq', 27, true);


--
-- Name: timesheet_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: timesheet
--

SELECT pg_catalog.setval('public.timesheet_student_id_seq', 52, true);


--
-- Name: timesheet_teacher_has_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: timesheet
--

SELECT pg_catalog.setval('public.timesheet_teacher_has_student_id_seq', 90, true);


--
-- Name: timesheet_teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: timesheet
--

SELECT pg_catalog.setval('public.timesheet_teacher_id_seq', 10, true);


--
-- Name: timesheet_teacher_has_student check_values; Type: CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_teacher_has_student
    ADD CONSTRAINT check_values UNIQUE (teacher_id, student_id);


--
-- Name: timesheet_signature timesheet_signature_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_signature
    ADD CONSTRAINT timesheet_signature_pkey PRIMARY KEY (id);


--
-- Name: timesheet_student timesheet_student_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_student
    ADD CONSTRAINT timesheet_student_pkey PRIMARY KEY (id);


--
-- Name: timesheet_teacher timesheet_teacher_email_key; Type: CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_teacher
    ADD CONSTRAINT timesheet_teacher_email_key UNIQUE (email);


--
-- Name: timesheet_teacher_has_student timesheet_teacher_has_student_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_teacher_has_student
    ADD CONSTRAINT timesheet_teacher_has_student_pkey PRIMARY KEY (id);


--
-- Name: timesheet_teacher timesheet_teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_teacher
    ADD CONSTRAINT timesheet_teacher_pkey PRIMARY KEY (id);


--
-- Name: changes changes_pkey; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.changes
    ADD CONSTRAINT changes_pkey PRIMARY KEY (change_id);


--
-- Name: changes changes_project_script_hash_key; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.changes
    ADD CONSTRAINT changes_project_script_hash_key UNIQUE (project, script_hash);


--
-- Name: dependencies dependencies_pkey; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.dependencies
    ADD CONSTRAINT dependencies_pkey PRIMARY KEY (change_id, dependency);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (change_id, committed_at);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project);


--
-- Name: projects projects_uri_key; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.projects
    ADD CONSTRAINT projects_uri_key UNIQUE (uri);


--
-- Name: releases releases_pkey; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.releases
    ADD CONSTRAINT releases_pkey PRIMARY KEY (version);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (tag_id);


--
-- Name: tags tags_project_tag_key; Type: CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.tags
    ADD CONSTRAINT tags_project_tag_key UNIQUE (project, tag);


--
-- Name: timesheet_signature timesheet_signature_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_signature
    ADD CONSTRAINT timesheet_signature_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.timesheet_student(id) ON DELETE CASCADE;


--
-- Name: timesheet_signature timesheet_signature_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_signature
    ADD CONSTRAINT timesheet_signature_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.timesheet_teacher(id) ON DELETE CASCADE;


--
-- Name: timesheet_teacher_has_student timesheet_teacher_has_student_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_teacher_has_student
    ADD CONSTRAINT timesheet_teacher_has_student_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.timesheet_student(id) ON DELETE CASCADE;


--
-- Name: timesheet_teacher_has_student timesheet_teacher_has_student_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet
--

ALTER TABLE ONLY public.timesheet_teacher_has_student
    ADD CONSTRAINT timesheet_teacher_has_student_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.timesheet_teacher(id) ON DELETE CASCADE;


--
-- Name: changes changes_project_fkey; Type: FK CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.changes
    ADD CONSTRAINT changes_project_fkey FOREIGN KEY (project) REFERENCES sqitch.projects(project) ON UPDATE CASCADE;


--
-- Name: dependencies dependencies_change_id_fkey; Type: FK CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.dependencies
    ADD CONSTRAINT dependencies_change_id_fkey FOREIGN KEY (change_id) REFERENCES sqitch.changes(change_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dependencies dependencies_dependency_id_fkey; Type: FK CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.dependencies
    ADD CONSTRAINT dependencies_dependency_id_fkey FOREIGN KEY (dependency_id) REFERENCES sqitch.changes(change_id) ON UPDATE CASCADE;


--
-- Name: events events_project_fkey; Type: FK CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.events
    ADD CONSTRAINT events_project_fkey FOREIGN KEY (project) REFERENCES sqitch.projects(project) ON UPDATE CASCADE;


--
-- Name: tags tags_change_id_fkey; Type: FK CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.tags
    ADD CONSTRAINT tags_change_id_fkey FOREIGN KEY (change_id) REFERENCES sqitch.changes(change_id) ON UPDATE CASCADE;


--
-- Name: tags tags_project_fkey; Type: FK CONSTRAINT; Schema: sqitch; Owner: timesheet
--

ALTER TABLE ONLY sqitch.tags
    ADD CONSTRAINT tags_project_fkey FOREIGN KEY (project) REFERENCES sqitch.projects(project) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--


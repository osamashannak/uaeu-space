DROP SCHEMA IF EXISTS "professor" CASCADE;
DROP SCHEMA IF EXISTS "course" CASCADE;
DROP SCHEMA IF EXISTS "account" CASCADE;

DROP TABLE IF EXISTS "public"."feedback_entry";
DROP TABLE IF EXISTS "public"."feedback";

DROP FUNCTION IF EXISTS "public"."update_review_reply_count"();
DROP FUNCTION IF EXISTS "public"."trg_reply_like_increment"();
DROP FUNCTION IF EXISTS "public"."trg_reply_like_decrement"();
DROP FUNCTION IF EXISTS "public"."trg_increment_rating"();
DROP FUNCTION IF EXISTS "public"."trg_decrement_rating"();

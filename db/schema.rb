# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151031172444) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bridges", force: :cascade do |t|
    t.string   "bridgename"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "categorySAT"
  end

  create_table "cluster_client_goals", force: :cascade do |t|
    t.integer  "frequencyGoal"
    t.integer  "diversityGoal"
    t.integer  "bridge"
    t.integer  "bridgeGlobal"
    t.integer  "year"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "cluster_clients", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "clusters", force: :cascade do |t|
    t.text     "cluster_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "email_aggregates", force: :cascade do |t|
    t.string   "domain"
    t.integer  "frequency"
    t.integer  "category"
    t.integer  "categoryGlobal"
    t.integer  "month"
    t.integer  "year"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "emails", force: :cascade do |t|
    t.string   "emaildomain"
    t.integer  "bridge"
    t.integer  "bridge_global"
    t.integer  "email_frequency"
    t.integer  "month"
    t.integer  "year"
    t.integer  "cluster_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "emails", ["cluster_id"], name: "index_emails_on_cluster_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.integer  "cluster_id"
    t.integer  "access_permission"
    t.string   "email"
    t.string   "password_digest"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_foreign_key "emails", "clusters"
end

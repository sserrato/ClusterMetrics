class CreateEmails < ActiveRecord::Migration
  def change
    create_table :emails do |t|
      t.string :emaildomain
      t.integer :bridge
      t.integer :bridgeGlobal
      t.integer :emailFrequency
      t.integer :month
      t.integer :year
      t.references :cluster, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

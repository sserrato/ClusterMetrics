class CreateEmailAggregates < ActiveRecord::Migration
  def change
    create_table :email_aggregates do |t|
      t.string :domain
      t.integer :frequency
      t.integer :category
      t.integer :categoryGlobal
      t.integer :month
      t.integer :year

      t.timestamps null: false
    end
  end
end

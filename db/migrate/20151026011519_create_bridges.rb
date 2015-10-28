class CreateBridges < ActiveRecord::Migration
  def change
    create_table :bridges do |t|
      t.string :bridgename
      t.text :description
      t.text :sundaramCategory
      t.timestamps null: false
    end
  end
end

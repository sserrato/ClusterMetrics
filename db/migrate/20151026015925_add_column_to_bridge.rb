class AddColumnToBridge < ActiveRecord::Migration
  def change
    add_column :bridges, :SATCategory, :integer
  end
end

class RemoveColumnBridge < ActiveRecord::Migration
  def change
    remove_column :bridges, :SATCategory, :string
  end
end

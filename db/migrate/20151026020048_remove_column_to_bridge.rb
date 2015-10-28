class RemoveColumnToBridge < ActiveRecord::Migration
  def change
    remove_column :bridges, :sundaramCategory, :string
  end
end

class AddColumnBridge < ActiveRecord::Migration
  def change
        add_column :bridges, :categorySAT, :integer
  end
end
